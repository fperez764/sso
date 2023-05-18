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
import GrupoTicket, { GrupoEscogerLuego } from "../entities/tickets/GrupoTicket.entity";
import GrupoTicketFlujoRespuestas from "../entities/tickets/GrupoTicketFlujoRespuestas.entity";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";
import ClienteServicioModem from "../entities/cliente/ClienteServicioModem.entity";
import { IsNull, Not } from "typeorm";
import { iniciarEsperaRespuesta } from "./ticketRespuestas.route";

const ticketsRepo = AppDataSource.manager.getRepository(ClienteServicioTicket);
const grupoRepo = AppDataSource.manager.getRepository(GrupoTicket);

const relations = [
  "clienteServicio",
  "clienteServicio.cliente",
  "clienteServicio.servicio",
  "clienteServicio.servicio.categoria",
  "grupo",
];

const ticketRelations = [
  "usuarioCreacion",
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

const clienteServicioRepo =
  AppDataSource.manager.getRepository(ClienteServicio);
const flujoRespuestaRepo = AppDataSource.manager.getRepository(
  GrupoTicketFlujoRespuestas
);


const getTickets = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 10) as number;

  try {
    //TODO: Obtener solo tickets que incluyan tu area en sus respuestas?
    //TODO? Agregar subrutas para GET /tickets para los que el usuario tenga: 1. accion pendiente; 2. accion rechazada; 3. ticket completado 
    const tickets = await ticketsRepo.find({
      order: { fechaCreacion: "DESC", resuelto: "DESC" },
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

const getTicketsArea = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 15) as number;

  try {
    const respAreaNoRespondidas = await AppDataSource.getRepository(ClienteServicioTicketRespuesta).find({
      order: { fechaCreacion: "DESC" },
      where: { area: res.locals.user.area, fechaRespuesta: IsNull()},
      relations: ticketRelations,
      skip: currentPage * postsPerPage,
      take: postsPerPage,
  })
    const porResponder = respAreaNoRespondidas.filter(r => r.ticket.porResponder.id === r.id); 
    const asignadas = porResponder.filter(r => r.usuarioAsignado?.username === res.locals.user.username);
    const asignables = porResponder.filter(r => !r.usuarioAsignado && !asignadas.find(rAsignada => rAsignada.ticket.id === r.ticket.id));
    const tickets = [...asignadas.map(r => r.ticket), ...asignables.map(r=> r.ticket)];
    return res.json(tickets);
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getTusTickets = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 15) as number;
  try {
    let tickets = await ticketsRepo.find({
      order: { fechaCreacion: "DESC" },
      relations,
      skip: currentPage * postsPerPage,
      take: postsPerPage,
    });
    tickets = tickets.filter(t => t.usuarioCreacion.username === res.locals.user.username);
    const ticketsOrdenados = [...tickets.filter(t => !!t.porResponder), ...tickets.filter(t => !t.porResponder)];
    return res.json(ticketsOrdenados);
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getTicketsRespondidos = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 15) as number;
  try {
    let respRespondidas = await AppDataSource.getRepository(ClienteServicioTicketRespuesta).find({
      order: { fechaCreacion: "DESC", leido: "DESC" },
      relations: ticketRelations,
      where: {fechaRespuesta: Not(IsNull())},
      skip: currentPage * postsPerPage,
      take: postsPerPage,
    });
    respRespondidas = respRespondidas.filter(r => r.usuarioAsignado?.username === res.locals.user.username);
    const tickets = respRespondidas.map(r=>r.ticket);
    const ticketsEnProceso = tickets.filter(t => !!t.porResponder);
    const ticketsUnicos = ticketsEnProceso.filter((value, index, self) => index === self.findIndex(t => t.id === value.id));
    return res.json(ticketsUnicos);
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(500).json({ error: "Algo salio mal " + err });
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

const crearTicket = async (req: Request, res: Response) => {
  logger.apiinfo("Crear Ticket desde API");
  let ticket: ClienteServicioTicket;
  const {
    idClienteServicio,
    origen,
    descripcion,
    telefonoContacto,
    nombreContacto,
    direccion,
    severidad,
    macModems,
    nombreGrupo
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
    const newTel = telefonoContacto ?? clienteServicio.cliente.telefono;
    const newNom = nombreContacto ?? clienteServicio.cliente.nombreCompleto;
    const newDir = direccion ?? clienteServicio.cliente.direccion;
    //TODO*: Si el contacto es nuevo guardarlo en una tabla de contactos asociada al cliente
    ticket = new ClienteServicioTicket({
      origen,
      descripcion,
      usuarioCreacion,
      clienteServicio,
      telefonoContacto: newTel,
      nombreContacto: newNom,
      direccion: newDir,
      severidad
    });
    await ticket.save();

  } catch (error) {
    logger.apierror("crearTicket: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal al crear el ticket\n" + error);
  }
  
  if(!macModems) return res.status(200).json("Ticket fueron creado correctamente, id: " + ticket.id);
  try {
    // Encontrar y vincular modems
    const modemRepo = AppDataSource.manager.getRepository(ClienteServicioModem);
    const modemsFoundSet = new Set<ClienteServicioModem>();
    for(const mac of macModems){
      const modem = await modemRepo.findOne({where: {mac}});
      if(modem) {
        const added = modemsFoundSet.add(modem);
        logger.apiinfo(added);
      }
    const modemsFound = Array.from(modemsFoundSet);
    ticket.modems = modemsFound;
    ticket = await ticket.save();
    }
  } catch (error) {
    logger.apierror("crearTicket: No se pudieron agregar modems al ticket\n"+error);
    res.status(206).json("No se pudieron agregar modems al ticket. agregar manualmente\n"+error);
  }
  try {
    if(nombreGrupo === GrupoEscogerLuego)
      await crearRespuestaPorDefecto(res.locals.user, ticket);    
      else {
        await agregarFlujoATicket(ticket.id, nombreGrupo);
      }
  } catch (error) {
    logger.apierror(`crearTicket: id:${ticket.id} No se pudo agregar ${nombreGrupo ? 'Flujo': 'Respuesta por defecto'}\n${error}`);
    res.status(206).json(`Ticket id:${ticket.id} creado. No se pudo agregar ${nombreGrupo ? 'Flujo': 'Respuesta por defecto'}\n${error}`);        
  }
  return res.status(200).json("Todos los datos del ticket fueron creados correctamente, id: " + ticket.id);
};

const crearRespuestaPorDefecto = async (user: User, ticket: ClienteServicioTicket) => {
  //Crea accion unica para agregar grupo:
  const fechaInicio = new Date();
  let fechaFin = new Date();
  fechaFin.setDate(fechaInicio.getDate() + Number.parseInt(process.env.VIGENCIA_RESPUESTAS_DEFECTO || '1'));
  const respuestaPorDefect = new ClienteServicioTicketRespuesta({
    estado: Estado.PENDIENTE,
    respuesta: "",
    area: user.area,
    usuarioCreacion: user,
    ticket,
    orden: 0,
    fechaInicio,
    fechaFin,
    accion: 'Confirmar Ticket y asignar FLUJO',
    ticketFlujoRespuesta: null,
  });
  await respuestaPorDefect.save();
};

const agregarFlujoATicket = async (idTicket: number, nombreGrupo: string) => {
  let flujoRespuestas: GrupoTicketFlujoRespuestas[];
  try {
    //Encontrar ticket
    const ticket = await ticketsRepo.findOneByOrFail({ id: idTicket });
    //Encontrar Sub
    const grupo = await grupoRepo.findOneByOrFail({ nombre: nombreGrupo });
    flujoRespuestas = await flujoRespuestaRepo
      .createQueryBuilder("flujo")
      .where("flujo.grupo = :nombre", { nombre: nombreGrupo })
      .getMany();

      if (!flujoRespuestas || flujoRespuestas.length === 0) {
        const message = `No se encontraron respuestas pre-definidas para el tipo de solicitud ${grupo.tipo}`;
        logger.apiwarn(message);
        throw message;
      }    
      await crearFlujoRespuestasTicket(ticket, flujoRespuestas);
  } catch (error) {
    throw "crearTicket: No se creo el flujo de respuestas\n"+error;
  }
}

const crearFlujoRespuestasTicket = async (
  ticket: ClienteServicioTicket,
  flujoRespuestas: GrupoTicketFlujoRespuestas[]
) => {
  logger.apiinfo(
    `Se encontraron ${flujoRespuestas.length} respuestas para la solicitud ${ticket.id}`
  );
  for (let i = 0; i < flujoRespuestas.length; i++) {
    const flujoRespuesta = flujoRespuestas[i];
    const saveRes = await crearRespuestaTicket(flujoRespuesta, ticket);
    if(i===0) await iniciarEsperaRespuesta(saveRes.id);
  }
  logger.apiinfo(`Respuestas guardadas para SS:${ticket.id}`);
};

const crearRespuestaTicket = async (flujoRespuesta: GrupoTicketFlujoRespuestas, ticket: ClienteServicioTicket) => {
  const respuesta = new ClienteServicioTicketRespuesta({
    estado: Estado.PENDIENTE,
    respuesta: "",
    area: flujoRespuesta.area,
    usuarioCreacion: ticket.usuarioCreacion,
    ticket,
    orden: flujoRespuesta.orden,
    accion: flujoRespuesta.accion,
    ticketFlujoRespuesta: flujoRespuesta,
  });
  logger.apiinfo(`Ticket ${ticket.id} Nueva respuesta: ${respuesta.orden}-${respuesta.accion}`);
  const nuevaRes = await respuesta.save();
  return nuevaRes;
}

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
    ticket.resuelto = true;
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

/***
 * Elimina un ticket de ClienteServicio de base de datos
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

    ticket.remove();
    return res.json(ticket);
  } catch (error) {
    logger.apierror("deleteTicket: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

/**
 * Elimina administrativamente el ticket: fechaBaja, usuarioBaja. Ademas hace lo mismo para todas sus respuestas/comentarios.
 * @param req 
 * @param res 
 */
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
      resp.comentarios.forEach(
        async (com: ClienteServicioTicketRespuestaComentario) => {
          com.usuarioBaja = res.locals.user;
          await com.save();
          await com.softRemove();
        }
      );
      resp.usuarioBaja = res.locals.user;
      await resp.save();
      await resp.softRemove();
    });

    ticket.usuarioBaja = res.locals.user;
    await ticket.save();
    return res.json(ticket);
  } catch (error) {
    logger.apierror("anularTicket: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const router = Router();
router.get("/", user, getTickets);
router.get("/asignados", user, auth, getTicketsArea);//Asigandos + asignables
router.get("/tuyos", user, auth, getTusTickets);//Creados por ti enproceso+resueltos
router.get("/respondidos", user, auth, getTicketsRespondidos);//asignados con respuesta en proceso
router.get("/:idTicket", getTicket);

router.post("/", user, auth, crearTicket);
router.post("/resolver/:idTicket", user, auth, resolverTicket);

router.put("/:idTicket", user, auth, actualizarTicket);
router.put("/:idTicket/anular", user, auth, anularTicket);

router.patch("/:idTicket", getTicket);
router.delete("/:idTicket", user, auth, deleteTicket);
export default router;
