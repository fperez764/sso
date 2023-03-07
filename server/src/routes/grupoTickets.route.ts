import { isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import GrupoTicket, {
  TipoTicket,
} from "../entities/tickets/GrupoTicket.entity";
<<<<<<< HEAD
import { mapErrors } from "../utils/misc";
import { getgroups } from "process";

const grupoRepo = AppDataSource.manager.getRepository(GrupoTicket);
=======
import Servicio from "../entities/servicio/Servicio.entity";
import { mapErrors } from "../utils/misc";

const grupoRepo = AppDataSource.manager.getRepository(GrupoTicket);
const servicioRepo = AppDataSource.manager.getRepository(Servicio);
>>>>>>> master

const crearGrupo = async (req: Request, res: Response) => {
  const { nombre, descripcion, tipo } = req.body;
  const usuarioCreacion: User = res.locals.user;
  try {
    let errors: any = {};
    if (isEmpty(nombre)) errors.nombre = "Nombre no puede estar vacio";
    if (isEmpty(tipo)) errors.tipo = "Tipo ticket no puede estar vacio";
    const grupo = await grupoRepo
      .createQueryBuilder("grupo")
      .where("lower(grupo.nombre) = :nombre", { nombre: nombre.toLowerCase() })
      .getOne();
    if (grupo) errors.nombre = "Grupo ya existe.";

    if (Object.keys(errors).length > 0) throw errors;
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const grupo = new GrupoTicket({
      nombre,
      descripcion,
      tipo,
      usuarioCreacion,
    });
    let errores = await validate(grupo);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await grupo.save();
    return res.json(grupo);
  } catch (err) {
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getTipos = (req: Request, res: Response) => {
  return res.status(200).json({ Tipos: TipoTicket });
};

<<<<<<< HEAD
const getGrupos = async (req: Request, res: Response) => {
  try {
    const grupos = await grupoRepo.find({
      order: { fechaCreacion: "DESC" },
    });
    return res.json(grupos);
  } catch (err) {
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const router = Router();
router.post("/", user, auth, crearGrupo);
router.get("/", getGrupos);
=======
const router = Router();
router.post("/", user, auth, crearGrupo);
>>>>>>> master
router.get("/tipos", getTipos);
export default router;
