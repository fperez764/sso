import { Request, response, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import logger from "../utils/logger";
import ClienteServicio from "../entities/cliente/ClienteServicio.entity";
import ServicioTicket from "../entities/tickets/ServicioTicket.entity";
import ServicioTicketComentario from "../entities/tickets/ServicioTicketComentario.entity";
import ServicioTicketRespuesta, {
  Estado,
} from "../entities/tickets/ServicioTicketRespuesta.entity";
import TicketGrupo from "../entities/tickets/TicketGrupo.entity";
import TicketFlujoRespuesta from "../entities/tickets/TicketFlujoRespuesta.entity";

const ticketsRepo = AppDataSource.manager.getRepository(ServicioTicket);
const grupoRepo = AppDataSource.manager.getRepository(TicketGrupo);

const clienteServicioRepo =
  AppDataSource.manager.getRepository(ClienteServicio);
const flujoRespuestaRepo =
  AppDataSource.manager.getRepository(TicketFlujoRespuesta);

const crearTicket = async (req: Request, res: Response) => {
  logger.info("Crear Ticket desde API");
  try {
    const { idClienteServicio, origen, descripcion, nombreGrupo } = req.body;
    const usuarioCreacion: User = res.locals.user;
    if (!descripcion || descripcion.trim() === "") {
      return res
        .status(400)
        .json({ descripcion: "Descripcion no puede ser vacia" });
    }
    //Encontrar ClienteServicio
    const clienteServicio = await clienteServicioRepo.findOneByOrFail({
      id: Number.parseInt(idClienteServicio),
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

    const ticket = new ServicioTicket({
      origen,
      descripcion,
      usuarioCreacion,
      grupo,
      clienteServicio,
    });

    const flujoRespuestas = await flujoRespuestaRepo
      .createQueryBuilder("flujo")
      .where("flujo.grupo = :nombre", { nombre: grupo.nombre })
      .getMany();
    if (flujoRespuestas.length === 0) {
      const message = `No se encontraron respuestas pre-definidas para el tipo de solicitud ${grupo.tipo}`;
      logger.warn(message);
      throw message;
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
  ticket: ServicioTicket,
  flujoRespuestas: TicketFlujoRespuesta[]
) => {
  logger.debug(
    `Se encontraron ${flujoRespuestas.length} respuestas para la solicitud ${ticket.id}`
  );
  flujoRespuestas.forEach(async (respFlujo) => {
    const respuestaS = new ServicioTicketRespuesta({
      estado: Estado.PENDIENTE,
      respuesta: "",
      area: respFlujo.area,
      usuarioCreacion: ticket.usuarioCreacion,
      ticket,
      orden: respFlujo.orden,
      accion: respFlujo.accion,
    });
    const saveRes = await respuestaS.save();
    logger.debug(
      `${ticket.grupo.tipo.toString()}-${respFlujo.area}: Esperando ${
        respFlujo.accion
      }`
    );
  });
  logger.info(`Respuestas guardadas para SS:${ticket.id}`);
};

const actualizarTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const id = Number.parseInt(idTicket);
  console.log("Actualizar Ticket " + idTicket);
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
        "comentarios",
        "clienteServicio",
        "grupo",
      ],
      skip: currentPage * postsPerPage,
      take: postsPerPage,
    });
    if (res.locals.user) {
      solicitudesS.forEach((s) => s.setUserVote(res.locals.user));
    }
    return res.json(solicitudesS);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const id = Number.parseInt(idTicket);
  logger.info("Get Ticket " + id);
  try {
    const ticket = await ticketsRepo.findOne({
      where: {
        id,
      },
      relations: ["clienteServicio", "grupo", "respuestas", "comentarios"],
    });
    return res.json(ticket);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const comentarTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const { comentario } = req.body;
  if (!comentario && comentario.trim === "") {
    return res
      .status(400)
      .json({ comentario: "Comentario no puede ser vacio" });
  }
  try {
    const ticket = await ticketsRepo.findOneByOrFail({
      id: Number.parseInt(idTicket),
    });
    const comentarioTicket = new ServicioTicketComentario({
      comentario,
      ticket,
      usuarioCreacion: res.locals.user,
    });

    await comentarioTicket.save();
    return res.json(comentarioTicket);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "No se encontro el ticket" });
  }
};

/***
 * Elimina un ticket de ClienteServicio de base de datos TODO: solo dar de baja sin borrar el registro
 */
const deleteTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const id = Number.parseInt(idTicket);
  logger.warn(`Se eliminara el ticket ${idTicket}`);
  try {
    const ticket = await ticketsRepo.findOne({
      where: {
        id,
      },
      relations: {
        respuestas: true,
        comentarios: true,
      },
    });
    logger.warn(ticket.descripcion);
    ticket.respuestas.forEach((resp: ServicioTicketRespuesta) => {
      logger.warn(resp.id + " eliminada");
      resp.remove();
    });
    ticket.comentarios.forEach((com: ServicioTicketComentario) => {
      logger.warn(com.id + " eliminada");
      com.remove();
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
  logger.warn(`Se anulara el ticket ${idTicket}`);
  try {
    const ticket = await ticketsRepo.findOne({
      where: {
        id,
      },
      relations: {
        respuestas: true,
        comentarios: true,
      },
    });
    logger.warn(ticket.descripcion);
    ticket.respuestas.forEach((resp: ServicioTicketRespuesta) => {
      resp.usuarioBaja = res.locals.user;
      resp.save();
    });
    ticket.comentarios.forEach((com: ServicioTicketComentario) => {
      com.usuarioBaja = res.locals.user;
      com.save();
    });

    ticket.usuarioBaja = res.locals.user;
    ticket.save();
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
router.post("/:idTicket/comentarios", user, auth, comentarTicket);
router.put("/anular/:idTicket", anularTicket);
router.delete("/:idTicket", deleteTicket);
router.patch("/:idTicket", getTicket);
export default router;
