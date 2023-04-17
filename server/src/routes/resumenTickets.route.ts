import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import logger from "../utils/logger";
import ClienteServicioTicketRespuesta from "../entities/tickets/ClienteServicioTicketRespuesta.entity";
import ClienteServicioTicket from "../entities/tickets/ClienteServicioTicket.entity";

const getRespuestasUser = async (req: Request, res: Response) => {
  try {
    //TODO? Agregar subrutas para GET /tickets para los que el usuario tenga: 1. accion pendiente; 2. accion rechazada; 3. ticket completado 
    const usuarioAsignado = res.locals.username;
    const respAsignados = await AppDataSource.getRepository(ClienteServicioTicketRespuesta).find({
      order: { fechaCreacion: "DESC" },
      relations: [
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
      ],
      where : { usuarioAsignado }
    });
    return res.json(respAsignados);
  } catch (error) {
    logger.apierror("getTicketsUser: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const getTicketsUser = async (req: Request, res: Response) => {
  try {
    //TODO? Agregar subrutas para GET /tickets para los que el usuario tenga: 1. accion pendiente; 2. accion rechazada; 3. ticket completado 
    const usuarioAsignado = res.locals.user.username;
    const ticketsAsignados = await AppDataSource.getRepository(ClienteServicioTicket)
    .createQueryBuilder("ticket")
    .leftJoinAndSelect("ticket.respuestas", "respuesta")
    .leftJoinAndSelect("respuesta.usuarioAsignado", "usuarioAsignado")
    .where("respuesta.usuarioAsignado = :usuarioAsignado", {usuarioAsignado})
    .getMany();
    return res.json(ticketsAsignados);
  } catch (error) {
    logger.apierror("getTicketsUser: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const router = Router();
router.get("/", user, auth, getTicketsUser);
export default router;
