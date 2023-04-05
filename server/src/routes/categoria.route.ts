import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import CategoriaServicio from "../entities/servicio/CategoriaServicio.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import logger from "../utils/logger";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";

const categoriaRepo = AppDataSource.manager.getRepository(CategoriaServicio);

const crearCategoria = async (req: Request, res: Response) => {
  logger.apiinfo("API:Crear categoria");
  const { nombre, descripcion, activo } = req.body;
  const usuarioCreacion: User = res.locals.user;

  try {
    const categoria = new CategoriaServicio({
      nombre,
      descripcion,
      activo,
      usuarioCreacion,
    });
    let errores = await validate(categoria);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await categoria.save();
    return res.json(categoria);
  } catch (error) {
    return res.status(500).json({ error: "No se pudo agregar al categoria" });
  }
};

const actualizarCategoria = async (req: Request, res: Response) => {
  const { idCategoria } = req.params;
  logger.apiinfo("Actualizar categoria " + idCategoria);
  const id = Number.parseInt(idCategoria);
  const { nombre, descripcion, activo } = req.body;
  const usuarioCreacion: User = res.locals.user;

  try {
    const categoria = await categoriaRepo.findOne({
      where: { id },
    });
    categoria.nombre = nombre ?? categoria.nombre;
    categoria.descripcion = descripcion ?? categoria.descripcion;
    categoria.activo = activo ?? categoria.activo;
    categoria.usuarioCreacion = usuarioCreacion;
    let errores = await validate(categoria);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await categoria.save();
    return res.json(categoria);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo actualizar la categoria" });
  }
};

const getCategorias = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const categoriasPerPage: number = (req.query.count || 100) as number;

  try {
    const categorias = await categoriaRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["usuarioCreacion"],
      skip: currentPage * categoriasPerPage,
      take: categoriasPerPage,
    });

    return res.json(categorias);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getCategoria = async (req: Request, res: Response) => {
  const { idCategoria } = req.params;
  const id = Number.parseInt(idCategoria);
  try {
    const categoria = await categoriaRepo.findOne({
      where: {
        id,
      },
      relations: ["usuarioCreacion", "servicio"],
    });
    return res.json(categoria);
  } catch (error) {
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", user, auth, crearCategoria);
router.get("/", getCategorias);
router.get("/:idcategoria", getCategoria);
router.put("/:idCategoria", user, auth, actualizarCategoria);

export default router;
