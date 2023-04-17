import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import GrupoSolicitudFlujoRespuestas from "../entities/clienteSolicitud/GrupoSolicitudFlujoRespuestas.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import logger from "../utils/logger";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";

const flujoRespuestaRepo = AppDataSource.manager.getRepository(
  GrupoSolicitudFlujoRespuestas
);

const crearFlujoRespuesta = async (req: Request, res: Response) => {
  logger.apiinfo("Crear SolicitudFlujoRespuesta");
  const { orden, area, accion, vigenciaDias, nombreServicio, nombreGrupo } =
    req.body;
  try {
    const flujoRespuesta = new GrupoSolicitudFlujoRespuestas({
      orden,
      area,
      accion,
      vigenciaDias,
      grupo: nombreGrupo,
      usuarioCreacion: res.locals.user,
    });

    await flujoRespuesta.save();
    return res.json(flujoRespuesta);
  } catch (error) {
    logger.apierror("crearFLujoRespuesta: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }};

const actualizarFlujoRespuesta = async (req: Request, res: Response) => {
  const { idSolicitudFlujoRespuesta } = req.params;
  const id = Number.parseInt(idSolicitudFlujoRespuesta);
  logger.apiinfo("Crear SolicitudFlujoRespuesta");
  const { orden, area, accion, esperaDias, servicioNombre } = req.body;

  try {
    const flujoRespuesta = await flujoRespuestaRepo.findOne({
      where: {
        id,
      },
      relations: ["usuarioCreacion", "servicio"],
    });

    flujoRespuesta.orden = orden ?? flujoRespuesta.orden;
    flujoRespuesta.area = area ?? flujoRespuesta.area;
    flujoRespuesta.accion = accion ?? flujoRespuesta.accion;
    flujoRespuesta.orden = orden ?? flujoRespuesta.orden;
    flujoRespuesta.orden = orden ?? flujoRespuesta.orden;
    flujoRespuesta.vigenciaDias = esperaDias ?? flujoRespuesta.vigenciaDias;
    flujoRespuesta.usuarioCreacion = res.locals.user;
    let errores = await validate(flujoRespuesta);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await flujoRespuesta.save();
    return res.json(flujoRespuesta);
  } catch (error) {
    logger.apierror("actualizarFlujoRespuesta: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }};

const getFlujoRespuestas = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const SolicitudFlujoRespuestasPerPage: number = (req.query.count ||
    20) as number;

  try {
    const flujoRespuestas = await flujoRespuestaRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["usuarioCreacion", "servicio"],
      skip: currentPage * SolicitudFlujoRespuestasPerPage,
      take: SolicitudFlujoRespuestasPerPage,
    });

    return res.json(flujoRespuestas);
  } catch (error) {
    logger.apierror("getFlujoRespuestas: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const getFlujoRespuesta = async (req: Request, res: Response) => {
  const { idSolicitudFlujoRespuesta } = req.params;
  const id = Number.parseInt(idSolicitudFlujoRespuesta);
  try {
    const flujoRespuesta = await flujoRespuestaRepo.findOne({
      where: {
        id,
      },
      relations: ["usuarioCreacion", "servicio"],
    });
    return res.json(flujoRespuesta);
  } catch (error) {
    logger.apierror("getFlujoRespuesta: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
};

const router = Router();
router.post("/", user, auth, crearFlujoRespuesta);
router.get("/", getFlujoRespuestas);
router.get("/:idSolicitudFlujoRespuesta", getFlujoRespuesta);
router.put("/:idSolicitudFlujoRespuesta", user, actualizarFlujoRespuesta);

export default router;
