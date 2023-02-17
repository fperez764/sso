import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import Permiso from "../entities/Permiso.entity";

const permisoRepo = AppDataSource.manager.getRepository(Permiso);

const crearPermiso = async (req: Request, res: Response) => {
  const { area, rol, permiso, entidad } = req.body;
  try {
    const permisoAntiguo = await permisoRepo.findOneBy({ area, rol, entidad });
    if (permisoAntiguo) {
      permisoAntiguo.permiso = permiso ?? permisoAntiguo.permiso;
      permisoRepo.save(permisoAntiguo);
      return res.status(200).json(permisoAntiguo);
    }
    const usuarioCreacion = res.locals.user.username;
    const nuevoPermiso = new Permiso({
      usuarioCreacion,
      area,
      rol,
      permiso,
      entidad,
    });
    await permisoRepo.save(nuevoPermiso);
    return res.json(nuevoPermiso);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const getPermisos = async (req: Request, res: Response) => {
  return res.status(200).json(await permisoRepo.find());
};

const router = Router();
router.post("/permisos", crearPermiso);
router.put("/permisos", crearPermiso);
router.get("/permisos", getPermisos);
export default router;
