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

export interface SolicitudServicio  extends ABEModel {
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
    comentarios: SolicitudComentario[];
    comentariosCount: number;
    respuestasCount: string;
    userAceptop: string;
}

export interface SolicitudRespuesta  extends ABEModel {
    estado: string;
    respuesta: string;
    accion: string;
    area: string;
    solicitudServicio?: SolicitudServicio;  
    orden: number;
    fechaInicio: Date;
    fechaFin: Date;
    fechaRespuesta: Date;  
}

export interface SolicitudComentario  extends ABEModel {
    comentario: string,
    solicitudServicio: number, 
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

export interface SolicitudGrupo  extends ABEModel {
    name: string;
    title: string;
    description: string;
    imageUrn: string;
    bannerUrn: string;
    solicitudesS: SolicitudServicio[];
}