import { SVGProps } from 'react';

export interface User {
    id: number;
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    fechaCreacion: Date;
    fechaModificacion: Date; //La baja quedara registrada con la ultima modificacion
    usuarioBaja: string;
    username: string;
    email: string;
    area: string;
    rol: string;
};

export interface SolicitudServicio {
    id: number;
    fechaCreacion: Date;
    usuarioCreacion: string;
    fechaModificacion: Date; //La baja quedara registrada con la ultima modificacion
    usuarioBaja: string;
    cliente: Cliente;
    tipo: string;
    servicio: Servicio;
    origen: string;
    prepagado: boolean;
    descripcion: string;
    recibido: boolean;
    user: User;
    grupo: SolicitudGrupo;
    //Campos virtuales
    url: string;
}

export interface SolicitudRespuesta {
    area: string;
    aceptado: boolean;
    respuesta: string;
    solicitudServicio: SolicitudServicio;  
    user: User
}

export interface SolicitudComentarios {
    id: number
    comentario: string,
    solicitudServicio: number, 
    usuarioCreacion: string,
}

export interface Cliente {
    id: number,
    fechaCreacion: Date,
    usuarioCreacion: string,
    fechaBaja: Date,
    usuarioBaja: string,
    nombres: string,
    apellidos: string,
    nroDocumento: string,
    tipoDocumento: string,
    direccion: string,
    telefono: string,
    email: string,
    nit: string,
    razonSocial: string,
    tipoCliente: string
}
export interface Servicio {
    id: number,
    fechaCreacion: Date,
    usuarioCreacion: string,
    fechaBaja: Date,
    usuarioBaja: string,
    categoria: string,
    descripcion: string,
    activo: boolean
}

export interface SolicitudGrupo {
    id: number,
    fechaCreacion: Date,
    usuarioCreacion: string,
    fechaBaja: Date,
    usuarioBaja: string,
    name: string;
    title: string;
    description: string;
    imageUrn: string;
    bannerUrn: string;
    solicitudesS: SolicitudServicio[];
    user: User;
}