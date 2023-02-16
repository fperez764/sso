import { AppDataSource } from "../data-source";
import Cliente from "../entities/cliente/Cliente.entity";
import { Request, Response, Router } from "express";
import {
  getFactura,
  getFacturas,
  getFacturasCliente,
  patchAnularFactura,
  patchPagarFactura,
  patchDesPagarFactura,
  postFactura,
} from "../models/abefacREST";
import user from "../middleware/user.middleware";
import auth from "../middleware/auth.middleware";
import logger from "../utils/logger";

const clienteRepo = AppDataSource.manager.getRepository(Cliente);

const emitirFactura = async (req: Request, res: Response) => {
  const {
    idCliente,
    pagado,
    sistema,
    descripcion,
    detallesFactura,
    noVerificarNit,
    descuentoAdicional,
  } = req.body;
  const usuarioEmision = res.locals.user;
  try {
    const cliente = await clienteRepo.findOneBy({ id: idCliente });
    if (!cliente) throw "Cliente no registrado";
    return res.json(
      await postFactura(
        cliente,
        detallesFactura,
        pagado,
        sistema,
        descripcion,
        noVerificarNit,
        usuarioEmision.username,
        descuentoAdicional
      )
    );
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .json({ message: "No se pudo emitir la factura " + err });
  }
};

const listFacturas = async (req: Request, res: Response) => {
  const { fechaInicio, fechaFin } = req.query;
  try {
    const response = await getFacturas(
      new Date(fechaInicio.toString()),
      new Date(fechaFin.toString())
    );
    return res.json(response);
  } catch (err) {
    const errMessage = `No se pudieron obtener facturas para el url: ${err.response?.url} \n Error: ${err.message}`;
    logger.error(errMessage);
    return res.status(400).json({ message: errMessage });
  }
};

const listFacturasCliente = async (req: Request, res: Response) => {
  const { idCliente } = req.params;
  try {
    const cliente = await clienteRepo.findOneBy({
      id: Number.parseInt(idCliente),
    });
    if (!cliente) throw "Cliente no registrado";
    const response = await getFacturasCliente(cliente);
    return res.json(response);
  } catch (err) {
    const errMessage = `No se pudieron obtener facturas para el cliente: ${idCliente} \n ${err.message}`;
    logger.error(errMessage);
    return res.status(400).json({ message: errMessage });
  }
};

const listFactura = async (req: Request, res: Response) => {
  const { idOperacion } = req.params;
  try {
    const response = await getFactura(idOperacion);
    return res.json(response);
  } catch (err) {
    const errMessage = `No se encontro la factura con idOperacion: ${idOperacion} \n ${err.message}`;
    logger.error(errMessage);
    return res.status(400).json({ message: errMessage });
  }
};

const anularFactura = async (req: Request, res: Response) => {
  const { idOperacion } = req.params;
  const { motivo } = req.body;
  try {
    const response = await patchAnularFactura(
      idOperacion,
      motivo,
      res.locals.user.username
    );
    return res.json(response);
  } catch (err) {
    console.log(err);
    const errMessage = `No se pudo anular la factura con idOperacion: ${idOperacion} \n ${err.message}`;
    logger.error(errMessage);
    return res.status(400).json({ message: errMessage });
  }
};

const pagarFactura = async (req: Request, res: Response) => {
  const { idOperacion } = req.params;
  const { motivo } = req.body;
  try {
    const response = await patchPagarFactura(
      idOperacion,
      motivo,
      res.locals.user.username
    );
    return res.json(response);
  } catch (err) {
    console.log(err);
    const errMessage = `No se pudo pagar la factura con idOperacion: ${idOperacion} \n ${err.message}`;
    logger.error(errMessage);
    return res.status(400).json({ message: errMessage });
  }
};

const desPagarFactura = async (req: Request, res: Response) => {
  const { idOperacion } = req.params;
  const { motivo } = req.body;
  try {
    const response = await patchDesPagarFactura(
      idOperacion,
      motivo,
      res.locals.user.username
    );
    return res.json(response);
  } catch (err) {
    console.log(err);
    const errMessage = `No se pudo despagar la factura con idOperacion: ${idOperacion} \n ${err.message}`;
    logger.error(errMessage);
    return res.status(400).json({ message: errMessage });
  }
};

const router = Router();
router.post("/", user, auth, emitirFactura);
router.get("/", user, auth, listFacturas);
router.get("/cliente/:idCliente", user, auth, listFacturasCliente);
router.get("/:idOperacion", user, auth, listFactura);
router.patch("/:idOperacion", user, auth, anularFactura);
router.put("/:idOperacion", user, auth, pagarFactura);
router.put("/:idOperacion", user, auth, desPagarFactura);

export default router;
