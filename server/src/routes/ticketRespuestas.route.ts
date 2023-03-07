import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import auth from "../middleware/auth.middleware";
import logger from "../utils/logger";
import ClienteServicioTicket from "../entities/tickets/ClienteServicioTicket.entity";
import ClienteServicioTicketRespuesta, {
  Estado,
} from "../entities/tickets/ClienteServicioTicketRespuesta.entity";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";
import ClienteServicioTicketRespuestaComentario from "../entities/tickets/ClienteServicioTicketRespuestaComentario.entity";
import User from "../entities/User.entity";

const ticketRepo = AppDataSource.manager.getRepository(ClienteServicioTicket);
const respuestasRepo = AppDataSource.manager.getRepository(
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
    const resp = await respuestasRepo.findOne({
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
    iniciarEsperaRespuesta(id);
  } catch (error) {
    logger.apierror("Algo salio mal al iniciar respuesta " + id);
    return res
      .status(500)
      .json({ error: "Algo salio mal al iniciar respuesta " + id + error });
  }
};

const iniciarEsperaRespuesta = async (idResp: number) => {
  const resp = await respuestasRepo.findOne({
    where: { id: idResp },
    relations: ["ticketFlujoRespuesta"],
  });
  if (!resp) throw "No se encontro la respuesta con id: " + idResp;
  const fechaInicio = new Date();
  const vigencia = resp.ticketFlujoRespuesta
    ? resp.ticketFlujoRespuesta.vigenciaDias
    : Number.parseInt(process.env.VIGENCIA_RESPUESTAS_DEFECTO);
  resp.fechaInicio = resp.fechaFin = fechaInicio;
  resp.fechaFin.setDate(fechaInicio.getDate() + vigencia);
  //
  await resp.save();
  return resp;
};

//Agrega un texto de respuesta e inicializa la espera de la siguiente accion/respuesta
const responder = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  const id = Number.parseInt(idTicketRespuesta);
  logger.apiinfo("Responder respuesta de ticket " + idTicketRespuesta);
  try {
    const { respuesta } = req.body;
    if (!respuesta)
      return res.status(400).json({ message: "Respuesta es requerida" });
    const resp = await respuestasRepo.findOne({
      where: { id },
      relations: ["ticket", "ticket.respuestas"],
    });
    // if (!!resp.fechaRespuesta) {
    //   return res
    //     .status(406)
    //     .json({ message: "Respondida el " + resp.fechaRespuesta });
    // }
    resp.respuesta = respuesta;
    resp.usuarioRespuesta = res.locals.user;
    resp.fechaRespuesta = new Date();
    resp.estado = Estado.ACEPTADO;
    await resp.save();
    //Inicia la vigencia de la siguiente respuesta
    const respuestas = resp.ticket.respuestas.sort((r, s) => r.orden - s.orden);
    const idx = respuestas.indexOf(respuestas.find((r) => r.id === resp.id));
    if (idx + 1 < respuestas.length) {
      await iniciarEsperaRespuesta(respuestas[idx + 1].id);
    }
    return res.json(resp);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo actualizar la respuesta: " + error });
  }
};

/***
 * 'Por implementar\n Esta respuesta: '+
  '1. Se marca respuesta como rechazada.\n'+
  '2. Se limpian las vigencias\n'+ 
  '3. Se agrega un comentario con la razon del rechazo a la respuesta\n
  Anterior respuesta:\n'+
  '1. Se agrega una extensión de vigencia(reinicio de ');}
 */
const rechazar = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  const id = Number.parseInt(idTicketRespuesta);
  logger.apiinfo("Rechazar respuesta de ticket " + idTicketRespuesta);
  try {
    const { respuesta } = req.body;
    if (!respuesta)
      return res.status(400).json({ message: "Respuesta es requerida" });
    const resp = await respuestasRepo.findOne({
      where: { id },
      relations: ["ticket", "ticket.respuestas"],
    });
    if (!!resp.fechaRespuesta) {
      return res
        .status(406)
        .json({ message: "Respondida el " + resp.fechaRespuesta });
    }

    resp.usuarioRespuesta = res.locals.user;
    resp.estado = Estado.RECHAZADO;
    resp.fechaInicio = null;
    resp.fechaFin = null;
    await resp.save();
    //Reinicia la vigencia de la anterior respuesta
    const respuestas = resp.ticket.respuestas.sort((r, s) => r.orden - s.orden);
    const idx = respuestas.indexOf(respuestas.find((r) => r.id === resp.id));
    if (idx - 1 > 0) {
      await iniciarEsperaRespuesta(respuestas[idx - 1].id);
    } else {
      throw "No se puede rechazar la primera respuesta. Anule el ticket.";
    }
    //Remueve la respuesta, fechaRespuesta de la anterior respuesta y la guarda como comentario? Respondido rechazado
    anular(respuestas[idx - 1], res.locals.user);
    return res.json(resp);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo actualizar la respuesta: " + error });
  }
};

//Cuando alguien se equivoco al responder o la siguiente respuesta es rechazada
//Guarda el contanido de la respuesta en un comentario a si misma
const anular = async (
  resp: ClienteServicioTicketRespuesta,
  usuarioRechazo: User
) => {
  let comentario = `Respuesta rechazada ${resp.respuesta} de ${resp.usuarioRespuesta}`;
  const comentarioRechazo = new ClienteServicioTicketRespuestaComentario({
    comentario,
    ticketRespuesta: resp,
    usuarioCreacion: usuarioRechazo,
  });
  await comentarioRechazo.save();
  resp.fechaRespuesta = null;
  resp.respuesta = null;
  await resp.save();
};

const comentarRespuesta = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  const { comentario } = req.body;
  if (!comentario && comentario.trim === "") {
    return res
      .status(400)
      .json({ comentario: "Comentario no puede ser vacio" });
  }
  try {
    const resp = await respuestasRepo.findOneByOrFail({
      id: Number.parseInt(idTicketRespuesta),
    });
    const comentarioRespuesta = new ClienteServicioTicketRespuestaComentario({
      comentario,
      ticketRespuesta: resp,
      usuarioCreacion: res.locals.user,
    });
    let errores = await validate(comentarRespuesta);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await comentarioRespuesta.save();
    return res.json(comentarioRespuesta);
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(404).json({ message: "No se encontro el ticket" });
  }
};

const eliminarPasoRespuesta = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  try {
    const resp = await respuestasRepo.findOneByOrFail({
      id: Number.parseInt(idTicketRespuesta),
    });
    resp.usuarioBaja = res.locals.user;
    resp.save();
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(404).json({ message: "No se encontro el ticket" });
  }
};

const router = Router();
router.post("/:idTicketRespuesta", auth, nuevaRespuestaTicket);
router.put("/:idTicketRespuesta", actualizarTicketRespuesta);
router.post("/:idTicketRespuesta/iniciar", auth, iniciarEspera);
router.post("/:idTicketRespuesta/responder", auth, responder);
router.post("/:idTicketRespuesta/rechazar", auth, rechazar);
router.delete("/:idTicketRespuesta", auth, eliminarPasoRespuesta);
router.post("/idTicketRespuesta/comentar", auth, comentarRespuesta);
export default router;
