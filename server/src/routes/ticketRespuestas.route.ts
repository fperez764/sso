import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import auth from "../middleware/auth.middleware";
import logger from "../utils/logger";
import ClienteServicioTicket from "../entities/tickets/ClienteServicioTicket.entity";
import ClienteServicioTicketRespuesta from "../entities/tickets/ClienteServicioTicketRespuesta.entity";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";

const ticketRepo = AppDataSource.manager.getRepository(ClienteServicioTicket);
const tRespuestaRepo = AppDataSource.manager.getRepository(
  ClienteServicioTicketRespuesta
);

/**
 * Crea una respuesta extra asociada a un ticket (no sigue el flujo pre-definido por areas)
 * @param req
 * @param res
 * @returns
 */
const nuevaRespuestaTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const { estado, respuesta, accion, area, orden } = req.body;
  try {
    const ticket = await ticketRepo.findOneByOrFail({
      id: Number.parseInt(idTicket),
    });

    const respuestaS = new ClienteServicioTicketRespuesta({
      estado,
      respuesta,
      area,
      usuarioCreacion: res.locals.user,
      ticket,
      accion,
      orden,
    });
    let errores = await validate(respuestaS);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await respuestaS.save();
    return res.json(respuestaS);
  } catch (err) {
    logger.apierror(err);
    return res.status(404).json({ message: "No se encontro la Ticket" + err });
  }
};

/***
 * Actualiza una respuesta existente cambiando unicamente los campos definidos por el usuario: accion y respuesta
 * Esto genera una concatenacion en la respuesta, para no perder los datos de la anterior respuesta.
 */
const actualizarTicketRespuesta = async (req: Request, res: Response) => {
  const { idRespuesta } = req.params;
  const id = Number.parseInt(idRespuesta);
  logger.apiinfo("Actualizar respuesta de ticket " + idRespuesta);
  try {
    const { estado, respuesta, accion } = req.body;
    const resp = await tRespuestaRepo.findOne({
      where: { id },
    });
    resp.estado = estado ?? resp.estado;
    resp.respuesta = `'${resp.accion}-${resp.respuesta} el ${resp.fechaModificacion} por ${resp.usuarioCreacion.username}' \n ${respuesta}`;
    resp.accion = accion ?? resp.accion;
    resp.usuarioCreacion = res.locals.user;
    let errores = await validate(resp);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await resp.save();
    return res.json(resp);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo actualizar la respuesta: " + error });
  }
};

const iniciarEspera = async (req: Request, res: Response) => {
  const { idTicket: idRespuesta } = req.params;
  const id = Number.parseInt(idRespuesta);
  logger.apiinfo("Iniciar espera para respuesta " + idRespuesta);
  try {
    const resp = await tRespuestaRepo.findOne({
      where: { id },
      relations: ["ticketFlujoRespuesta"],
    });
    const fechaInicio = new Date();
    const vigencia = resp.ticketFlujoRespuesta
      ? resp.ticketFlujoRespuesta.vigenciaDias
      : Number.parseInt(process.env.VIGENCIA_RESPUESTAS_DEFECTO);
    resp.fechaFin = fechaInicio;
    resp.fechaFin.setDate(fechaInicio.getDate() + vigencia);
    await resp.save();
  } catch (error) {
    logger.apierror("Algo salio mal al iniciar respuesta " + id);
    return res
      .status(500)
      .json({ error: "Algo salio mal al iniciar respuesta " + id + error });
  }
};

const router = Router();
router.post("/:idTicket/respuestas", auth, nuevaRespuestaTicket);
router.put(":/idTicket", actualizarTicketRespuesta);
router.post("/:idTicket/respuestas/iniciar", auth, iniciarEspera);

export default router;
