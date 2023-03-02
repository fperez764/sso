interface ABEModel{
    id: number;
    fechaCreacion: Date|string;
    usuarioCreacion: User;
    fechaModificacion: Date; //La baja quedara registrada con la ultima modificacion
    usuarioBaja?: string;
}

export interface User {
    id: number;
    fechaCreacion: Date;
    usuarioCreacion: string;
    username: string;
    email: string;
    activo: boolean;
    password: string;
    area: string;
    rol: string;
};

export enum Areas {
    INSTALACIONES = "INSTALACIONES",
    COMERCIAL = "COMERCIAL",
    ALMACENES = "ALMACENES",
    OPERACIONES = "OPERACIONES",
    UTI = "UTI",
    INGENIERIA = "INGENIERIA",
    FACTURACION = "FACTURACION",
    DGE = "DGE",
    AUXILIAR = "AUXILIAR",
  }

export interface ClienteSolicitud  extends ABEModel {
    cliente: Cliente;
    tipo: string;
    servicio: Servicio;
    origen: string;
    prepagado: boolean;
    descripcion: string;
    recibido: boolean;
    grupo: SolicitudGrupo;
    //Campos virtuales
    url: string;
    respuestas: SolicitudRespuesta[];
    comentarios: SolicitudRespuestaComentario[];
    comentariosCount: number;
    respuestasCount: string;
    userAcepto: string;
}

export interface SolicitudRespuesta  extends ABEModel {
    estado: string;
    respuesta: string;
    accion: string;
    area: string;
    clienteSolicitud: ClienteSolicitud;  
    orden: number;
    fechaInicio: Date;
    fechaFin: Date;
    fechaRespuesta: Date;  
}

export interface SolicitudRespuestaComentario  extends ABEModel {
    comentario: string,
    clienteSolicitudRespuesta: SolicitudRespuesta, 
}

export interface Cliente  extends ABEModel {
    nombreCompleto: string,
    nroDocumento: string,
    direccion: string,
    telefono: string,
    email: string,
    nroDocumentoFacturacion: string,
    tipoDocumentoFacturacion: string,
    razonSocial: string
    solicitudes: ClienteSolicitud[];
    clienteServicios: ClienteServicio[];
}

export interface ClienteServicio extends ABEModel {
    activo: boolean;
    servicio: Servicio;
    cliente: Cliente;
    tickets: ServicioTicket[];
    periodos: ClienteServicioPeriodo[];
}

export interface ClienteServicioPeriodo extends ABEModel{
    fechaInicio: Date;
    fechaFin: Date;
    clienteServicio: ClienteServicio;
    paquetes: Paquete[];
}

export interface Servicio  extends ABEModel {
    nombre: string;
    descripcion: string,
    activo: boolean,
    categoria: Categoria,
    nombreCategoria?: string,
    servicioPaquetes: Paquete[];
}

export interface Paquete extends ABEModel{
    nombre: string;
    descripcion: string;
    mbRegular: number;
    mbBono: number;
    precio: number;
    mbRecargo: number;
    perfilReducido: number;
    perfilRegular: number;
    servicio: Servicio;
}

export interface Categoria extends ABEModel{
    nombre: string;
    descripcion: string;
    activo: boolean;
}

export interface SolicitudGrupo extends ABEModel {
    nombre: string;
    descripcion: string;
    tipo: string;
    imageUrn: string;
    bannerUrn: string;
    solicitudesS: ClienteSolicitud[];
}

export interface TicketGrupo extends ABEModel {
    nombre: string;
    descripcion: string;
    tipoTicket: string;
    imageUrn: string;
    bannerUrn: string;
    tickets: ServicioTicket[];
    tipo: string;
}
export interface ServicioTicket  extends ABEModel {
    origen: string;
    descripcion: string;
    clienteServicio: ClienteServicio;
    recibido: boolean;
    grupo: TicketGrupo;
    tipo: string;
    //Campos virtuales
    url: string;
    respuestas: SolicitudRespuesta[];
    comentarios: SolicitudRespuestaComentario[];
    comentariosCount: number;
    respuestasCount: string;
    userAcepto: string;
}

export interface SolicitudRespuesta  extends ABEModel {
    estado: string;
    respuesta: string;
    accion: string;
    area: string;
    clienteSolicitud: ClienteSolicitud;  
    orden: number;
    fechaInicio: Date;
    fechaFin: Date;
    fechaRespuesta: Date;  
}

export interface SolicitudRespuestaComentario  extends ABEModel {
    comentario: string,
    clienteSolicitudRespuesta: SolicitudRespuesta, 
}