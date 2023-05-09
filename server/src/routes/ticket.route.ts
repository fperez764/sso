import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import logger from "../utils/logger";
import ClienteServicio from "../entities/cliente/ClienteServicio.entity";
import ClienteServicioTicket from "../entities/tickets/ClienteServicioTicket.entity";
import ClienteServicioTicketRespuestaComentario from "../entities/tickets/ClienteServicioTicketRespuestaComentario.entity";
import ClienteServicioTicketRespuesta, {
  Estado,
} from "../entities/tickets/ClienteServicioTicketRespuesta.entity";
import GrupoTicket from "../entities/tickets/GrupoTicket.entity";
import GrupoTicketFlujoRespuestas from "../entities/tickets/GrupoTicketFlujoRespuestas.entity";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";
import ClienteServicioModem from "../entities/cliente/ClienteServicioModem.entity";
import { IsNull, Not } from "typeorm";
import { iniciarEsperaRespuesta } from "./ticketRespuestas.route";

const ticketsRepo = AppDataSource.manager.getRepository(ClienteServicioTicket);
const grupoRepo = AppDataSource.manager.getRepository(GrupoTicket);

const relations = [
  "usuarioCreacion",
  "clienteServicio",
  "clienteServicio.cliente",
  "clienteServicio.servicio",
  "clienteServicio.servicio.categoria",
  "grupo",
];

const clienteServicioRepo =
  AppDataSource.manager.getRepository(ClienteServicio);
const flujoRespuestaRepo = AppDataSource.manager.getRepository(
  GrupoTicketFlujoRespuestas
);

const crearTicket = async (req: Request, res: Response) => {
  logger.apiinfo("Crear Ticket desde API");
  let ticket: ClienteServicioTicket;
  let flujoRespuestas: GrupoTicketFlujoRespuestas[];
  const {
    idClienteServicio,
    origen,
    descripcion,
    nombreGrupo,
    telefonoContacto,
    nombreContacto,
    direccion,
    severidad,
    macModems,
  } = req.body;
  try {
    const usuarioCreacion: User = res.locals.user;
    if (!descripcion || descripcion.trim() === "") {
      return res
        .status(400)
        .json("Descripcion no puede ser vacia");
    }
    //Encontrar ClienteServicio
    const clienteServicio = await clienteServicioRepo.findOne({
      where: { id: Number.parseInt(idClienteServicio) },
      relations: ["cliente"],
    });
    //En este caso mandar error especial para crear cliente en frontend
    if (!clienteServicio)
      throw {
        error:
          "Cliente-Servicio no encontrado, cree primero el cliente y su servicio asociado antes de intentar crear el ticket.",
      };
    //Encontrar Sub
    const grupo = nombreGrupo
      ? await grupoRepo.findOneByOrFail({
          nombre: nombreGrupo,
        })
      : null;

    const newTel = telefonoContacto ?? clienteServicio.cliente.telefono;
    const newNom = nombreContacto ?? clienteServicio.cliente.nombreCompleto;
    const newDir = direccion ?? clienteServicio.cliente.direccion;
    //TODO*: Si el contacto es nuevo guardarlo en una tabla de contactos asociada al cliente
    ticket = new ClienteServicioTicket({
      origen,
      descripcion,
      usuarioCreacion,
      grupo,
      clienteServicio,
      telefonoContacto: newTel,
      nombreContacto: newNom,
      direccion: newDir,
      severidad
    });

    flujoRespuestas = await flujoRespuestaRepo
      .createQueryBuilder("flujo")
      .where("flujo.grupo = :nombre", { nombre: grupo.nombre })
      .getMany();
    if (!flujoRespuestas || flujoRespuestas.length === 0) {
      const message = `No se encontraron respuestas pre-definidas para el tipo de solicitud ${grupo.tipo}`;
      logger.apiwarn(message);
      throw message;
    }
    await ticket.save();
  } catch (error) {
    logger.apierror("crearTicket: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal al crear el ticket\n" + error);
  }
  try {
    if (ticket && flujoRespuestas)
      await crearFlujoRespuestasTicket(ticket, flujoRespuestas);
  } catch (error) {
    logger.apierror("crearTicket: No se creo el flujo de respuestas\n"+error);
    res.status(206).json("Se creo el ticket pero no su flujo de respuetas. Crear manualmente\n"+error);
  }
  try {
    // Encontrar y vincular modems
    if(macModems){
    const modemRepo = AppDataSource.manager.getRepository(ClienteServicioModem);
    const modemsFoundSet = new Set<ClienteServicioModem>();
    for(const mac of macModems){
      const modem = await modemRepo.findOne({where: {mac}});
      if(modem) {
        const added = modemsFoundSet.add(modem);
        logger.apiinfo(added);
      }
    }    
    const modemsFound = Array.from(modemsFoundSet);
    ticket.modems = modemsFound;
    await ticket.save();
    }
  } catch (error) {
    logger.apierror("crearTicket: No se pudieron agregar modems al ticket\n"+error);
    res.status(206).json("No se pudieron agregar modems al ticket. agregar manualmente\n"+error);
  }
  return res.status(200).json("Todos los datos del ticket fueron creados correctamente, id: " + ticket.id);
};

const crearFlujoRespuestasTicket = async (
  ticket: ClienteServicioTicket,
  flujoRespuestas: GrupoTicketFlujoRespuestas[]
) => {
  logger.apiinfo(
    `Se encontraron ${flujoRespuestas.length} respuestas para la solicitud ${ticket.id}`
  );
  for (let i = 0; i < flujoRespuestas.length; i++) {
    const respuesta = new ClienteServicioTicketRespuesta({
      estado: Estado.PENDIENTE,
      respuesta: "",
      area: flujoRespuestas[i].area,
      usuarioCreacion: ticket.usuarioCreacion,
      ticket,
      orden: flujoRespuestas[i].orden,
      accion: flujoRespuestas[i].accion,
      ticketFlujoRespuesta: flujoRespuestas[i],
    });
    let errores = await validate(respuesta);
    if (errores.length > 0) {
      throw JSON.stringify(errores);
    }
    const saveRes = await respuesta.save();
    if(i=0) iniciarEsperaRespuesta(saveRes.id);
    logger.apiinfo(
      `${ticket.grupo.tipo.toString()}-${flujoRespuestas[i].area}: Esperando ${
        flujoRespuestas[i].accion
      }`
    );
  }
  logger.apiinfo(`Respuestas guardadas para SS:${ticket.id}`);
};


const resolverTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  logger.apiinfo(`Resolver Ticket: ${idTicket} anulara las respuestas pendientes`);
  try {
    const id = Number.parseInt(idTicket);
    const ticket = await ticketsRepo.findOne({
      where: { id },
    });
    if(!ticket.respuestas.find(r => r.fechaRespuesta)) return res.status(403).json("Ticket debe tener al menos una accion respondida") 
    const respuestasPendientes = ticket.respuestas.filter(r => !r.fechaRespuesta);
    for(let i = 0; i < respuestasPendientes.length; i++){
      respuestasPendientes[i].usuarioBaja = res.locals.user.username;
      await respuestasPendientes[i].save();
      await respuestasPendientes[i].softRemove();
    }

    await ticket.save();
    return res.json(ticket);
  } catch (error) {
    logger.apierror("actualizarTicket: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};



const actualizarTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const id = Number.parseInt(idTicket);
  logger.apiinfo("Actualizar Ticket " + idTicket);
  try {
    const { severidad, origen, descripcion, nombreGrupo } = req.body;
    const ticket = await ticketsRepo.findOne({
      where: { id },
    });
    if(descripcion && descripcion.length > 0) ticket.descripcion = descripcion;
    if(severidad && severidad.length > 0) ticket.severidad = severidad;
    if(origen && origen.length > 0) ticket.origen = origen;
    ticket.usuarioCreacion = res.locals.user;

    const nuevoGrupo = await grupoRepo.findOne({where:{nombre: nombreGrupo}});
    if(nuevoGrupo) ticket.grupo = nuevoGrupo;

    let errores = await validate(ticket);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await ticket.save();
    return res.json(ticket);
  } catch (error) {
    logger.apierror("actualizarTicket: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const getTickets = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 15) as number;

  try {
    //TODO: Obtener solo tickets que incluyan tu area en sus respuestas?
    //TODO? Agregar subrutas para GET /tickets para los que el usuario tenga: 1. accion pendiente; 2. accion rechazada; 3. ticket completado 
    const tickets = await ticketsRepo.find({
      order: { fechaCreacion: "DESC" },
      relations,
      skip: currentPage * postsPerPage,
      take: postsPerPage,
    });
    return res.json(tickets);
  } catch (error) {
    logger.apierror("getTickets: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const getTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const id = Number.parseInt(idTicket);
  logger.apiinfo("Get Ticket " + id);
  try {
    const ticket = await ticketsRepo.findOne({
      where: {
        id,
      },
      relations
    });
    return res.json(ticket);
  } catch (error) {
    logger.apierror("getTicket: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

/***
 * Elimina un ticket de ClienteServicio de base de datos TODO: solo dar de baja sin borrar el registro
 */
const deleteTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const id = Number.parseInt(idTicket);
  logger.apiwarn(`Se eliminara el ticket ${idTicket}`);
  try {
    const ticket = await ticketsRepo.findOne({
      where: {
        id,
      },
      relations: ["respuestas", "respuestas.comentarios"],
    });
    logger.apiwarn(ticket.descripcion);
    ticket.respuestas.forEach((resp: ClienteServicioTicketRespuesta) => {
      logger.apiwarn(resp.id + " eliminada");
      resp.remove();
      resp.comentarios.forEach(
        (com: ClienteServicioTicketRespuestaComentario) => {
          logger.apiwarn(com.id + " eliminada");
          com.remove();
        }
      );
    });

    ticket.remove();
    return res.json(ticket);
  } catch (error) {
    logger.apierror("deleteTicket: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const anularTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const id = Number.parseInt(idTicket);
  logger.apiwarn(`Se anulara el ticket ${idTicket}`);
  try {
    const ticket = await ticketsRepo.findOne({
      where: {
        id,
      },
      relations: ["respuestas", "respuestas.comentarios"],
    });
    logger.apiwarn(ticket.descripcion);
    ticket.respuestas.forEach(async (resp: ClienteServicioTicketRespuesta) => {
      resp.usuarioBaja = res.locals.user;
      await resp.save();
      resp.comentarios.forEach(
        async (com: ClienteServicioTicketRespuestaComentario) => {
          com.usuarioBaja = res.locals.user;
          await com.save();
        }
      );
    });

    ticket.usuarioBaja = res.locals.user;
    await ticket.save();
    return res.json(ticket);
  } catch (error) {
    logger.apierror("anularTicket: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const ticketRelations = [
  "ticket.usuarioCreacion",
  "ticket.respuestas",
  "ticket.respuestas.usuarioCreacion",
  "ticket.respuestas.usuarioAsignado",
  "ticket.respuestas.comentarios",
  "ticket.respuestas.comentarios.usuarioCreacion",
  "ticket.clienteServicio",
  "ticket.clienteServicio.cliente",
  "ticket.clienteServicio.servicio",
  "ticket.clienteServicio.servicio.categoria",
  "ticket.grupo",
  "ticket"
];

const getTicketsArea = async (req: Request, res: Response) => {
  try {
    const respAsignadas = await AppDataSource.getRepository(ClienteServicioTicketRespuesta).find({
      order: { fechaCreacion: "DESC", leido: "DESC" },
      relations: ticketRelations,
      where : { usuarioAsignado: res.locals.user, fechaRespuesta: IsNull() }
    });
    const respAsignables = await AppDataSource.getRepository(ClienteServicioTicketRespuesta).find({
      order: { fechaCreacion: "DESC", leido: "DESC" },
      relations: ticketRelations,
      where : { area: res.locals.user.area, fechaRespuesta: IsNull()}
    });
    const tickets = [...respAsignadas.map(r => r.ticket), ...respAsignables.map(r=>r.ticket)];
    const ticketsUnicos = tickets.filter((value, index, self) => index === self.findIndex(t => t.id === value.id));
    return res.json(ticketsUnicos);
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getTusTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketsRepo.find({
      order: { fechaCreacion: "DESC" },
      relations,
      where: {usuarioCreacion: res.locals.user}
    });
    const ticketsOrdenados = [...tickets.filter(t => !!t.porResponder), ...tickets.filter(t => !t.porResponder)];
    return res.json(ticketsOrdenados);
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getTicketsRespondidos = async (req: Request, res: Response) => {
  try {
    const respRespondidas = await AppDataSource.getRepository(ClienteServicioTicketRespuesta).find({
      order: { fechaCreacion: "DESC", leido: "DESC" },
      relations: ticketRelations,
      where : { usuarioAsignado: res.locals.user, fechaRespuesta: Not(IsNull()) }
    });
    const tickets = respRespondidas.map(r=>r.ticket);
    const ticketsEnProceso = tickets.filter(t => !!t.porResponder);
    const ticketsUnicos = ticketsEnProceso.filter((value, index, self) => index === self.findIndex(t => t.id === value.id));
    return res.json(ticketsUnicos);
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const router = Router();
router.post("/", user, auth, crearTicket);
router.post("/resolver/:idTicket", user, auth, resolverTicket);
router.put("/:idTicket", user, auth, actualizarTicket);
router.get("/", user, getTickets);
router.get("/asignados", user, getTicketsArea);//Asigandos + asignables
router.get("/tuyos", user, getTusTickets);//Creados por ti enproceso+resueltos
router.get("/respondidos", user, getTicketsRespondidos);//asignados con respuesta en proceso
router.get("/:idTicket", getTicket);
router.put("/:idTicket/anular", user, auth, anularTicket);
router.delete("/:idTicket", user, auth, deleteTicket);
router.patch("/:idTicket", getTicket);
export default router;
