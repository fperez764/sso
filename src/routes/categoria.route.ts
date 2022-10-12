import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import Categoria from "../entities/servicio/Categoria.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";

const categoriaRepo = AppDataSource.manager.getRepository(Categoria);

const crearCategoria = async (req: Request, res: Response) => {
  console.log("Crear categoria");
  const { nombre, descripcion, activo } = req.body;
  const usuarioCreacion: User = res.locals.user;

  try {
    const categoria = new Categoria({
      nombre,
      descripcion,
      activo,
      usuarioCreacion,
    });
    await categoria.save();
    return res.json(categoria);
  } catch (error) {
    return res.status(500).json({ error: "No se pudo agregar al categoria" });
  }
};

const getCategorias = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const categoriasPerPage: number = (req.query.count || 20) as number;

  try {
    const categorias = await categoriaRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["usuarioCreacion", "servicio"],
      skip: currentPage * categoriasPerPage,
      take: categoriasPerPage,
    });

    return res.json(categorias);
  } catch (err) {
    console.log(err);
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
    return res.status(500).json({ errror: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", auth, crearCategoria);
router.get("/", getCategorias);
router.get("/:idcategoria", getCategoria);

export default router;
