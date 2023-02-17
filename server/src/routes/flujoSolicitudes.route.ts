import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import SolicitudFlujoRespuesta from "../entities/solicitudServicio/SolicitudFlujoRespuesta.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import logger from "../utils/logger";

const flujoRespuestaRepo = AppDataSource.manager.getRepository(
  SolicitudFlujoRespuesta
);

const crearFlujoRespuesta = async (req: Request, res: Response) => {
  logger.apiinfo("Crear SolicitudFlujoRespuesta");
  const { orden, area, accion, vigenciaDias, nombreServicio, nombreGrupo } =
    req.body;
  try {
    const flujoRespuesta = new SolicitudFlujoRespuesta({
      orden,
      area,
      accion,
      vigenciaDias,
      servicio: nombreServicio,
      grupo: nombreGrupo,
      usuarioCreacion: res.locals.user,
    });

    await flujoRespuesta.save();
    return res.json(flujoRespuesta);
  } catch (error) {
    return res.status(500).json({
      error: "No se pudo agregar al SolicitudFlujoRespuesta " + error,
    });
  }
};

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
    flujoRespuesta.servicio = servicioNombre ?? flujoRespuesta.servicio;
    flujoRespuesta.orden = orden ?? flujoRespuesta.orden;
    flujoRespuesta.orden = orden ?? flujoRespuesta.orden;
    flujoRespuesta.vigenciaDias = esperaDias ?? flujoRespuesta.vigenciaDias;

    (flujoRespuesta.usuarioCreacion = res.locals.user),
      await flujoRespuesta.save();
    return res.json(flujoRespuesta);
  } catch (error) {
    return res.status(500).json({
      error: "No se pudo actualizar la SolicitudFlujoRespuesta " + error,
    });
  }
};

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
  } catch (err) {
    logger.apierror(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
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
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", user, auth, crearFlujoRespuesta);
router.get("/", getFlujoRespuestas);
router.get("/:idSolicitudFlujoRespuesta", getFlujoRespuesta);
router.put("/:idSolicitudFlujoRespuesta", actualizarFlujoRespuesta);

export default router;
