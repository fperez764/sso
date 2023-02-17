import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import ClienteSolicitudRespuesta from "../entities/solicitudServicio/ClienteSolicitudRespuesta.entity";
import ClienteSolicitudServicio from "../entities/solicitudServicio/ClienteSolicitudServicio.entity";
import auth from "../middleware/auth.middleware";
import logger from "../utils/logger";

const solicitudSRepo = AppDataSource.manager.getRepository(
  ClienteSolicitudServicio
);
const sRespuestaRepo = AppDataSource.manager.getRepository(
  ClienteSolicitudRespuesta
);

/**
 * Crea una respuesta extra asociada a una solicitud (no sigue el flujo pre-definido por areas)
 * @param req
 * @param res
 * @returns
 */
const nuevaRespuestaSolicitud = async (req: Request, res: Response) => {
  const { idSolicitud } = req.params;
  const { estado, respuesta, accion, area, orden } = req.body;
  try {
    const clienteSolicitudServicio = await solicitudSRepo.findOneByOrFail({
      id: Number.parseInt(idSolicitud),
    });

    const respuestaS = new ClienteSolicitudRespuesta({
      estado,
      respuesta,
      area,
      usuarioCreacion: res.locals.user,
      clienteSolicitudServicio,
      accion,
      orden,
    });

    await respuestaS.save();
    return res.json(respuestaS);
  } catch (err) {
    logger.apierror(err);
    return res
      .status(404)
      .json({ message: "No se encontro la solicitud" + err });
  }
};

/***
 * Actualiza una respuesta existente cambiando unicamente los campos definidos por el usuario: accion y respuesta
 * Esto genera una concatenacion en la respuesta, para no perder los datos de la anterior respuesta.
 */
const actualizarSSRespuesta = async (req: Request, res: Response) => {
  const { idSolicitud: idRespuesta } = req.params;
  const id = Number.parseInt(idRespuesta);
  logger.apiinfo("Actualizar SS " + idRespuesta);
  try {
    const { estado, respuesta, accion } = req.body;
    const resp = await sRespuestaRepo.findOne({
      where: { id },
    });
    resp.estado = estado ?? resp.estado;
    resp.respuesta = `'${resp.accion}-${resp.respuesta} el ${resp.fechaModificacion} por ${resp.usuarioCreacion.username}' \n ${respuesta}`;
    resp.accion = accion ?? resp.accion;
    resp.usuarioCreacion = res.locals.user;
    await resp.save();
    return res.json(resp);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo actualizar la respuesta: " + error });
  }
};

const iniciarEspera = async (req: Request, res: Response) => {
  const { idSolicitud: idRespuesta } = req.params;
  const id = Number.parseInt(idRespuesta);
  logger.apiinfo("Iniciar espera para respuesta " + idRespuesta);
  try {
    const resp = await sRespuestaRepo.findOne({
      where: { id },
      relations: ["solicitudFlujoRespuesta"],
    });
    const fechaInicio = new Date();
    const vigencia = resp.solicitudFlujoRespuesta
      ? resp.solicitudFlujoRespuesta.vigenciaDias
      : Number.parseInt(process.env.VIGENCIA_RESPUESTAS_DEFECTO);
    resp.fechaFin = fechaInicio;
    resp.fechaFin.setDate(fechaInicio.getDate() + vigencia);
    resp.save();
  } catch (error) {
    logger.apierror("Algo salio mal al iniciar respuesta " + id);
    return res
      .status(500)
      .json({ error: "Algo salio mal al iniciar respuesta " + id + error });
  }
};

const router = Router();
router.post("/:idSolicitud/respuestas", auth, nuevaRespuestaSolicitud);
router.put(":/idSolicitud", actualizarSSRespuesta);
router.post("/:idSolicitud/respuestas/iniciar", auth, iniciarEspera);

export default router;
