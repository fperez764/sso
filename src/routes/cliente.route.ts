import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import SolicitudRespuesta from "../entities/solicitudServicio/SolicitudRespuesta.entity";
import SolicitudServicio from "../entities/solicitudServicio/SolicitudServicio.entity";
import GrupoSolicitud from "../entities/solicitudServicio/SolicitudGrupo.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import { CustomRepositoryCannotInheritRepositoryError } from "typeorm";

const solicitudSRepo = AppDataSource.manager.getRepository(SolicitudServicio);
const grupoRepo = AppDataSource.manager.getRepository(GrupoSolicitud);

const createSS = async (req: Request, res: Response) => {
  console.log("Crear SS");
  const { origen, prepagado, descripcion, recibido, grupo } = req.body;
  const user: User = res.locals.user;
  if (descripcion.trim() === "") {
    return res
      .status(400)
      .json({ descripcion: "Descripcion no puede ser vacia" });
  }
  //Encontrar Sub
  const grupoSolicitud = await grupoRepo.findOneByOrFail({ name: grupo });

  try {
    const solicitudS = new SolicitudServicio({
      origen,
      descripcion,
      prepagado,
      recibido,
      user,
      grupo: grupoSolicitud,
    });
    await solicitudS.save();
    return res.json(solicitudS);
  } catch (error) {
    return res.json(500).json({ error: "No se pudo agregar la solicitud" });
  }
};

const getSolicitudesS = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 8) as number;

  try {
    const solicitudesS = await solicitudSRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["user"],
      skip: currentPage * postsPerPage,
      take: postsPerPage,
    });

    return res.json(solicitudesS);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Algo salio mal" });
  }
};

const getSolicitudS = async (req: Request, res: Response) => {
  const { idSolicitud } = req.params;
  const id = Number.parseInt(idSolicitud);
  try {
    const solicitud = await solicitudSRepo.findOne({
      where: {
        id,
      },
      relations: {
        grupo: true,
        respuestas: true,
      },
    });
    return res.json(solicitud);
  } catch (error) {
    return res.status(500).json({ errror: "Algo salio mal" });
  }
};

const responderSolicitud = async (req: Request, res: Response) => {
  const { idSolicitud } = req.params;
  const { aceptado, respuesta } = req.body;
  try {
    const solicitudServicio = await solicitudSRepo.findOneByOrFail({
      id: Number.parseInt(idSolicitud),
    });
    const respuestaS = new SolicitudRespuesta({
      aceptado,
      respuesta,
      area: res.locals.user.area || "Sin area",
      user: res.locals.user,
      solicitudServicio,
    });

    await respuestaS.save();
    return res.json(respuestaS);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "No se encontro la solicitud" });
  }
};

const router = Router();
router.post("/", auth, createSS);
router.get("/", getSolicitudesS);
router.get("/:idSolicitud", getSolicitudS);
router.post("/:idSolicitud/respuesta", auth, responderSolicitud);
//router.get('/:identifier/:slug/comments', user, getPostComments)

export default router;
