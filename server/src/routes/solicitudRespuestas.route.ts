import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import ClienteSolicitudRespuesta from "../entities/clienteSolicitud/ClienteSolicitudRespuesta.entity";
import ClienteSolicitud from "../entities/clienteSolicitud/ClienteSolicitud.entity";
import auth from "../middleware/auth.middleware";
import logger from "../utils/logger";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";

const solicitudSRepo = AppDataSource.manager.getRepository(ClienteSolicitud);
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
    const clienteSolicitud = await solicitudSRepo.findOneByOrFail({
      id: Number.parseInt(idSolicitud),
    });

    const respuestaS = new ClienteSolicitudRespuesta({
      estado,
      respuesta,
      area,
      usuarioCreacion: res.locals.user,
      clienteSolicitud,
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
    logger.apierror("nuevaRespuestaSolicitud: Algo salio mal " + err);
    return res
      .status(404)
      .json("No se encontro la solicitud" + err );
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
    let errores = await validate(resp);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await resp.save();
    return res.json(resp);
  } catch (error) {
    logger.apierror("actualizarSSRespuesta: Algo salio mal\n" + error);
    return res.status(500).json("No se pudo actualizar la respuesta.\n" + error);
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
    resp.fechaFin.setDate(new Date().getDate() + vigencia);
    let errores = await validate(resp);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await resp.save();
  } catch (error) {
    logger.apierror("IniciarEspera: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal al iniciar espera.\n" + error);
  }
};

const router = Router();
router.post("/:idSolicitud/respuestas", auth, nuevaRespuestaSolicitud);
router.put(":/idSolicitud", auth, actualizarSSRespuesta);
router.post("/:idSolicitud/respuestas/iniciar", auth, iniciarEspera);

export default router;
