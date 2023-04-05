import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import Servicio from "../entities/servicio/Servicio.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import logger from "../utils/logger";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";

const servicioRepo = AppDataSource.manager.getRepository(Servicio);

const crearServicio = async (req: Request, res: Response) => {
  logger.apiinfo("Crear servicio");
  const { nombreCategoria, nombre, descripcion, activo } = req.body;
  const usuarioCreacion: User = res.locals.user;

  try {
    const servicio = new Servicio({
      categoria: nombreCategoria,
      nombre,
      descripcion,
      activo,
      usuarioCreacion,
    });
    let errores = await validate(servicio);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await servicio.save();
    return res.json(servicio);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo agregar el servicio " + error });
  }
};

const actualizarServicio = async (req: Request, res: Response) => {
  const { idServicio } = req.params;
  const id = Number.parseInt(idServicio);
  logger.apiinfo("Actualizar servicio " + idServicio);
  const { nombreCategoria, nombre, descripcion, activo } = req.body;
  try {
    const servicio = await servicioRepo.findOne({
      where: { id },
    });
    servicio.categoria = nombreCategoria ?? servicio.categoria;
    servicio.nombre = nombre ?? servicio.nombre;
    servicio.descripcion = descripcion ?? servicio.descripcion;
    servicio.activo = activo ?? servicio.activo;
    servicio.usuarioCreacion = res.locals.user;
    let errores = await validate(servicio);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await servicio.save();
    return res.json(servicio);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo actualizar el servicio " + error });
  }
};

const getServicios = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const serviciosPerPage: number = (req.query.count || 20) as number;

  try {
    const servicios = await servicioRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["usuarioCreacion", "categoria", "servicioPaquetes"],
      skip: currentPage * serviciosPerPage,
      take: serviciosPerPage,
    });
    logger.apiinfo(`getServicios: ${servicios.length} servicios encontrados`);
    return res.json(servicios);
  } catch (err) {
    logger.apiinfo(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getServicio = async (req: Request, res: Response) => {
  const { idservicio: idServicio } = req.params;
  const id = Number.parseInt(idServicio);
  try {
    const servicio = await servicioRepo.findOne({
      where: {
        id,
      },
      relations: ["usuarioCreacion", "categoria", "servicioPaquetes"],
    });
    return res.json(servicio);
  } catch (error) {
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", user, auth, crearServicio);
router.get("/", getServicios);
router.get("/:idservicio", getServicio);
router.put("/:idservicio", user, auth, actualizarServicio);
export default router;
