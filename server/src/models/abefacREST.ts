import axios from "axios";
import dayjs from "dayjs";
import { checkEmail } from "../utils/misc";
import { FacturaDetalle } from "../../../client/types/typesABEFAC";
import Cliente from "../entities/cliente/Cliente.entity";
import logger from "../utils/logger";

const prod = process.env.NODE_ENV === "production";
const url = prod
  ? process.env.FACTURACION_URL_BASE_PROD
  : process.env.FACTURACION_URL_BASE;
const token = prod
  ? process.env.FACTURACION_TOKEN_PROD
  : process.env.FACTURACION_TOKEN;

const abefacConn = axios.create({
  baseURL: url,
  timeout: 10000,
  headers: {
    Authorization: "Bearer " + token,
  },
});

const formatDateABEFAC = "YYYY-MM-DD";
const formatIdOpABEFAC = "YYYY-MM-DDTHH:mm:ssZ";

export const getFacturas = async (fechaInicio: Date, fechaFin: Date) => {
  if (!process.env.FACTURACION_URL_BASE)
    throw { error: "variables locales no definidas" };
  if (!fechaInicio || !fechaFin) {
    fechaInicio = new Date();
    fechaFin = new Date();
    fechaFin.setDate(fechaFin.getDate() - 100);
  }
  fechaFin.setDate(fechaFin.getDate() + 1);
  const filtroFechas = `?fechaInicio=${dayjs(fechaInicio).format(
    formatDateABEFAC
  )}&fechaFin=${dayjs(fechaFin).format(formatDateABEFAC)}`;
  logger.debug(`Consulta ABEFAC facturas en: ${url + filtroFechas}`);
  const res = await abefacConn.get(Res.LISTAR_FACTURAS.endpoint + filtroFechas);
  return res.data;
};

/**
 * Emite una factura a traves del modulo ABEFAC, retornando el idOperacion.
 */
export const postFactura = async (
  cliente: Cliente,
  detallesFactura: FacturaDetalle[],
  pagado: boolean,
  sistema: string,
  descripcion: string,
  noVerificarNit: boolean,
  login: string,
  descuentoAdicional: number
) => {
  if (cliente === null) {
    throw "Cliente no puede ser null para emitir factura";
  }
  logger.info(
    "ABEFAC Solicita emision de factura para el cliente" +
      cliente.nombreCompleto
  );
  const idOperacion = dayjs(new Date()).format(formatIdOpABEFAC);
  let facturaJSON: any = {
    idOperacion,
    tipoDocumento: cliente.tipoDocumentoFacturacion,
    razonSocial: cliente.razonSocial,
    numeroDocumento: cliente.nroDocumentoFacturacion,
    correo: checkEmail(cliente.email),
    idCuenta: cliente.id,
    montoTotal: detallesFactura.reduce(
      (acc, det) => acc + det.precioDetalle,
      0
    ),
    pagado,
    sistema,
    usuarioEmision: login,
    descripcion,
  };
  if (descuentoAdicional !== null) {
    facturaJSON = {
      ...facturaJSON,
      montoDescuentoAdicional: Math.round(descuentoAdicional),
    };
  }
  if (noVerificarNit) {
    facturaJSON = { ...facturaJSON, noVerificarNit: noVerificarNit };
  }

  facturaJSON = { ...facturaJSON, facturaDetalles: detallesFactura };

  const res = Res.FACTURAR.method(Res.FACTURAR.endpoint);
  logger.info("Factura emitida: " + JSON.stringify(res));
  try {
    let factura = await getFactura(idOperacion);
    return factura.idOperacion;
  } catch (e) {
    logger.error("Factura registrada aun en proceso, reintentar", e);
  }
  return idOperacion;
};

export const getFacturasCliente = async (cliente: Cliente) => {
  logger.debug(
    "ABEFAC Solicita facturas del cliente con nit " +
      cliente.nroDocumentoFacturacion
  );
  const resource = Res.GET_FACTURA_CLIENTE.endpoint.replace(
    "{idCliente}",
    cliente.id.toString()
  );
  const res = await Res.GET_FACTURA_CLIENTE.method(resource);
  return res.data;
};

export const getFactura = async (idOperacion: string) => {
  logger.debug("ABEFAC Solicita la factura con idOperacion " + idOperacion);
  const resource = Res.GET_FACTURA.endpoint.replace(
    "{idOperacion}",
    idOperacion
  );
  const response = await Res.GET_FACTURA.method(resource);
  if (response.data.datos.length > 1) {
    logger.warn(
      "Se encontro mas de una factura con ese idOperacion, se devuelve la primera"
    );
  }
  return response.data.datos[0];
};

export const patchAnularFactura = async (
  idOperacion: string,
  motivo: string,
  login: string
) => {
  const factura = await getFactura(idOperacion);
  if (factura.cuf == null) {
    logger.error(
      "Factura no tiene CUF despues de consulta no puede ser anulada idop: " +
        factura.idOperacion
    );
    throw "Factura no tiene CUF despues de consulta, contacte soporte.";
  }
  if (factura.estadoAnulacion !== "" || factura.estadoAnulacion !== undefined) {
    logger.error(
      "Factura ya se encuentra anulada, idop: " + factura.idOperacion
    );
    throw "Factura ya se encuentra anulada.";
  }
  logger.debug("ABEFAC Solicita anular factura " + factura.idOperacion);
  const resource = Res.ANULAR.endpoint.replace("{cuf}", factura.cuf);
  const solAnulacion = {
    motivo,
    tipoAnulacion: TipoAnulacion.FACTURA_MAL_EMITIDA.toString,
    usuarioAnulacion: login,
  };
  const response = Res.ANULAR.method(resource, { data: solAnulacion });
  logger.debug(`Factura con idop ${factura.idOperacion} anulada ${response}`);
  factura.usuarioAnulacion = login;
  factura.estadoAnulacion = TipoAnulacion.FACTURA_MAL_EMITIDA.toString();
  factura.fechaAnulacion = dayjs(new Date()).format(formatDateABEFAC);
  factura.estado = FacturaEstado.ANULADO.toString();
  return factura;
};

export const patchPagarFactura = (
  idOperacion: string,
  observacion: string,
  login: string
) => {
  return actualizarFacturaPagado(idOperacion, observacion, true, login);
};

export const patchDesPagarFactura = (
  idOperacion: string,
  observacion: string,
  login: string
) => {
  return actualizarFacturaPagado(idOperacion, observacion, false, login);
};

const actualizarFacturaPagado = (
  idOperacion: string,
  observacion: string,
  pagado: boolean,
  login: string
) => {
  const resource = Res.PAGAR_FACTURA.endpoint.replace(
    "{idOperacion}",
    idOperacion
  );
  const motivoJSON = {
    pagado,
    observacion,
    login,
  };
  const res = Res.PAGAR_FACTURA.method(resource, { data: motivoJSON });
  logger.info(`Factura idop: ${idOperacion} pagada \n ${res}`);
  return res;
};

export const getConsultarFactura = (codigoSeguimiento: string) => {
  const resource = Res.CONSULTAR.endpoint.replace(
    "{codigoSeguimiento}",
    codigoSeguimiento
  );
  return Res.CONSULTAR.method(resource);
};

export const getNotificarFactura = (codigoSeguimiento: string) => {
  const resource = Res.NOTIFICAR.endpoint.replace(
    "{codigoSeguimiento}",
    codigoSeguimiento
  );
  return Res.NOTIFICAR.method(resource);
};

export const delRechazarFactura = (idOperacion: string) => {
  logger.warn(
    "ABEFAC Solicita rechazar la factura con idOperacion " + idOperacion
  );
  const resource = Res.RECHAZAR.endpoint.replace("{idOperacion}", idOperacion);
  return Res.RECHAZAR.method(resource);
};

const Res = {
  FACTURAR: { endpoint: "/emisiones", method: abefacConn.post },
  EMITIR_LOTE: { endpoint: "/emisiones-lotes", method: abefacConn.post },
  NOTIFICAR: {
    endpoint: "/notificaciones/{codigoSeguimiento}",
    method: abefacConn.post,
  },
  ANULAR: { endpoint: "/anulaciones/{cuf}", method: abefacConn.patch },
  CONSULTAR: {
    endpoint: "/consultas/{codigoSeguimiento}",
    method: abefacConn.get,
  },
  PAGAR_FACTURA: {
    endpoint: "/solicitudes/{idOperacion}/estadoPagos",
    method: abefacConn.patch,
  },
  LISTAR_FACTURAS: { endpoint: "/facturas", method: abefacConn.get },
  GET_FACTURA: { endpoint: "/facturas/{idOperacion}", method: abefacConn.get },
  RECHAZAR: { endpoint: "/facturas/{idOperacion}", method: abefacConn.delete },
  GET_FACTURA_CLIENTE: {
    endpoint: "/clientes/{idCliente}/facturas",
    method: abefacConn.get,
  },
};

enum FacturaEstado {
  CREADO,
  ENVIADO,
  ENVIADO_ERROR,
  EMITIDO_EXITO,
  EMITIDO_OBSERVADO,
  ANULADO,
  RECHAZADO,
}

enum FacturaEstadoNotificacion {
  PENDIENTE,
  NOTIFICADO,
}

enum FacturaEstadoAnulacion {
  RECEPCIONADO,
  EXITO,
  OBSERVADO,
}
enum TipoAnulacion {
  FACTURA_MAL_EMITIDA,
  DATOS_DE_EMISION_INCORRECTOS,
  FACTURA_DEVUELTA,
}
