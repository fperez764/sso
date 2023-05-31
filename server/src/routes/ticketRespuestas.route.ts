import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import logger from "../utils/logger";
import ClienteServicioTicket from "../entities/tickets/ClienteServicioTicket.entity";
import ClienteServicioTicketRespuesta, {
  Estado,
} from "../entities/tickets/ClienteServicioTicketRespuesta.entity";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";
import ClienteServicioTicketRespuestaComentario from "../entities/tickets/ClienteServicioTicketRespuestaComentario.entity";
import User, { Areas, Roles } from "../entities/User.entity";
import dayjs from "dayjs";
import {promises as fs} from 'fs';

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
const insertarRespuestaTicket = async (req: Request, res: Response) => {
  const { idTicket } = req.params;
  const { estado, accion, area, vigencia, idRespuestaAnterior } = req.body;
  if(!idRespuestaAnterior) return res.status(400).json("Seleccione el id de la respuesta anterior para insertar respuesta.");
  try {
    const ticket = await ticketRepo.findOneByOrFail({
      id: Number.parseInt(idTicket),
    });
    const respAnterior = ticket.respuestas.find(r => r.id === parseInt(idRespuestaAnterior));
    //If any action after ${idRespuestaAnterior} with status ACCEPTED it throws an error
    if(ticket.respuestas.find(r=> r.estado === Estado.ACEPTADO && r.orden > respAnterior.orden)) return res.status(403).json("No se pueden agregar pasos antes de acciones aceptadas.");
    const respuestaNueva = new ClienteServicioTicketRespuesta({
      estado : estado || Estado.PENDIENTE,
      usuarioCreacion: res.locals.user,
      area: Object.values(Areas).find(a => a === area) || Areas.ATENCION_CLIENTE,
      ticket,
      accion,
      //El orden sera reordenado
    });
 
    //Si la anterior respuesta fue aceptada inicializa la vigencia de la nueva respuesta.
    if(respAnterior?.estado === Estado.ACEPTADO){
      const fechaInicio = new Date();
      respuestaNueva.fechaInicio = respuestaNueva.fechaFin = fechaInicio;
      respuestaNueva.fechaFin.setDate(fechaInicio.getDate() + vigencia);
    }
    let respuestas = ticket.respuestas.sort((r, s) => r.orden - s.orden);
    const idx=respuestas.findIndex(r => r.id === respAnterior.id);
    const maxOrden = Math.max(...respuestas.map(r=>r.orden));
    respuestas.splice(idx+1, 0, respuestaNueva);
    for(let i = 0; i < respuestas.length ; i++){
      let res = respuestas[i];
      res.orden = maxOrden + i + 1;
      await res.save();
    }
    return res.status(200).json("Respuesta guardada.");
  } catch (error) {
    logger.apierror("insertarRespuestaTicket: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

/***
 * Actualiza una respuesta existente cambiando unicamente los campos definidos por el usuario: accion y respuesta
 * Esto genera una concatenacion en la respuesta, para no perder los datos de la anterior respuesta.
 */
const actualizarTicketRespuesta = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  const id = Number.parseInt(idTicketRespuesta);
  logger.apiinfo("Actualizar respuesta de ticket " + idTicketRespuesta);
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
  const { idTicketRespuesta } = req.params;
  try {
    const id = Number.parseInt(idTicketRespuesta);
    logger.apiinfo("Iniciar espera para respuesta " + idTicketRespuesta);
      iniciarEsperaRespuesta(id);
  } catch (error) {
    logger.apierror("Algo salio mal al iniciar respuesta " + idTicketRespuesta + '\n' + error);
    return res
      .status(500)
      .json(`Algo salio mal al iniciar espera en respuesta:${idTicketRespuesta}\n${error}`);
  }
};

const marcarComoLeido = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  try {
    const id = Number.parseInt(idTicketRespuesta);
    const respuesta = await respuestasRepo.findOneOrFail({where: {id}, relations: ["usuarioAsignado"]});
    if(respuesta.usuarioAsignado?.username !== res.locals.user.username) 
      return res.status(403).json("Este usuario no esta asignado a la respuesta.");
    logger.apiinfo(`Respuesta ${idTicketRespuesta} se marca como leída`);
    respuesta.leido = true;
    await respuesta.save();
    return res.json(`Respuesta ${idTicketRespuesta} se marca como leída`);
  } catch (error) {
    logger.apierror("Algo salio mal al marcar respuesta como leída " + idTicketRespuesta + '\n' + error);
    return res
      .status(500)
      .json(`Algo salio mal al marcar respuesta como leída:${idTicketRespuesta}\n${error}`);
  }
};

export const iniciarEsperaRespuesta = async (idResp: number) => {
  const resp = await respuestasRepo.findOne({
    where: { id: idResp },
  });
  if (!resp) throw "No se encontro la respuesta con id: " + idResp;
  if (!!resp.respuesta)
    return "Esta accion ya fue respondida";
  const fechaInicio = new Date();
  const vigencia = resp.vigenciaDias || parseInt(process.env.VIGENCIA_RESPUESTAS_DEFECTO || '1');
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
 * Marca respuesta como rechazada. Limpia las vigencias. Agrega un comentario con la razon del rechazo a la respuesta
 * Anterior respuesta: Se agrega una extensión de vigencia; se convierte la respuesta en comentario; estado vuelve a pendiente.  
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
    if(resp.ticket.porResponder.id !== id) return res.status(403).json(`Se debe responder o rechazar ${resp.ticket.porResponder.id} primero`);
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

const anularPasoRespuesta = async (req: Request, res: Response) => {
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
    resp.orden = Math.trunc((-1)*Math.random()*1000);
    await resp.save();
    await resp.softRemove();
    return res.json(`Respuesta ${idTicketRespuesta} anulada.`);
  } catch (error) {
    logger.apierror("eliminarPasoRespuesta: Algo salio mal\n" + error);
    return res.status(404).json("No se encontro el ticket\n" + error);
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
    await resp.remove();  
    return res.json(`Respuesta ${idTicketRespuesta} eliminada.`);
  } catch (error) {
    logger.apierror("eliminarPasoRespuesta: Algo salio mal\n" + error);
    return res.status(404).json("No se encontro el ticket\n" + error);
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
      user.rol === Roles.ADMIN //Asigna porque es admin
      || (user.area === resp.area && user.username === usuarioAsignado.username) //Se autoasigna si es del area
      || user.rol !== Roles.FUNCIONARIO; //O es RESPONSABLE DE AREA
    if (!puedeAsignar) {
      return res.status(401).json(`Solo el responsable de área de ${resp.area} puede asignar esta accion o un funcionario de la misma autoasignarsela.`);
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
  let resp;
  try {
    resp = await respuestasRepo.findOneOrFail({
      where:{id: Number.parseInt(idTicketRespuesta)}, relations: ["comentarios", "comentarios.usuarioCreacion", "ticket"]
    });
    if(resp.ticket.porResponder?.id === resp.id && !resp.fechaInicio) await iniciarEsperaRespuesta(resp.id);
  } catch (error) {
    logger.apierror("getRespuesta: Algo salio mal\n" + error);
    return res.status(500).json("No se encontro la respuesta\n" + error);
  }
    for(let i = 0; i < resp.comentarios.length; i++){
      const imagenPath = resp.comentarios[i].imagen;
      try {
       if(!imagenPath){ 
          resp.comentarios[i].imagen = undefined;
          continue;
        }
        const data = await fs.readFile( "./upload/" + imagenPath);
        resp.comentarios[i].imagen = !data ? undefined : data.toString();
      } catch (error) {
        logger.apierror(`getRespuesta: No se pudo recuperar imagen ${imagenPath} de comentario \n${error}`);
      }
    }
    return res.json(resp);  
};

const comentarRespuesta = async (req: Request, res: Response) => {
  const { idTicketRespuesta } = req.params;
  const { comentario, imagen } = req.body;
  if (!comentario || comentario.trim === "") {
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
    let errores = await validate(comentarioRespuesta);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    const nComentario = await comentarioRespuesta.save();
    //TODO: Guardar sin header de base64
    const nombreImagen = `resp${idTicketRespuesta}-com${nComentario.id}`;
    await fs.writeFile(`./upload/${nombreImagen}`, imagen); 
    nComentario.imagen = nombreImagen;
    await nComentario.save();
    return res.json(comentarioRespuesta);
  } catch (error) {
    logger.apierror("comentarRespuesta: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const anularComentario = async (req: Request, res: Response) => {
  const { idComentario } = req.params;  
  try {
    if(!idComentario) return res.status(403).json("Id de comentario requerido");
    const comentario = await AppDataSource.getRepository(ClienteServicioTicketRespuestaComentario).findOne({where: {id: parseInt(idComentario)}});    
    if(res.locals.user.username !== comentario.usuarioCreacion.username) return res.status(403).json("Solo el creador del comentario puede anularlo.");
    comentario.usuarioBaja = res.locals.user;
    await comentario.save();
    await comentario.softRemove();
    return res.json(`Comentario ${idComentario} anulado por creador.`);
  } catch (error) {
    const msge = `Algo salio mal al anular comentario ${idComentario}\n${error}`;
    logger.apierror(msge);
    return res.status(500).json(msge);
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


const getTicketsUser = async (req: Request, res: Response) => {
  try {
    //TODO? Agregar subrutas para GET /tickets para los que el usuario tenga: 1. accion pendiente; 2. accion rechazada; 3. ticket completado 
    const respAsignadas = await respuestasRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ticketRelations,
      where : { usuarioAsignado: res.locals.username }
    });
    return res.json(respAsignadas.map(r => r.ticket));
  } catch (err) {
    logger.apiinfo("Algo salio mal " + err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};


const router = Router();
router.post("/:idTicket", user, auth, insertarRespuestaTicket);
router.put("/:idTicketRespuesta", user, auth, actualizarTicketRespuesta);
router.post("/:idTicketRespuesta/iniciar", user, auth, iniciarEspera);
router.post("/:idTicketRespuesta/leido", user, auth, marcarComoLeido);
router.post("/:idTicketRespuesta/asignar", user, auth, asignar);
router.post("/:idTicketRespuesta/responder", user, auth, responder);
router.post("/:idTicketRespuesta/rechazar", user, auth, rechazar);
router.delete("/:idTicketRespuesta", user, auth, eliminarPasoRespuesta);
router.patch("/:idTicketRespuesta", user, auth, anularPasoRespuesta);
router.get("/:idTicketRespuesta", getRespuesta);
router.post("/:idTicketRespuesta/comentar", user, auth, comentarRespuesta);
router.patch("/comentario/:idComentario", user, auth, anularComentario);
router.get("/user", user, auth, getTicketsUser);

export default router;
