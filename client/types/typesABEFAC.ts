export interface RespuestaABEFAC{
    finalizado: boolean;
    codigo: number;
    timestamp: string;
    mensaje: string;
    datos: Factura[];
}

export interface Factura{
    fechaCreacion: string;
    id: string;
    idOperacionPago: string;
    sistema: string;
    montoTotal: number;
    pagado: boolean;
    descripcion: string;
    cuf: string | undefined;
    numeroFactura: number | undefined;
    urlPdf: string | undefined;
    urlXml: string | undefined;
    fechaEmision: string;
    fechaAnulacion: string | undefined;
    observacion: string | undefined;
    estado: string;
    usuarioEmision: string;
    usuarioAnulacion: string | undefined;
    errorEnvio: string | undefined;
    cliente: ClienteFactura;
    facturaDetalles: FacturaDetalle[];
}

export interface ClienteFactura{
        tipoDocumento: string;
        nroDocumento: string;
        razonSocial: string;
        idCuenta: number;
}
export interface FacturaDetalle{
      codigo: string;
}