import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import Servicio from "../entities/servicio/Servicio.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";

const servicioRepo = AppDataSource.manager.getRepository(Servicio);

const crearServicio = async (req: Request, res: Response) => {
  console.log("Crear servicio");
  const { categoria, nombre, descripcion, activo } = req.body;
  const usuarioCreacion: User = res.locals.user;

  try {
    const servicio = new Servicio({
      categoria,
      nombre,
      descripcion,
      activo,
      usuarioCreacion,
    });
    await servicio.save();
    return res.json(servicio);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo agregar al servicio " + error });
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

    return res.json(servicios);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getServicio = async (req: Request, res: Response) => {
  const { idservicio } = req.params;
  const id = Number.parseInt(idservicio);
  try {
    const servicio = await servicioRepo.findOne({
      where: {
        id,
      },
      relations: ["usuarioCreacion", "categoria", "servicioPaquetes"],
    });
    return res.json(servicio);
  } catch (error) {
    return res.status(500).json({ errror: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", user, auth, crearServicio);
router.get("/", getServicios);
router.get("/:idservicio", getServicio);
//router.post("/servicio", agregarServicioPaquete)

export default router;
