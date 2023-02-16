export interface RespuestaABEFAC{
    finalizado: boolean;
    codigo: number;
    timestamp: string;
    mensaje: string;
    datos: Factura[];
}

export interface Factura{
    fechaCreacion: string;
    fechaActualizacion: string;
    fechaEmision: string;
    estadoAnulacion?: string;
    fechaAnulacion: string | undefined;
    id: string;
    idOperacion: string;
    sistema: string;
    montoTotal: number;
    pagado: boolean;
    descripcion: string;
    cuf: string | undefined;
    numeroFactura: number | undefined;
    urlPdf: string | undefined;
    urlXml: string | undefined;
    observacion: string | undefined;
    estado: string;
    usuarioEmision: string;
    usuarioAnulacion: string | undefined;
    errorEnvio: string | undefined;
    cliente: ClienteFactura;
    facturaDetalles: FacturaDetalle[];
    montoDescuentoAdicional?: number;
    noVerificarNit?: boolean;
}

export interface ClienteFactura{
        tipoDocumento: string;
        nroDocumento: string;
        razonSocial: string;
        idCuenta: number;
}
export interface FacturaDetalle{
      codigo: string;
      cantidad: number;
      articulo: Articulo;
      descripcion: string;
      precioUnitario: number;
      line: number;
      codArticulo: string;
      precioDetalle: number;
      montoDescuento?: number;
}

//TODO: Simplificar crear enums para tipo y relacionar a Clasificaicon.entity
export interface Articulo{
    id: number;
    tipo: string;
    clasificacion: string;
    compra: boolean;
    venta: boolean;
    inventario: boolean;
    nombre:string;
    nombreExtendido:string;
    precioUnitario: number;
    unidadMedidaCompra: string;
    unidadMedidaVenta: string;
}