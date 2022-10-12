import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import SolicitudRespuesta from "../entities/solicitudServicio/SolicitudRespuesta.entity";
import SolicitudServicio from "../entities/solicitudServicio/SolicitudServicio.entity";
import GrupoSolicitud from "../entities/solicitudServicio/SolicitudGrupo.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import SolicitudServicioComentario from "../entities/solicitudServicio/SolicitudServicioComentario.entity";
import Cliente from "../entities/cliente/Cliente.entity";
import Servicio from "../entities/servicio/Servicio.entity";

const solicitudSRepo = AppDataSource.manager.getRepository(SolicitudServicio);
const grupoRepo = AppDataSource.manager.getRepository(GrupoSolicitud);
const clienteRepo = AppDataSource.manager.getRepository(Cliente);
const servicioRepo = AppDataSource.manager.getRepository(Servicio);

const createSS = async (req: Request, res: Response) => {
  console.log("Crear SS");
  try {
    const {
      origen,
      prepagado,
      descripcion,
      recibido,
      grupo,
      idCliente,
      nombreServicio,
    } = req.body;
    const usuarioCreacion: User = res.locals.user;
    if (!descripcion || descripcion.trim() === "") {
      return res
        .status(400)
        .json({ descripcion: "Descripcion no puede ser vacia" });
    }
    //Encontrar Cliente
    const clienteSolicitud = await clienteRepo.findOneBy({
      id: Number.parseInt(idCliente),
    });
    //En este caso mandar error especial para crear cliente en frontend
    if (!clienteSolicitud)
      throw {
        error:
          "Cliente no encontrado, cree primero el cliente antes de hacer la solicitud.",
      };
    //Encontrar Sub
    const grupoSolicitud = await grupoRepo.findOneBy({ name: grupo });
    //Encontar categoria
    const servicioSolicitud = await servicioRepo.findOneBy({
      nombre: nombreServicio,
    });

    const solicitudS = new SolicitudServicio({
      origen,
      descripcion,
      prepagado,
      recibido,
      usuarioCreacion,
      grupo: grupoSolicitud,
      cliente: clienteSolicitud,
      servicio: servicioSolicitud,
    });
    await solicitudS.save();
    return res.json(solicitudS);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo agregar la solicitud: " + error });
  }
};

const getSolicitudesS = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 8) as number;

  try {
    const solicitudesS = await solicitudSRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["usuarioCreacion"],
      skip: currentPage * postsPerPage,
      take: postsPerPage,
    });

    return res.json(solicitudesS);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
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
    return res.status(500).json({ errror: "Algo salio mal " + error });
  }
};

const responderSolicitud = async (req: Request, res: Response) => {
  const { idSolicitud } = req.params;
  const { estado, respuesta, accion } = req.body;
  try {
    const solicitudServicio = await solicitudSRepo.findOneByOrFail({
      id: Number.parseInt(idSolicitud),
    });
    const respuestaS = new SolicitudRespuesta({
      estado,
      respuesta,
      area: res.locals.user.area,
      usuarioCreacion: res.locals.user,
      solicitudServicio,
      accion,
    });

    await respuestaS.save();
    return res.json(respuestaS);
  } catch (err) {
    console.log(err);
    return res
      .status(404)
      .json({ message: "No se encontro la solicitud" + err });
  }
};

const comentarSolicitud = async (req: Request, res: Response) => {
  const { idSolicitud } = req.params;
  const { comentario } = req.body;
  if (!comentario && comentario.trim === "") {
    return res
      .status(400)
      .json({ comentario: "Comentario no puede ser vacio" });
  }
  try {
    const solicitudServicio = await solicitudSRepo.findOneByOrFail({
      id: Number.parseInt(idSolicitud),
    });
    const comentarioS = new SolicitudServicioComentario({
      comentario,
      solicitudServicio,
      usuarioCreacion: res.locals.user,
    });

    await comentarioS.save();
    return res.json(comentarioS);
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
router.post("/:idSolicitud/comentario", auth, comentarSolicitud);

export default router;
