import { isEmpty } from "class-validator";
import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import GrupoSolicitud from "../entities/solicitudServicio/SolicitudGrupo.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";

const grupoRepo = AppDataSource.manager.getRepository(GrupoSolicitud);

const createSub = async (req: Request, res: Response) => {
  const { nombre, descripcion, tipo } = req.body;
  const usuarioCreacion: User = res.locals.user;
  try {
    let errors: any = {};
    if (isEmpty(nombre)) errors.nombre = "Nombre no puede estar vacio";
    if (isEmpty(tipo)) errors.tipo = "Tipo solicitud no puede estar vacio";
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
    const grupo = new GrupoSolicitud({
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
router.post("/", user, auth, createSub);
export default router;
