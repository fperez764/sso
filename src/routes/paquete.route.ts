import { Request, Response, Router } from "express";
import Servicio from "../controllers/servicio/Servicio";
import { AppDataSource } from "../data-source";
import Paquete from "../entities/servicio/ServicioPaquete.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";

const PaqueteRepo = AppDataSource.manager.getRepository(Paquete);
const servicioRepo = AppDataSource.manager.getRepository(Servicio);

const crearPaquete = async (req: Request, res: Response) => {
  console.log("Crear paquete");
  const {
    nombre,
    descripcion,
    mbRegular,
    mbBono,
    precio,
    mbRecargo,
    perfilReducido,
    perfilRegular,
    servicio,
  } = req.body;
  const usuarioCreacion: User = res.locals.user;

  try {
    const paquete = new Paquete({
      nombre,
      descripcion,
      mbRegular,
      mbBono,
      precio,
      mbRecargo,
      perfilReducido,
      perfilRegular,
      servicio,
      usuarioCreacion,
    });
    await paquete.save();
    return res.json(paquete);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo agregar al Paquete " + error });
  }
};

const getPaquetes = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const PaquetesPerPage: number = (req.query.count || 20) as number;

  try {
    const Paquetes = await PaqueteRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["usuarioCreacion", "servicio"],
      skip: currentPage * PaquetesPerPage,
      take: PaquetesPerPage,
    });

    return res.json(Paquetes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getPaquete = async (req: Request, res: Response) => {
  const { idPaquete } = req.params;
  const id = Number.parseInt(idPaquete);
  try {
    const Paquete = await PaqueteRepo.findOne({
      where: {
        id,
      },
      relations: ["usuarioCreacion", "servicio"],
    });
    return res.json(Paquete);
  } catch (error) {
    return res.status(500).json({ errror: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", user, auth, crearPaquete);
router.get("/", getPaquetes);
router.get("/:idPaquete", getPaquete);
//router.post("/Paquete", agregarPaquetePaquete)

export default router;
