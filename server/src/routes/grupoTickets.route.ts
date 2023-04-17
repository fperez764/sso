import { isArray, isEmpty, validate } from "class-validator";
import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import GrupoTicket, {
  TipoTicket,
} from "../entities/tickets/GrupoTicket.entity";
import { mapErrors } from "../utils/misc";
import logger from "../utils/logger";
import GrupoTicketFlujoRespuestas from "../entities/tickets/GrupoTicketFlujoRespuestas.entity";

const grupoRepo = AppDataSource.manager.getRepository(GrupoTicket);

const crearGrupo = async (req: Request, res: Response) => {
  const { nombre, descripcion, tipo, nombreServicio, respuestas} = req.body;
  const usuarioCreacion: User = res.locals.user;
  //Validaciones
  let errores: any = {};
  if (isEmpty(nombre)) errores.nombre = "Nombre no puede estar vacio";
  if (isEmpty(descripcion)) errores.nombre = "Descripcion no puede estar vacia";
  if (isEmpty(tipo)) errores.tipo = "Tipo ticket no puede estar vacio";
  if(isEmpty(nombreServicio)) errores.servicio = "Debe especificar un servicio.";
  if(isEmpty(respuestas) || !isArray(respuestas)) errores.respuestas = "Todo grupo nuevo debe incluir al menos una respuesta-acción en su flujo.";

  try {    
    const grupo = await grupoRepo
      .createQueryBuilder("grupo")
      .where("lower(grupo.nombre) = :nombre", { nombre: nombre.toLowerCase() })
      .getOne();
    if (grupo) errores.nombre = "Grupo ya existe.";
    if (Object.keys(errores).length > 0) throw errores;
  } catch (err) {
    logger.apierror("validarGrupo: Algo salio mal\n" + err)
    return res.status(400).json("Algo salio mal al validar la información del grupo. \n" + JSON.stringify(err));
  }
  let nGrupo: GrupoTicket;
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try {
    const grupo = new GrupoTicket({
      nombre,
      descripcion,
      tipo,
      servicio: nombreServicio,
      usuarioCreacion,
    });
    let errores = await validate(grupo);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    nGrupo = await grupo.save();
  } catch (error) {
    logger.apierror("crearGrupo: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
  try {
    for(let i=0; i < respuestas.length; i++){
      let resp = new GrupoTicketFlujoRespuestas({
        orden: respuestas[i].orden,
        area: respuestas[i].area,
        accion: respuestas[i].accion,
        vigenciaDias: respuestas[i].vigenciaDias,    
        grupo: nGrupo,
        usuarioCreacion
      });  
      errores = await validate(resp);
      if (errores.length > 0) { break;}
      await resp.save();
      logger.apiinfo(`resp-precommit: ${resp.orden}:${resp.area} guardada para grupo:${nGrupo.nombre}`);
    }
    if (errores.length > 0) {
      await queryRunner.rollbackTransaction();
      return res.status(400).json(mapErrors(errores));
    }      
    await queryRunner.commitTransaction();
    logger.apiinfo(`Nuevo grupo creado: ${nGrupo.id}: ${nGrupo.nombre}`);
    return res.status(200).json(nGrupo);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    logger.apierror("Algo salio mal al guardar las respuestas. \n" + JSON.stringify(error));
    return res.status(500).json("Algo salio mal al guardar las respuestas. \n" + JSON.stringify(error));
  }finally{
    await queryRunner.release();
  }
  
};

const actualizarGrupo = async (req: Request, res: Response) => {
  const { nombre, descripcion, tipo, nombreServicio, respuestas } = req.body;
  const {idGrupo} = req.params;
  const usuarioCreacion: User = res.locals.user;
  let grupo: GrupoTicket;
  const queryRunner = AppDataSource.createQueryRunner();
  await queryRunner.startTransaction();
  try{
    const id = Number.parseInt(idGrupo)
    grupo = await grupoRepo.findOne({where:{id}, relations:["respuestas"]});
    if(!grupo) return res.status(406).json(`Grupo ${idGrupo} no encontrado.`);
    for(let i=0; i < grupo.respuestas.length; i++){
      await grupo.respuestas[i].remove();
      //TODO! Permitir softremove agregando al UQ(orden) fechaBaja
    }
    grupo.nombre = nombre ?? grupo.nombre;
    grupo.descripcion = descripcion ?? grupo.descripcion;
    grupo.tipo = tipo ?? grupo.tipo;
    grupo.servicio = nombreServicio ?? grupo.servicio;
    await grupo.save();
  } catch (error) {
    logger.apierror("actualizarGrupo: Algo salio mal\n" + error);
    return res.status(500).json("Algo salio mal\n" + error);
  }
  try {
    let errores: any;
    for(let i=0; i < respuestas.length; i++){
      let resp = new GrupoTicketFlujoRespuestas({
        orden: respuestas[i].orden,
        area: respuestas[i].area,
        accion: respuestas[i].accion,
        vigenciaDias: respuestas[i].vigenciaDias,    
        grupo,
        usuarioCreacion
      });
      errores = await validate(resp);
      if (errores.length > 0) { break;}
      console.log(`ActualizarGrupo: resp ${resp.orden}-${resp.area}: ${grupo.nombre}`);
      await resp.save();
    }
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }      
    await queryRunner.commitTransaction();
    return res.status(200).json(grupo);
  } catch (error) {
    await queryRunner.rollbackTransaction();
    return res.status(500).json("ActualizarGrupo: Algo salio mal al guardar las respuestas. " + error);
  }finally{
    await queryRunner.release();
  }
};

const eliminarGrupo = async (req: Request, res: Response) => {
  const {idGrupo} = req.params;
  try {
    const id = Number.parseInt(idGrupo);
    const grupo = await grupoRepo.findOne({where: {id}});    
    grupo.remove();
    return res.json('Grupo eliminado');
  } catch (error) {
    logger.apierror('No se pudo eliminar al grupo.\n' + error);    
    return res.status(500).json("No se pudo eliminar al grupo.\n" + error);
  }
}

const getTipos = (req: Request, res: Response) => {
  return res.status(200).json({ list: Object.values(TipoTicket) });
};

const getGrupos = async (req: Request, res: Response) => {
  try {
    const grupos = await grupoRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: ["usuarioCreacion","respuestas", "respuestas.usuarioCreacion", "servicio"]
    });
    return res.json(grupos);
  } catch (err) {
    return res.status(500).json("Algo salio mal " + err);
  }
};

const router = Router();
router.get("/", getGrupos);
router.post("/", user, auth, crearGrupo);
router.delete("/:idGrupo", user, auth, eliminarGrupo);
router.put("/:idGrupo", user, auth, actualizarGrupo);
router.get("/tipos", getTipos);
export default router;
