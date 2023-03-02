import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import Cliente from "../entities/cliente/Cliente.entity";
import User from "../entities/User.entity";
import logger from "../utils/logger";
import ClienteServicio from "../entities/cliente/ClienteServicio.entity";
import ClienteServicioModem from "../entities/cliente/ClienteServicioModem.entity";
import { validate } from "class-validator";
import { mapErrors } from "../utils/misc";
import { DataSource, IsNull, createQueryBuilder } from "typeorm";

const clienteRepo = AppDataSource.manager.getRepository(Cliente);
const cliSerRepo = AppDataSource.manager.getRepository(ClienteServicio);
const modemRepo = AppDataSource.manager.getRepository(ClienteServicioModem);

const agregarClienteServicio = async (req: Request, res: Response) => {
  logger.apiinfo("Crear Cliente-Servicio");
  const usuarioCreacion: User = res.locals.user;

  const { idCliente } = req.params;
  const id = Number.parseInt(idCliente);
  const { nombreServicio } = req.body;
  if (!nombreServicio)
    return res
      .status(400)
      .json({ message: "El servicio debe ser especificado" });
  const cliente = await clienteRepo.findOne({
    where: { id },
    relations: ["clienteServicios", "solicitudesServicios"],
  });
  if (!cliente)
    return res.status(400).json({
      message: "No se pudo encontrar al cliente con id: " + idCliente,
    });
  try {
    const cliSer = new ClienteServicio({
      activo: true,
      servicio: nombreServicio,
      cliente,
      usuarioCreacion,
    });
    let errores = await validate(cliSer);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }

    await cliSerRepo.save(cliSer);
  } catch (error) {
    res.status(500).json({ message: "Algo salio mal" + error });
  }
};

//TODO? No se deberia poder modificar un cliente Servicio, solo darlo de baja?
//? O tal vez si para los casos como de los clientes sube que se vuelven ka ilimitados.
const modificarClienteServicio = async (req: Request, res: Response) => {
  logger.apiinfo("Modificar Cliente-Servicio");

  const { idClienteServicio } = req.params;
  const id = Number.parseInt(idClienteServicio);
  const { nombreServicio } = req.body;
  if (!nombreServicio)
    return res
      .status(400)
      .json({ message: "El nuevo servicio debe ser especificado" });
  try {
    const clienteServicio = await cliSerRepo.findOne({
      where: { id },
    });
    if (!clienteServicio)
      return res.status(400).json({
        message:
          "No se pudo encontrar al clienteServicio con id: " +
          idClienteServicio,
      });
    clienteServicio.servicio = nombreServicio;
    let errores = await validate(clienteServicio);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await cliSerRepo.save(clienteServicio);
  } catch (error) {
    res.status(500).json({ message: "Algo salio mal" + error });
  }
};

const bajaClienteServicio = async (req: Request, res: Response) => {
  logger.apiinfo("Dar de baja Cliente-Servicio");
  const { idClienteServicio } = req.params;
  const id = Number.parseInt(idClienteServicio);
  try {
    const clienteServicio = await cliSerRepo.findOne({
      where: { id },
    });
    if (!clienteServicio)
      return res.status(400).json({
        message:
          "No se pudo encontrar al clienteServicio con id: " +
          idClienteServicio,
      });
    clienteServicio.activo = false;
    clienteServicio.usuarioBaja = res.locals.user;

    await cliSerRepo.save(clienteServicio);
  } catch (error) {
    res.status(500).json({ message: "Algo salio mal" + error });
  }
};

const asignarModemClienteServicio = async (req: Request, res: Response) => {
  logger.apiinfo("Asignar modem a Cliente-Servicio");
  const usuarioCreacion: User = res.locals.user;

  const { idClienteServicio } = req.params;
  const id = Number.parseInt(idClienteServicio);
  const { mac, autoAdministrado, idSolicitudRespuesta } = req.body;
  if (!mac)
    return res
      .status(400)
      .json({ message: "Debe especificar la MAC del modem" });
  try {
    const clienteServicio = await cliSerRepo.findOne({
      where: { id },
      relations: ["modems", "modems.usuarioCreacion", "modems.usuarioBaja"],
    });
    const isRepetidoActivo =
      (await modemRepo.findOne({
        where: { mac, usuarioBaja: IsNull() },
        relations: ["clienteServicio"],
      })) ||
      (await modemRepo.findOne({
        where: { mac: mac.replaceAll(":"), usuarioBaja: IsNull() },
        relations: ["clienteServicio"],
      }));
    if (isRepetidoActivo)
      return res.status(400).json({
        message: `${
          isRepetidoActivo.clienteServicio.id === id ? "Este mismo" : "El"
        } clienteServicio: ${
          isRepetidoActivo.clienteServicio.id
        } ya tiene asignado al modem ${mac} con estado activo`,
      });
    const modem = new ClienteServicioModem({
      clienteServicio,
      mac: mac,
      autoAdministrado: autoAdministrado!!,
      usuarioCreacion,
    });
    //TODO! Conectar con hubs para verificar que el modem existe y otras acciones
    let errores = await validate(modem);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await modemRepo.save(modem);
    res.status(200).json(modem);
  } catch (error) {
    res.status(500).json({ message: "Algo salio mal" + error });
  }
};

const liberarModemClienteServicio = async (req: Request, res: Response) => {
  logger.apiinfo("Liberar modem a Cliente-Servicio");
  const usuario: User = res.locals.user;

  const { idClienteServicio } = req.params;
  const id = Number.parseInt(idClienteServicio);
  const { mac } = req.body;
  try {
    const clienteServicio = await cliSerRepo.findOne({
      where: { id },
      relations: ["modems", "modems.usuarioBaja"],
    });
    if (!clienteServicio)
      return res.status(400).json({
        message:
          "No se pudo encontrar al clienteServicio con id: " +
          idClienteServicio,
      });
    const modem = clienteServicio.modems.find(
      (m) => m.mac === mac && !m.usuarioBaja
    );
    if (!modem)
      return res.status(400).json({
        message: `El clienteServicio ${idClienteServicio} no tiene asignado un modem con mac ${mac}`,
      });

    //TODO! Conectar con hubs para bloquear|cambio perfil
    modem.usuarioBaja = usuario;
    await modemRepo.save(modem);
    res.status(200).json(modem);
  } catch (error) {
    res.status(500).json({ message: "Algo salio mal" + error });
  }
};

const router = Router();
router.post("/:idCliente", agregarClienteServicio);
router.put("/:idClienteServicio", modificarClienteServicio);
router.delete("/:idClienteServicio", bajaClienteServicio);
router.post("/:idClienteServicio/modem", asignarModemClienteServicio);
//No se puede modificar, solo asignar y dar de baja router.put("/:idClienteServicio/:mac", modificarModemClienteServicio);
router.delete("/:idClienteServicio/modem", liberarModemClienteServicio);

export default router;
