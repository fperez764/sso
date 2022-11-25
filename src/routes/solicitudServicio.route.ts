import { Request, response, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import SolicitudRespuesta, {
  Estado,
} from "../entities/solicitudServicio/SolicitudRespuesta.entity";
import SolicitudServicio from "../entities/solicitudServicio/SolicitudServicio.entity";
import GrupoSolicitud from "../entities/solicitudServicio/SolicitudGrupo.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import SolicitudServicioComentario from "../entities/solicitudServicio/SolicitudServicioComentario.entity";
import Cliente from "../entities/cliente/Cliente.entity";
import Servicio from "../entities/servicio/Servicio.entity";
import user from "../middleware/user.middleware";
import SolicitudFlujoRespuesta from "../entities/solicitudServicio/SolicitudFlujoRespuesta.entity";
import logger from "../utils/logger";

const solicitudSRepo = AppDataSource.manager.getRepository(SolicitudServicio);
const grupoRepo = AppDataSource.manager.getRepository(GrupoSolicitud);
const clienteRepo = AppDataSource.manager.getRepository(Cliente);
const servicioRepo = AppDataSource.manager.getRepository(Servicio);
const flujoRespuestaRepo = AppDataSource.manager.getRepository(
  SolicitudFlujoRespuesta
);

const createSS = async (req: Request, res: Response) => {
  logger.info("Crear SS");
  try {
    const {
      idCliente,
      origen,
      tipoSolicitud,
      descripcion,
      prepagado,
      nombreGrupo,
      nombreServicio,
    } = req.body;
    const usuarioCreacion: User = res.locals.user;
    if (!descripcion || descripcion.trim() === "") {
      return res
        .status(400)
        .json({ descripcion: "Descripcion no puede ser vacia" });
    }
    //Encontrar Cliente
    const clienteSolicitud = await clienteRepo.findOneByOrFail({
      id: Number.parseInt(idCliente),
    });
    //En este caso mandar error especial para crear cliente en frontend
    if (!clienteSolicitud)
      throw {
        error:
          "Cliente no encontrado, cree primero el cliente antes de hacer la solicitud.",
      };
    //Encontrar Sub
    const grupoSolicitud = nombreGrupo
      ? await grupoRepo.findOneByOrFail({
          name: nombreGrupo,
        })
      : null;
    //Encontar categoria
    const servicioSolicitud = await servicioRepo.findOneByOrFail({
      nombre: nombreServicio,
    });
    if (!servicioSolicitud) throw { error: "Servicio no encontrado." };

    const solicitudS = new SolicitudServicio({
      origen,
      descripcion,
      prepagado,
      usuarioCreacion,
      tipo: tipoSolicitud,
      recibido: false,
      grupo: grupoSolicitud,
      cliente: clienteSolicitud,
      servicio: servicioSolicitud,
    });

    const flujoRespuestas = await flujoRespuestaRepo
      .createQueryBuilder("flujo")
      .where("flujo.tipoSolicitud = :tipo", { tipo: tipoSolicitud })
      .getMany();
    if (flujoRespuestas.length === 0) {
      const message = `No se encontraron respuestas pre-definidas para el tipo de solicitud ${tipoSolicitud}`;
      logger.warn(message);
      throw message;
    }
    await solicitudS.save();
    await crearRespuestasSolicitud(solicitudS, flujoRespuestas);
    return res.json(solicitudS);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo agregar la solicitud: " + error });
  }
};

const crearRespuestasSolicitud = async (
  ss: SolicitudServicio,
  flujoRespuestas: SolicitudFlujoRespuesta[]
) => {
  logger.debug(
    `Se encontraron ${flujoRespuestas.length} respuestas para la solicitud ${ss.id}`
  );
  flujoRespuestas.forEach(async (respFlujo) => {
    const respuestaS = new SolicitudRespuesta({
      estado: Estado.PENDIENTE,
      respuesta: "",
      area: respFlujo.area,
      usuarioCreacion: ss.usuarioCreacion,
      solicitudServicio: ss,
      orden: respFlujo.orden,
      accion: respFlujo.accion,
    });
    const saveRes = await respuestaS.save();
    logger.debug(
      `${ss.tipo.toString()}-${respFlujo.area}: Esperando ${respFlujo.accion}`
    );
  });
  logger.info(`Respuestas guardadas para SS:${ss.id}`);
};

const actualizarSS = async (req: Request, res: Response) => {
  const { idSolicitud } = req.params;
  const id = Number.parseInt(idSolicitud);
  console.log("Actualizar SS " + idSolicitud);
  try {
    const {
      idCliente,
      origen,
      descripcion,
      prepagado,
      nombreGrupo,
      nombreServicio,
    } = req.body;
    const solicitud = await solicitudSRepo.findOne({
      where: { id },
    });
    solicitud.cliente = idCliente ?? solicitud.cliente;
    solicitud.origen = origen ?? solicitud.origen;
    solicitud.descripcion = descripcion ?? solicitud.descripcion;
    solicitud.prepagado = prepagado ?? solicitud.prepagado;
    solicitud.grupo = nombreGrupo ?? solicitud.grupo;
    solicitud.servicio = nombreServicio ?? solicitud.servicio;
    solicitud.usuarioCreacion = res.locals.user;
    await solicitud.save();
    return res.json(solicitud);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo actualizar la solicitud: " + error });
  }
};

const getSolicitudesS = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const postsPerPage: number = (req.query.count || 8) as number;

  try {
    const solicitudesS = await solicitudSRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: [
        "usuarioCreacion",
        "respuestas",
        "respuestas.usuarioCreacion",
        "comentarios",
        "cliente",
        "servicio",
        "servicio.categoria",
      ],
      skip: currentPage * postsPerPage,
      take: postsPerPage,
    });
    if (res.locals.user) {
      solicitudesS.forEach((s) => s.setUserVote(res.locals.user));
    }
    return res.json(solicitudesS);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getSolicitudS = async (req: Request, res: Response) => {
  const { idSolicitud } = req.params;
  const id = Number.parseInt(idSolicitud);
  logger.info("Buscar solicitud " + id);
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
    logger.error(error);
    return res.status(500).json({ error: "Algo salio mal " + error });
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

/***
 * Elimina una solicitud de Servicio de base de datos TODO: solo dar de baja sin borrar el registro
 */
const deleteSS = async (req: Request, res: Response) => {
  const { idSolicitud } = req.params;
  const id = Number.parseInt(idSolicitud);
  logger.warn(`Se eliminara la solicitud ${idSolicitud}`);
  try {
    const solicitud = await solicitudSRepo.findOne({
      where: {
        id,
      },
      relations: {
        respuestas: true,
      },
    });
    logger.warn(solicitud.descripcion);
    solicitud.respuestas.forEach((resp: SolicitudRespuesta) => {
      logger.warn(resp.id + " eliminada");
      resp.remove();
    });
    solicitud.remove();
    return res.json(solicitud);
  } catch (error) {
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const nullSS = async (req: Request, res: Response) => {
  const { idSolicitud } = req.params;
  const id = Number.parseInt(idSolicitud);
  logger.warn(`Se anulara la solicitud ${idSolicitud}`);
  try {
    const solicitud = await solicitudSRepo.findOne({
      where: {
        id,
      },
      relations: {
        respuestas: true,
      },
    });
    logger.warn(solicitud.descripcion);
    solicitud.respuestas.forEach((resp: SolicitudRespuesta) => {
      resp.usuarioBaja = res.locals.user;
      resp.save();
    });
    solicitud.usuarioBaja = res.locals.user;
    solicitud.save();
    return res.json(solicitud);
  } catch (error) {
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", user, auth, createSS);
router.get("/", user, getSolicitudesS);
router.get("/:idSolicitud", getSolicitudS);
router.post("/:idSolicitud/comentario", user, auth, comentarSolicitud);
router.delete("/:idSolicitud", deleteSS);
router.patch("/:idSolicitud", getSolicitudS);
export default router;
