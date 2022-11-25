import { Request, Response, Router } from "express";
import Servicio from "../controllers/servicio/Servicio";
import { AppDataSource } from "../data-source";
import SolicitudFlujoRespuesta from "../entities/solicitudServicio/SolicitudFlujoRespuesta.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";

const flujoRespuestaRepo = AppDataSource.manager.getRepository(
  SolicitudFlujoRespuesta
);

const crearFlujoRespuesta = async (req: Request, res: Response) => {
  console.log("Crear SolicitudFlujoRespuesta");
  const { orden, area, tipoSolicitud, accion, esperaDias, servicioNombre } =
    req.body;
  try {
    const flujoRespuesta = new SolicitudFlujoRespuesta({
      orden,
      area,
      tipoSolicitud,
      accion,
      vigenciaDias: esperaDias,
      servicio: servicioNombre,
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
  console.log("Crear SolicitudFlujoRespuesta");
  const { orden, area, tipoSolicitud, accion, esperaDias, servicioNombre } =
    req.body;
  try {
    const flujoRespuesta = await flujoRespuestaRepo.findOne({
      where: {
        id,
      },
      relations: ["usuarioCreacion", "servicio"],
    });
    flujoRespuesta.orden = orden ?? flujoRespuesta.orden;
    flujoRespuesta.area = area ?? flujoRespuesta.area;
    flujoRespuesta.tipoSolicitud =
      tipoSolicitud ?? flujoRespuesta.tipoSolicitud;
    flujoRespuesta.accion = accion ?? flujoRespuesta.accion;
    flujoRespuesta.servicio = servicioNombre ?? flujoRespuesta.servicio;
    flujoRespuesta.orden = orden ?? flujoRespuesta.orden;
    flujoRespuesta.orden = orden ?? flujoRespuesta.orden;
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
    console.log(err);
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
