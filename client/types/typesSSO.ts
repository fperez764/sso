//TODO! Enums deben ser sacados o de un archivo de config o de BD
export enum SeveridadTicket {
    CRITICA = "CRITICA",
    ALTA = "ALTA",
    MEDIA = "MEDIA",
    BAJA = "BAJA",
  }

export enum OrigenTicket {
    LINEA_GRATUITA = "LINEA GRATUITA",
    WHATSAPP = "WHATSAPP",
    CORREO = "CORREO",
    OTRO = "OTRO"
}

export const DateFormat = 'DD/MM/YY';

  export enum Roles {
    ADMIN = "ADMIN",
    DIRECTOR = "DIRECTOR",
    RESPONSABLE = 'RESPONSABLE',
    FUNCIONARIO = 'FUNCIONARIO'
  }

export enum EstadoRespuesta {
    ACEPTADO = "ACEPTADO",
    RECHAZADO = "RECHAZADO",
    PENDIENTE = "PENDIENTE",
    RESUELTO = "RESUELTO",
    VENCIDO = "VENCIDO"
  }

export interface ABEModel{
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
    tickets: ClienteServicioTicket[];
    respuestasAsignadas: Respuesta[];
};

export enum Persona {NATURAL= "NATURAL", EMPRESARIAL="EMPRESARIAL"}
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
    persona: Persona;
}

export interface ClienteRSS {
    id: number;
    fecha_alta: Date;
    fecha_baja: Date;
    fecha_ultima_modificacion: Date;
    nombre: string;
    ci: string;
    direccion: string;
    fono_fijo: string;
    email: string;
    nit: string;
    tipo_documento: string;
    razon_social: string;
    solicitudes: ClienteSolicitud[];
    clienteServicios: ClienteServicio[];
    persona: Persona;
}

export interface ClienteServicio extends ABEModel {
    activo: boolean;
    servicio: Servicio;
    cliente: Cliente;
    tickets: ClienteServicioTicket[];
    periodos: ClienteServicioPeriodo[];
    modems: ClienteServicioModem[];
    instalador: string;
    contrato: boolean;
}
export interface ClienteServicioModem extends ABEModel{
    clienteServicio: ClienteServicio;
    mac: string;
    autoAdministrado: boolean;
    hub: string;
    nombre: string;
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

export interface GrupoFlujos extends ABEModel {
    nombre: string;
    descripcion: string;
    tipo: string;
    imageUrn: string;
    bannerUrn: string;
    respuestas: FlujoRespuesta[];
    imageUrl: string;
    servicio?: Servicio;
}
export interface SolicitudGrupo extends GrupoFlujos {
    solicitudesS: ClienteSolicitud[];
}

export interface TicketGrupo extends GrupoFlujos {
    tickets: ClienteServicioTicket[];
}

export interface ClienteServicioTicket  extends ABEModel {
    clienteServicio: ClienteServicio;
    tipo: string;
    modems: ClienteServicioModem[];
    severidad: string;
    //Info de contacto
    direccion: string;
    telefonoContacto: string;
    nombreContacto: string;
    //Comun por flujos
    origen: string;
    descripcion: string;
    recibido: boolean;
    grupo: TicketGrupo;
    respuestas: Respuesta[];
    porResponder: Respuesta;
    respuestasCount: string;
    comentarios: Comentario[];
    comentariosCount: number;
    //Campos virtuales
    url: string;
}
export interface ClienteSolicitud  extends ABEModel {
    cliente: Cliente;
    servicio: Servicio;
    prepagado: boolean;
    //Comun por flujos
    origen: string;
    descripcion: string;
    recibido: boolean;
    grupo: SolicitudGrupo;
    respuestas: Respuesta[];
    porResponder: Respuesta;
    respuestasCount: string;
    //Campos virtuales
    url: string;
}

export interface FlujoRespuesta extends ABEModel{
    orden: number;
    area: string;
    accion: string;
    vigenciaDias: number;
    grupo?: TicketGrupo|SolicitudGrupo;
}

export interface Respuesta  extends ABEModel {
    orden: number;
    area: string;
    accion: string;
    leido?: boolean;
    estado: string;
    respuesta?: string;
    clienteSolicitud?: ClienteSolicitud;
    ticket?: ClienteServicioTicket;  
    fechaInicio?: Date;
    fechaFin?: Date;
    fechaRespuesta?: Date;  
    comentarios?: Comentario[];
    comentariosCount?: number;
    usuarioAsignado?: User;
    porResponder?: boolean;
    vigenciaDias?: number;
}

export interface Comentario  extends ABEModel {
    comentario: string,
    leido: boolean,
    imagen: string,
    clienteSolicitudRespuesta?: Respuesta, 
    clienteServicioTicketRespuesta?: Respuesta, 
}

export const getColorSeveridad = (ticket: ClienteServicioTicket) => {
    return !ticket.porResponder ? 'green-400' : ticket.severidad ===
    SeveridadTicket.CRITICA ? 'red-500' : ticket.severidad ===
    SeveridadTicket.ALTA ? 'red-300' : ticket.severidad ===
    SeveridadTicket.MEDIA ? 'orange-300' :
    'yellow-300';
}
