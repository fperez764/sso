//TODO! Enums deben ser sacados o de un archivo de config o de BD
export enum SeveridadTicket {
    CRITICA = "CRITICA",
    ALTA = "ALTA",
    MEDIA = "MEDIA",
    BAJA = "BAJA",
  }

  export enum Roles {
    ADMIN = "ADMIN",
    DIRECTOR = "DIRECTOR",
    JEFE = 'JEFE',
    FUNCIONARIO = 'FUNCIONARIO'
  }

export enum EstadoRespuesta {
    ACEPTADO = "ACEPTADO",
    RECHAZADO = "RECHAZADO",
    PENDIENTE = "PENDIENTE",
    RESUELTO = "RESUELTO",
  }

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
    respuestas: Respuesta[];
    porResponder: Respuesta;
    respuestasCount: string;
    userAcepto: string;
}

export interface Respuesta  extends ABEModel {
    estado: string;
    respuesta: string;
    accion: string;
    area: string;
    clienteSolicitud: ClienteSolicitud;  
    orden: number;
    fechaInicio: Date;
    fechaFin: Date;
    fechaRespuesta: Date;  
    comentarios: Comentario[];
    comentariosCount: number;
    usuarioAsignado: User;
    porResponder: boolean;
}

export interface Comentario  extends ABEModel {
    comentario: string,
    clienteSolicitudRespuesta: Respuesta, 
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
    tickets: ClienteServicioTicket[];
    periodos: ClienteServicioPeriodo[];
    modems: ClienteServicioModem[];
}
export interface ClienteServicioModem extends ABEModel{
    clienteServicio: ClienteServicio;
    mac: string;
    autoAdministrado: boolean;
    hub: string;
}

export interface ClienteServicioPeriodo extends ABEModel{
    fechaInicio: Date;
    fechaFin: Date;
    clienteServicio: ClienteServicio;
    paquetes: Paquete[];
    activo: boolean;
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
    tickets: ClienteServicioTicket[];
    tipo: string;
}

export interface ClienteServicioTicket  extends ABEModel {
    origen: string;
    descripcion: string;
    clienteServicio: ClienteServicio;
    recibido: boolean;
    grupo: TicketGrupo;
    //Campos virtuales
    url: string;
    respuestas: Respuesta[];
    porResponder: Respuesta;
    comentarios: Comentario[];
    comentariosCount: number;
    respuestasCount: string;
    userRespondio: string;
    modems: string[];
    severidad: string;
    direccion: string;
    telefonoContacto: string;
    nombreContacto: string;
}

export interface Respuesta extends ABEModel {
    estado: string;
    respuesta: string;
    accion: string;
    area: string;
    clienteSolicitud: ClienteSolicitud;  
    orden: number;
    fechaInicio: Date;
    fechaFin: Date;
    fechaRespuesta: Date;  
    comentarios: Comentario[];
    comentariosCount: number;
}

export const getColorSeveridad = (severidad: string) => {
    return severidad ===
    SeveridadTicket.CRITICA ? 'red-500' : severidad ===
    SeveridadTicket.ALTA ? 'red-300' : severidad ===
    SeveridadTicket.MEDIA ? 'orange-300' :
    'yellow-300';
}

export interface Comentario  extends ABEModel {
    comentario: string,
    respuesta: Respuesta, 
}
