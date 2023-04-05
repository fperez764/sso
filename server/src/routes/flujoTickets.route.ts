import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import GrupoTicketFlujoRespuestas from "../entities/tickets/GrupoTicketFlujoRespuestas.entity";
import GrupoTicket from "../entities/tickets/GrupoTicket.entity";
import logger from "../utils/logger";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";

const flujoRespuestaRepo = AppDataSource.manager.getRepository(
  GrupoTicketFlujoRespuestas
);
const grupoRepo = AppDataSource.manager.getRepository(GrupoTicket);

const crearFlujoRespuesta = async (req: Request, res: Response) => {
  logger.apiinfo("Crear TicketFlujoRespuesta");
  const { orden, area, nombreGrupo, accion, vigenciaDias } = req.body;
  const grupo = await grupoRepo.findOne({
    where: {
      nombre: nombreGrupo,
    },
    relations: ["usuarioCreacion"],
  });
  if (!grupo) {
    return res.status(400).json({
      error: "No se encontro el grupo de tickets " + nombreGrupo,
    });
  }
  try {
    const flujoRespuesta = new GrupoTicketFlujoRespuestas({
      orden,
      area,
      accion,
      vigenciaDias,
      usuarioCreacion: res.locals.user,
      grupo,
    });
    let errores = await validate(flujoRespuesta);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }

    await flujoRespuesta.save();
    return res.json(flujoRespuesta);
  } catch (error) {
    return res.status(500).json({
      error: "No se pudo agregar al TicketFlujoRespuesta " + error,
    });
  }
};

const actualizarFlujoRespuesta = async (req: Request, res: Response) => {
  const { idTicketFlujoRespuesta } = req.params;
  const id = Number.parseInt(idTicketFlujoRespuesta);
  logger.apiinfo("Crear TicketFlujoRespuesta");
  const { orden, area, accion, esperaDias } = req.body;

  try {
    const flujoRespuesta = await flujoRespuestaRepo.findOne({
      where: {
        id,
      },
      relations: ["usuarioCreacion", "servicio"],
    });

    flujoRespuesta.area = area ?? flujoRespuesta.area;
    flujoRespuesta.accion = accion ?? flujoRespuesta.accion;
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
    return res.status(500).json({
      error: "No se pudo actualizar la TicketFlujoRespuesta " + error,
    });
  }
};

const getFlujoRespuestas = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const TicketFlujoRespuestasPerPage: number = (req.query.count ||
    20) as number;

  try {
    const flujoRespuestas = await flujoRespuestaRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["usuarioCreacion", "servicio"],
      skip: currentPage * TicketFlujoRespuestasPerPage,
      take: TicketFlujoRespuestasPerPage,
    });

    return res.json(flujoRespuestas);
  } catch (err) {
    logger.apierror(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getFlujoRespuesta = async (req: Request, res: Response) => {
  const { idTicketFlujoRespuesta } = req.params;
  const id = Number.parseInt(idTicketFlujoRespuesta);
  try {
    const flujoRespuesta = await flujoRespuestaRepo.findOne({
      where: {
        id,
      },
      relations: ["usuarioCreacion", "grupo"],
    });
    return res.json(flujoRespuesta);
  } catch (error) {
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", user, auth, crearFlujoRespuesta);
router.get("/", getFlujoRespuestas);
router.get("/:idTicketFlujoRespuesta", getFlujoRespuesta);
router.put("/:idTicketFlujoRespuesta", user, actualizarFlujoRespuesta);

export default router;
