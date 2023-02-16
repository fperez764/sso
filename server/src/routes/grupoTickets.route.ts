import { isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import TicketGrupo from "../entities/tickets/TicketGrupo.entity";
import Servicio from "../entities/servicio/Servicio.entity";

const grupoRepo = AppDataSource.manager.getRepository(TicketGrupo);
const servicioRepo = AppDataSource.manager.getRepository(Servicio);

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
    const grupo = new TicketGrupo({
      nombre,
      descripcion,
      tipo,
      usuarioCreacion,
    });
    await grupo.save();
    return res.json(grupo);
  } catch (err) {
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const router = Router();
router.post("/", user, auth, crearGrupo);
export default router;
