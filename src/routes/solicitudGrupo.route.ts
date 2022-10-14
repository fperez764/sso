import { isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import GrupoSolicitud from "../entities/solicitudServicio/SolicitudGrupo.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";

const subRepo = AppDataSource.manager.getRepository(GrupoSolicitud);

const createSub = async (req: Request, res: Response) => {
  const { name, title, description } = req.body;
  const usuarioCreacion: User = res.locals.user;
  try {
    let errors: any = {};
    if (isEmpty(name)) errors.name = "Nombre no puede estar vacio";
    if (isEmpty(title)) errors.title = "Titulo no puede estar vacio";
    const sub = await subRepo
      .createQueryBuilder("sub")
      .where("lower(sub.name) = :name", { name: name.toLowerCase() })
      .getOne();
    if (sub) errors.name = "Sub ya existe.";
    if (Object.keys(errors).length > 0) throw errors;
  } catch (err) {
    return res.status(400).json(err);
  }
  try {
    const sub = new GrupoSolicitud({
      name,
      description,
      title,
      usuarioCreacion,
    });
    await sub.save();
    return res.json(sub);
  } catch (err) {
    return res.json(500).json({ error: "Algo salio mal " + err });
  }
};

const router = Router();
router.post("/", user, auth, createSub);
export default router;
