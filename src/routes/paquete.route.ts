import { Request, Response, Router } from "express";
import Servicio from "../controllers/servicio/Servicio";
import { AppDataSource } from "../data-source";
import Paquete from "../entities/servicio/ServicioPaquete.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";

const PaqueteRepo = AppDataSource.manager.getRepository(Paquete);

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
    servicioNombre,
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
      servicio: servicioNombre,
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

const actualizarPaquete = async (req: Request, res: Response) => {
  const { idPaquete } = req.params;
  const id = Number.parseInt(idPaquete);
  console.log("Crear paquete " + idPaquete);
  const {
    nombre,
    descripcion,
    mbRegular,
    mbBono,
    precio,
    mbRecargo,
    perfilReducido,
    perfilRegular,
    servicioNombre,
  } = req.body;
  try {
    const paquete = await PaqueteRepo.findOne({
      where: { id },
    });
    paquete.nombre = nombre ?? paquete.nombre;
    paquete.descripcion = descripcion ?? paquete.descripcion;
    paquete.mbRegular = mbRegular ?? paquete.mbRegular;
    paquete.mbBono = mbBono ?? paquete.mbBono;
    paquete.precio = precio ?? paquete.precio;
    paquete.mbRecargo = mbRecargo ?? paquete.mbRecargo;
    paquete.perfilReducido = perfilReducido ?? paquete.perfilReducido;
    paquete.perfilRegular = perfilRegular ?? paquete.perfilRegular;
    paquete.servicio = servicioNombre ?? paquete.servicio;
    paquete.usuarioCreacion = res.locals.user;
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
    const paquetes = await PaqueteRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["usuarioCreacion", "servicio"],
      skip: currentPage * PaquetesPerPage,
      take: PaquetesPerPage,
    });

    return res.json(paquetes);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getPaquete = async (req: Request, res: Response) => {
  const { idPaquete } = req.params;
  const id = Number.parseInt(idPaquete);
  try {
    const paquete = await PaqueteRepo.findOne({
      where: {
        id,
      },
      relations: ["usuarioCreacion", "servicio"],
    });
    return res.json(paquete);
  } catch (error) {
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", user, auth, crearPaquete);
router.get("/", getPaquetes);
router.get("/:idPaquete", getPaquete);
router.put("/:idPaquete", actualizarPaquete);
//router.post("/Paquete", agregarPaquetePaquete)

export default router;
