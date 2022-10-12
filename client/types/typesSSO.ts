interface ABEModel{
    id: number;
    fechaCreacion: Date|string;
    usuarioCreacion: User;
    fechaModificacion?: Date; //La baja quedara registrada con la ultima modificacion
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
}

export interface SolicitudRespuesta  extends ABEModel {
    estado: string;
    respuesta: string;
    accion: string;
    area: string;
    solicitudServicio?: SolicitudServicio;  
}

export interface SolicitudComentarios  extends ABEModel {
    comentario: string,
    solicitudServicio: number, 
}

export interface Cliente  extends ABEModel {
    nombreCompleto: string,
    nroDocumento: string,
    tipoDocumento: string,
    direccion: string,
    telefono: string,
    email: string,
    nit: string,
    razonSocial: string,
    tipoCliente: string
}
export interface Servicio  extends ABEModel {
    categoria: string,
    descripcion: string,
    activo: boolean
}

export interface SolicitudGrupo  extends ABEModel {
    name: string;
    title: string;
    description: string;
    imageUrn: string;
    bannerUrn: string;
    solicitudesS: SolicitudServicio[];
}