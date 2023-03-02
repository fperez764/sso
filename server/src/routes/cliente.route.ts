import { validate } from "class-validator";
import { Request, Response, Router } from "express";
import { AppDataSource } from "../data-source";
import Cliente from "../entities/cliente/Cliente.entity";
import User from "../entities/User.entity";
import auth from "../middleware/auth.middleware";
import user from "../middleware/user.middleware";
import { mapErrors } from "../utils/misc";
import logger from "../utils/logger";
import { Like } from "typeorm";

const clienteRepo = AppDataSource.manager.getRepository(Cliente);

const crearCliente = async (req: Request, res: Response) => {
  logger.apiinfo("Crear Cliente");
  const {
    nombreCompleto,
    nroDocumento,
    direccion,
    telefono,
    email,
    nroDocumentoFacturacion,
    tipoDocumentoFacturacion,
    razonSocial,
  } = req.body;
  const usuarioCreacion: User = res.locals.user;

  try {
    //Validate data
    let errores: any = {};
    const clienteNroDocumento = await clienteRepo.findOneBy({
      nroDocumento: nroDocumento,
    });
    if (clienteNroDocumento)
      errores.nroDocumento =
        "Este nro. de documento ya se encuentra registrado " +
        clienteNroDocumento.nombreCompleto;
    if (Object.keys(errores).length > 0)
      return res.status(400).json({ errors: errores });

    const cliente = new Cliente({
      nombreCompleto,
      nroDocumento,
      direccion,
      telefono,
      email,
      nroDocumentoFacturacion,
      tipoDocumentoFacturacion,
      razonSocial,
      usuarioCreacion,
    });
    errores = await validate(cliente);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }
    await cliente.save();
    return res.json(cliente);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "No se pudo agregar al cliente" + error });
  }
};

const actualizarCliente = async (req: Request, res: Response) => {
  logger.apiinfo("Actualizar Cliente");
  const { idCliente } = req.params;
  const {
    nombreCompleto,
    nroDocumento,
    direccion,
    telefono,
    email,
    nroDocumentoFacturacion,
    tipoDocumentoFacturacion,
    razonSocial,
  } = req.body;
  const cliente = await clienteRepo.findOne({
    where: {
      id: Number.parseInt(idCliente),
    },
  });

  try {
    cliente.nombreCompleto = nombreCompleto ?? cliente.nombreCompleto;
    cliente.nroDocumento = nroDocumento ?? cliente.nroDocumento;
    cliente.direccion = direccion ?? cliente.direccion;
    cliente.telefono = telefono ?? cliente.telefono;
    cliente.email = email ?? cliente.email;
    cliente.nroDocumentoFacturacion =
      nroDocumentoFacturacion ?? cliente.nroDocumentoFacturacion;
    cliente.tipoDocumentoFacturacion =
      tipoDocumentoFacturacion ?? cliente.tipoDocumentoFacturacion;
    cliente.razonSocial = razonSocial ?? cliente.razonSocial;
    cliente.usuarioCreacion = res.locals.user;
    let errores = await validate(cliente);
    if (errores.length > 0) {
      return res.status(400).json(mapErrors(errores));
    }

    await cliente.save();
    return res.json(cliente);
  } catch (error) {
    logger.error(error);
    return res.status(500).json(error);
  }
};

const getClientes = async (req: Request, res: Response) => {
  const currentPage: number = (req.query.page || 0) as number;
  const clientesPerPage: number = (req.query.count || 30) as number;

  try {
    const clientes = await clienteRepo.find({
      order: { fechaCreacion: "DESC" },
      relations: [
        "usuarioCreacion",
        "clienteServicios",
        "clienteServicios.tickets",
        "clienteServicios.servicio",
        "clienteServicios.clienteServicioPeriodos",
      ],
      skip: currentPage * clientesPerPage,
      take: clientesPerPage,
    });
    logger.silly(JSON.stringify(clientes));
    return res.json(clientes);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: "Algo salio mal " + err });
  }
};

const getCliente = async (req: Request, res: Response) => {
  const { idCliente } = req.params;
  const id = Number.parseInt(idCliente);
  try {
    const cliente = await clienteRepo.findOne({
      where: {
        id,
      },
      relations: [
        "usuarioCreacion",
        "clienteServicios",
        "solicitudesServicio",
        "clienteServicio.tickets",
      ],
    });
    return res.json(cliente);
  } catch (error) {
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const getClientePorNombre = async (req: Request, res: Response) => {
  const { filterKey } = req.params;
  try {
    const cliente = await clienteRepo.find({
      where: {
        nombreCompleto: Like(`%${filterKey}%`),
      },
      relations: [
        "usuarioCreacion",
        "clienteServicios",
        "solicitudesServicio",
        "clienteServicios.tickets",
      ],
    });
    return res.json(cliente);
  } catch (error) {
    return res.status(500).json({ error: "Algo salio mal " + error });
  }
};

const router = Router();
router.post("/", user, auth, crearCliente);
router.get("/", getClientes);
router.get("/:idCliente", getCliente);
router.put("/:idCliente", actualizarCliente);
router.get("/:filterKey", getClientePorNombre);

export default router;
