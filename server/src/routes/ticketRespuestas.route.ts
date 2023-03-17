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
import User, { Roles } from "../entities/User.entity";
import dayjs from "dayjs";

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
    //TODO: Verificar si la siguiente respuesta ya fue respondida
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
    return res.status(404).json("No se encontro el Ticket" + err);
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
    if (!!resp.respuesta)
      return res.status(403).json("Esta accion ya fue respondida, no puede modificarse");
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
      .json("No se pudo actualizar la respuesta: " + error);
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
      .json(`Algo salio mal al iniciar espera en respuesta:${id}\n${error}`);
  }
};

const iniciarEsperaRespuesta = async (idResp: number) => {
  const resp = await respuestasRepo.findOne({
    where: { id: idResp },
    relations: ["ticketFlujoRespuesta"],
  });
  if (!resp) throw "No se encontro la respuesta con id: " + idResp;
  if (!!resp.respuesta)
    return "Esta accion ya fue respondida";
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
      return res.status(400).json("Respuesta es requerida");
    const resp = await respuestasRepo.findOne({
      where: { id },
      relations: ["ticket", "ticket.respuestas"],
    });
    if(resp.ticket.porResponder.id !== id) return res.status(403).json(`Se debe responder o rechazar ${resp.ticket.porResponder.id} primero`)
    if (!!resp.respuesta)
      return res
        .status(403)
        .json("Esta accion ya fue respondida");
    resp.respuesta = respuesta;
    resp.usuarioAsignado = res.locals.user;
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
      .json("No se pudo actualizar la respuesta: ");
  }
};

/***
 *TODO: Marca respuesta como rechazada. Limpia las vigencias. Agrega un comentario con la razon del rechazo a la respuesta
 *TODO: Anterior respuesta: Se agrega una extensión de vigencia; se convierte la respuesta en comentario; estado vuelve a pendiente.  
 */
const rechazar = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  logger.apiinfo("Rechazar respuesta de ticket " + idTicketRespuesta);
  const { respuesta } = req.body;
  if (!respuesta)
    return res.status(400).json("Respuesta es requerida");

  try {
    const id = Number.parseInt(idTicketRespuesta);
    const resp = await respuestasRepo.findOne({
      where: { id },
      relations: ["ticket", "ticket.respuestas", "ticket.respuestas.usuarioAsignado"],
    });
    if(resp.ticket.porResponder.id !== id) return res.status(403).json(`Se debe responder o rechazar ${resp.ticket.porResponder.id} primero`)
    const respuestas = resp.ticket.respuestas.sort((r, s) => r.orden - s.orden);
    const idx = respuestas.indexOf(respuestas.find((r) => r.id === resp.id));
    if (idx - 1 < 0) throw "No se puede rechazar la primera respuesta. Anule el ticket.";
    if (!!resp.respuesta) return res.status(403)
        .json("No puedes rechazar una acción ya respondida");

    resp.usuarioAsignado = res.locals.user;
    resp.estado = Estado.RECHAZADO;
    resp.fechaInicio = null;
    resp.fechaFin = null;
    await resp.save();
    //Acciones anterior respuesta: Reinicia vigencias; vuelve la respuesta en comentario y la limpia
    await rechazarRespuestaAnterior(respuestas[idx - 1], res.locals.user, respuesta);
    return res.json(resp);
  } catch (error) {
    return res
      .status(500)
      .json("No se pudo actualizar la respuesta: " + error);
  }
};
//Cuando alguien se equivoco al responder o la siguiente respuesta es rechazada
//Guarda el contanido de la respuesta en un comentario a si misma
const rechazarRespuestaAnterior = async (
  resp: ClienteServicioTicketRespuesta,
  usuarioRechazo: User, causaRechazo: string
) => {
  if(!resp) throw 'No se puede rechazar respuesta null';
  const comentario = `RECHAZO: '${resp.respuesta}' en fecha ${dayjs(resp.fechaRespuesta).format("DD/MM/YYYY HH:mm")} de ${resp.usuarioAsignado.username}. Causa: ${causaRechazo}`
  resp.respuesta = null;
  resp.fechaRespuesta = null;
  resp.estado = Estado.PENDIENTE;
  await resp.save();
  const comentarioRespuesta = new ClienteServicioTicketRespuestaComentario({
    comentario,
    ticketRespuesta: resp,
    usuarioCreacion: usuarioRechazo,
  });
  await comentarioRespuesta.save();
  await iniciarEsperaRespuesta(resp.id);
};

const comentarRespuesta = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  const { comentario } = req.body;
  if (!comentario && comentario.trim === "") {
    return res
      .status(400)
      .json("Comentario no puede ser vacio");
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
    return res.status(404).json("No se encontro el ticket");
  }
};

const eliminarPasoRespuesta = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  try {
    const resp = await respuestasRepo.findOneByOrFail({
      id: Number.parseInt(idTicketRespuesta),
    });
    if (!!resp.respuesta)
      return res
        .status(403)
        .json("Esta accion ya fue respondida");
    resp.usuarioBaja = res.locals.user;
    resp.save();
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(404).json("No se encontro el ticket");
  }
};

const asignar = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  const { usuario } = req.body;
  if (!usuario) {
    return res
      .status(400)
      .json("Se debe especificar el usuario por asignarse.");
  }
  try {
    const user: User = res.locals.user;
    const resp = await respuestasRepo.findOneByOrFail({
      id: Number.parseInt(idTicketRespuesta),
    });
    if (!!resp.respuesta)
      return res
        .status(403)
        .json("Esta accion ya fue respondida");
    const usuarioAsignado = await AppDataSource.getRepository(
      User
    ).findOneByOrFail({
      username: usuario,
    });
    const puedeAsignar =
      user.rol === Roles.ADMIN || //Asigna porque es admin
      (user.area === resp.area && //Solo asigna si es del area
        (user === usuarioAsignado ||
          user.rol === Roles.JEFE ||
          Roles.DIRECTOR)); //O se autoasigna o es jefe
    if (!puedeAsignar) {
      return res.status(401).json(`Solo el jefe de área de ${resp.area} puede asignar esta accion o un funcionario de la misma autoasignarsela.`);
    }
    resp.usuarioAsignado = usuarioAsignado;
    resp.save();
    return res.status(200).json("Acción asignada a " + usuario);
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(404).json("No se encontro el ticket");
  }
};

const getRespuesta = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  try {
    const resp = await respuestasRepo.findOneOrFail({
      where:{id: Number.parseInt(idTicketRespuesta)}, relations: ["comentarios", "comentarios.usuarioCreacion"]
    });
    return res.json(resp);
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(404).json("No se encontro el ticket");
  }
};


const router = Router();
router.post("/:idTicketRespuesta", auth, nuevaRespuestaTicket);
router.put("/:idTicketRespuesta", actualizarTicketRespuesta);
router.post("/:idTicketRespuesta/iniciar", auth, iniciarEspera);
router.post("/:idTicketRespuesta/asignar", asignar);
router.post("/:idTicketRespuesta/responder", responder);
router.post("/:idTicketRespuesta/rechazar", auth, rechazar);
router.post("/:idTicketRespuesta/comentar", auth, comentarRespuesta);
router.delete("/:idTicketRespuesta", auth, eliminarPasoRespuesta);
router.get("/:idTicketRespuesta", getRespuesta);
export default router;
