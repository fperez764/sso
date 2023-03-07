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
  try {
    const {
      idClienteServicio,
      origen,
      descripcion,
      nombreGrupo,
      telefonoContacto,
      nombreContacto,
      direccion,
    } = req.body;
    const usuarioCreacion: User = res.locals.user;
    if (!descripcion || descripcion.trim() === "") {
      return res
        .status(400)
        .json({ descripcion: "Descripcion no puede ser vacia" });
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
    const ticket = new ClienteServicioTicket({
      origen,
      descripcion,
      usuarioCreacion,
      grupo,
      clienteServicio,
      telefonoContacto: newTel,
      nombreContacto: newNom,
      direccion: newDir,
    });

    const flujoRespuestas = await flujoRespuestaRepo
      .createQueryBuilder("flujo")
      .where("flujo.grupo = :nombre", { nombre: grupo.nombre })
      .getMany();
    if (flujoRespuestas.length === 0) {
      const message = `No se encontraron respuestas pre-definidas para el tipo de solicitud ${grupo.tipo}`;
      logger.apiwarn(message);
      throw message;
    }
    let errores = await validate(flujoRespuestas);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await ticket.save();
    await crearFlujoRespuestasTicket(ticket, flujoRespuestas);
    return res.json(ticket);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo agregar la solicitud: " + error });
  }
};

const crearFlujoRespuestasTicket = async (
  ticket: ClienteServicioTicket,
  flujoRespuestas: GrupoTicketFlujoRespuestas[]
) => {
  logger.apiinfo(
    `Se encontraron ${flujoRespuestas.length} respuestas para la solicitud ${ticket.id}`
  );
  flujoRespuestas.forEach(async (respFlujo) => {
    const respuestaS = new ClienteServicioTicketRespuesta({
      estado: Estado.PENDIENTE,
      respuesta: "",
      area: respFlujo.area,
      usuarioCreacion: ticket.usuarioCreacion,
      ticket,
      orden: respFlujo.orden,
      accion: respFlujo.accion,
      ticketFlujoRespuesta: respFlujo,
    });
    const saveRes = await respuestaS.save();
    logger.apiinfo(
      `${ticket.grupo.tipo.toString()}-${respFlujo.area}: Esperando ${
        respFlujo.accion
      }`
    );
  });
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
    return res
      .status(500)
      .json({ error: "No se pudo actualizar la solicitud: " + error });
  }
};

const getTickets = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 8) as number;

  try {
    const solicitudesS = await ticketsRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: [
        "usuarioCreacion",
        "respuestas",
        "respuestas.usuarioCreacion",
        "respuestas.comentarios",
        "respuestas.comentarios.usuarioCreacion",
        "clienteServicio",
        "clienteServicio.cliente",
        "clienteServicio.servicio",
        "clienteServicio.servicio.categoria",
        "grupo",
      ],
      skip: currentPage * postsPerPage,
      take: postsPerPage,
    });
    // if (res.locals.user) {
    //   solicitudesS.forEach((s) => s.setUserRespondio(res.locals.user));
    // }
    return res.json(solicitudesS);
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
      relations: ["clienteServicio", "grupo", "respuestas", "comentarios"],
    });
    return res.json(ticket);
  } catch (error) {
    logger.apierror(error);
    return res.status(500).json({ error: "Algo salio mal " + error });
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
    return res.status(500).json({ error: "Algo salio mal " + error });
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
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", user, auth, crearTicket);
router.put("/", actualizarTicket);
router.get("/", user, getTickets);
router.get("/:idTicket", getTicket);
router.put("/:idTicket/anular", anularTicket);
router.delete("/:idTicket", deleteTicket);
router.patch("/:idTicket", getTicket);
export default router;
