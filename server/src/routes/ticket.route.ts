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

const ticketsRepo = AppDataSource.manager.getRepository(ClienteServicioTicket);
const grupoRepo = AppDataSource.manager.getRepository(GrupoTicket);

const clienteServicioRepo =
  AppDataSource.manager.getRepository(ClienteServicio);
const flujoRespuestaRepo = AppDataSource.manager.getRepository(
  GrupoTicketFlujoRespuestas
);

const crearTicket = async (req: Request, res: Response) => {
  logger.apiinfo("Crear Ticket desde API");
  let ticket: ClienteServicioTicket;
  let flujoRespuestas: GrupoTicketFlujoRespuestas[];
  try {
    const {
      idClienteServicio,
      origen,
      descripcion,
      nombreGrupo,
      telefonoContacto,
      nombreContacto,
      direccion,
      severidad
    } = req.body;
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
    res.status(200).json();
  } catch (error) {
    logger.apierror("crearTicket: No se creo el flujo de respuestas\n"+error);
    res.status(206).json("Se creo el ticket pero no su flujo de respuetas. Crear manualmente\n"+error);
  }
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
    logger.apiinfo(
      `${ticket.grupo.tipo.toString()}-${flujoRespuestas[i].area}: Esperando ${
        flujoRespuestas[i].accion
      }`
    );
  }
  logger.apiinfo(`Respuestas guardadas para SS:${ticket.id}`);
};

const actualizarTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const id = Number.parseInt(idTicket);
  logger.apiinfo("Actualizar Ticket " + idTicket);
  try {
    const { idClienteServicio, origen, descripcion, nombreGrupo } = req.body;
    const ticket = await ticketsRepo.findOne({
      where: { id },
    });
    ticket.clienteServicio = idClienteServicio ?? ticket.clienteServicio;
    ticket.origen = origen ?? ticket.origen;
    ticket.descripcion = descripcion ?? ticket.descripcion;
    ticket.grupo = nombreGrupo ?? ticket.grupo;
    ticket.usuarioCreacion = res.locals.user;
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
  const postsPerPage: number = (req.query.count || 8) as number;

  try {
    //TODO: Obtener solo tickets que incluyan tu area en sus respuestas?
    //TODO? Agregar subrutas para GET /tickets para los que el usuario tenga: 1. accion pendiente; 2. accion rechazada; 3. ticket completado 
    const tickets = await ticketsRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: [
        "usuarioCreacion",
        "respuestas",
        "respuestas.usuarioCreacion",
        "respuestas.usuarioAsignado",
        "respuestas.comentarios",
        "respuestas.comentarios.usuarioCreacion",
        "clienteServicio",
        "clienteServicio.cliente",
        "clienteServicio.servicio",
        "clienteServicio.servicio.categoria",
        "grupo"
      ],
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
      relations: [
        "usuarioCreacion",
        "respuestas",
        "respuestas.usuarioCreacion",
        "respuestas.usuarioAsignado",
        "respuestas.comentarios",
        "respuestas.comentarios.usuarioCreacion",
        "clienteServicio",
        "clienteServicio.cliente",
        "clienteServicio.servicio",
        "clienteServicio.servicio.categoria",
        "grupo"
      ],
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

const router = Router();
router.post("/", user, auth, crearTicket);
router.put("/", user, actualizarTicket);
router.get("/", user, getTickets);
router.get("/:idTicket", getTicket);
router.put("/:idTicket/anular", user, anularTicket);
router.delete("/:idTicket", user, deleteTicket);
router.patch("/:idTicket", getTicket);
export default router;
