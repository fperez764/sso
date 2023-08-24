//GET FROM BACKEND: node_modules\.prisma\client\index.d.ts

export type ABEModel = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  usuarioCreacion: string
  usuarioBaja: string | null
}
/**
 * Model CategoriaServicio
 * 
 */
export type CategoriaServicio = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  nombre: string
  descripcion: string
  activo: boolean
  usuarioCreacion: string
  usuarioBaja: string | null
  servicios: Servicio[]
}

/**
 * Model ClienteContacto
 * 
 */
export type ClienteContacto = {
  id: number
  fechaCreacion: Date
  usuarioCreacion: string
  fechaModificacion: Date
  usuarioBaja: string | null
  fechaBaja: Date | null
  nroDocumento: string
  nombreCompleto: string
  direccion: string | null
  telefono: string | null
  email: string | null
  idCliente: number
  cliente: Cliente
}

/**
 * Model Cliente
 * 
 */
export type Cliente = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  nroDocumentoFacturacion: string
  tipoDocumentoFacturacion: cliente_tipodocumentofacturacion_enum
  razonSocial: string
  tipo: cliente_persona_enum
  usuarioCreacion: string
  usuarioBaja: string | null
  clienteServicios: ClienteServicio[]
  solicitudes: ClienteSolicitud[]
  contactos: ClienteContacto[]

}

/**
 * Model ClienteServicio
 * 
 */
export type ClienteServicio = {
  id: number
  fechaCreacion: Date
  usuarioCreacion: string
  fechaModificacion: Date
  fechaBaja: Date | null
  usuarioBaja: string | null
  activo: boolean
  contrato: boolean
  instalador: string
  nombreServicio: string
  idCliente: number
  servicio:          Servicio
  cliente:           Cliente
  equipos:           ClienteServicioEquipo[]
  modems:            ClienteServicioModem[]
  periodos:          ClienteServicioPeriodo[]
  tickets:           ClienteServicioTicket[]
  eventos:           ClienteServicioEvento[]

}

/**
 * Model ClienteServicioEvento
 * 
 */
export type ClienteServicioEvento = {
  id: number
  fechaCreacion: Date
  usuarioCreacion: string
  fechaModificacion: Date
  fechaBaja: Date | null
  usuarioBaja: string | null
  evento: cliente_servicio_evento_enum
  comentario: string | null
  idClienteServicio: number
  clienteServicio:   ClienteServicio
}

/**
 * Model ClienteServicioEquipo
 * 
 */
export type ClienteServicioEquipo = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  equipoSerial: string
  usuarioCreacion: string
  usuarioBaja: string | null
  idClienteServicio: number
  clienteServicio:   ClienteServicio
}

/**
 * Model ClienteServicioModem
 * 
 */
export type ClienteServicioModem = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  mac: string
  autoAdministrado: boolean
  coordenadas: string | null
  usuarioCreacion: string
  usuarioBaja: string | null
  idClienteServicio: number
  idClienteSolicitudAccion: number | null
  clienteSolicitudAccion:   ClienteSolicitudAccion | null
  clienteServicio:          ClienteServicio        
  hub: string;
}

/**
 * Model ClienteServicioModemPaquete
 * 
 */
export type ClienteServicioModemPaquete = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  inicioVigencia: Date
  finVigencia: Date
  macModem: string
  consumo: number
  consumido: boolean
  tipo: cliente_servicio_modem_paquete_tipo_enum
  facturaReferencia: string
  usuarioCreacion: string
  usuarioBaja: string | null
  nombreServicioPaquete: string
  idClienteServicioPeriodo: number
  clienteServicioPeriodo:   ClienteServicioPeriodo      
  servicioPaquete:          ServicioPaquete  
}

/**
 * Model ClienteServicioPeriodo
 * 
 */
export type ClienteServicioPeriodo = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  fechaInicio: Date
  fechaFin: Date
  usuarioCreacion: string
  usuarioBaja: string | null
  idClienteServicio: number
  paquetes:          ClienteServicioModemPaquete[]
  clienteServicio:   ClienteServicio

}

/**
 * Model ClienteServicioTicket
 * 
 */
export type ClienteServicioTicket = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  origen: string
  reclamo: boolean
  resuelto: boolean
  descripcion: string
  severidad: cliente_servicio_ticket_severidad_enum
  telefonoContacto: string | null
  nombreContacto: string | null
  direccion: string | null
  coordenadas: string | null
  usuarioCreacion: string
  usuarioBaja: string | null
  idClienteServicio: number
  nombreFlujo: string | null
  clienteServicio:             ClienteServicio                      
  flujoTicket:                 FlujoTicket|null
  clienteServicioTicketModems: ClienteServicioTicketModem[]
  acciones:                    ClienteServicioTicketAccion[]
  tipoTicket: string
  respuestasCount: string
  porResponder: ClienteServicioTicketAccion
  areaPorResponder: string

}

/**
 * Model ClienteServicioTicketModem
 * 
 */
export type ClienteServicioTicketModem = {
  idTicket: number
  macClienteServicioModem: string
  clienteServicioTicket:   ClienteServicioTicket
}

/**
 * Model ClienteSolicitud
 * 
 */
export type ClienteSolicitud = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  origen: string
  prepagado: boolean
  descripcion: string
  recibido: boolean
  usuarioCreacion: string
  usuarioBaja: string | null
  idCliente: number
  nombreServicio: string
  nombreFlujo: string
  flujo_solicitud:   FlujoSolicitud
  acciones:          ClienteSolicitudAccion[]
  servicio:          Servicio | null 
  cliente :          Cliente   
  porResponder: ClienteSolicitudAccion
  areaPorResponder: string
}

/**
 * Model Instalador
 * 
 */
export type Instalador = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  nroDocumento: string | null
  nombreCompleto: string
  direccion: string | null
  telefono: string | null
  email: string | null
  nroDocumentoFacturacion: string
  tipoDocumentoFacturacion: instalador_tipodocumentofacturacion_enum
  razonSocial: string
  zona: string
  usuarioCreacion: string
  usuarioBaja: string | null
}

/**
 * Model Servicio
 * 
 */
export type Servicio = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  nombre: string
  descripcion: string
  activo: boolean
  usuarioCreacion: string
  usuarioBaja: string | null
  categoria: string
  clienteServicios:  ClienteServicio[]
  categoriaServicio: CategoriaServicio
  paquetes:          ServicioPaquete[]
  solicitudes:       ClienteSolicitud[]
  flujosSolicitud:   FlujoSolicitud[]
  flujosTicket:      FlujoTicket[]
}

/**
 * Model ServicioPaquete
 * 
 */
export type ServicioPaquete = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  nombre: string
  descripcion: string
  precio: number
  renovacion: boolean
  vigenciaDias: number | null
  mbRegular: number
  mbBono: number
  mbRecargo: number
  perfilReducido: number
  perfilRegular: number
  usuarioCreacion: string
  usuarioBaja: string | null
  nombreServicio: string
  paquetes:          ClienteServicioModemPaquete[]
  servicio:          Servicio | null
}

/**
 * Model Users
 * 
 */
export type Users = {
  id: number
  fechaCreacion: Date
  usuarioCreacion: string | null
  username: string
  email: string
  activo: boolean
  area: users_area_enum
  departamento: users_dep_enum
  rol: users_rol_enum
}

/**
 * Model ClienteServicioTicketAccion
 * 
 */
export type ClienteServicioTicketAccion = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  orden: number
  area: string
  estado: accion_estado_enum
  fechaInicio: Date | null
  fechaFin: Date | null
  vigenciaDias: number
  fechaRespuesta: Date | null
  respuesta: string | null
  accion: string
  leido: boolean
  usuarioCreacion: string
  usuarioBaja: string | null
  idTicket: number
  usuarioAsignado: string | null
  clienteServicioTicket: ClienteServicioTicket
  comentarios:           ClienteServicioTicketAccionComentario[]
}

/**
 * Model ClienteServicioTicketAccionComentario
 * 
 */
export type ClienteServicioTicketAccionComentario = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  comentario: string
  imagen: string | null
  usuarioCreacion: string
  usuarioArea: string
  usuarioBaja: string | null
  idTicketAccion: number
  clienteServicioTicketAccion: ClienteServicioTicketAccion
}

/**
 * Model ClienteSolicitudAccion
 * 
 */
export type ClienteSolicitudAccion = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  orden: number
  area: string
  estado: cliente_solicitud_accion_estado_enum
  fechaInicio: Date | null
  fechaFin: Date | null
  vigenciaDias: number
  fechaRespuesta: Date | null
  respuesta: string | null
  accion: string
  leido: boolean
  usuarioCreacion: string
  usuarioBaja: string | null
  usuarioAsignado: string | null
  idClienteSolicitud: number
  modems:             ClienteServicioModem[]
  clienteSolicitud:   ClienteSolicitud                  
  comentarios:        ClienteSolicitudAccionComentario[]
}

/**
 * Model ClienteSolicitudAccionComentario
 * 
 */
export type ClienteSolicitudAccionComentario = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  comentario: string
  leido: boolean
  usuarioCreacion: string
  usuarioBaja: string | null
  idClienteSolicitudAccion: number
  clienteSolicitudAccion:   ClienteSolicitudAccion
}

/**
 * Model FlujoSolicitud
 * 
 */
export type FlujoSolicitud = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  nombre: string
  descripcion: string | null
  tipo: flujo_solicitud_tipo_enum
  usuarioCreacion: string
  usuarioBaja: string | null
  nombreServicio: string | null
  solicitudes:            ClienteSolicitud[]
  servicio:               Servicio | null
  flujoSolicitudAcciones: FlujoSolicitudAcciones[]
}

/**
 * Model FlujoSolicitudAcciones
 * 
 */
export type FlujoSolicitudAcciones = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  orden: number
  area: string
  accion: string
  vigenciaDias: number
  usuarioCreacion: string
  usuarioBaja: string | null
  nombreFlujo: string
  flujoSolicitud:    FlujoSolicitud 
}

/**
 * Model FlujoTicket
 * 
 */
export type FlujoTicket = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  nombre: string
  descripcion: string | null
  tipo: flujo_ticket_tipo_enum
  usuarioCreacion: string
  usuarioBaja: string | null
  nombreServicio: string | null
  tickets:             ClienteServicioTicket[]
  servicio:            Servicio | null
  flujoTicketAcciones: FlujoTicketAcciones[]
}

/**
 * Model FlujoTicketAcciones
 * 
 */
export type FlujoTicketAcciones = {
  id: number
  fechaCreacion: Date
  fechaModificacion: Date
  fechaBaja: Date | null
  orden: number
  area: string
  accion: string
  vigenciaDias: number
  usuarioCreacion: string
  usuarioBaja: string | null
  nombreFlujo: string
  flujoTicket:       FlujoTicket
}


/**
 * Enums
 */

export const accion_estado_enum= {
  ACEPTADO: 'ACEPTADO',
  RECHAZADO: 'RECHAZADO',
  PENDIENTE: 'PENDIENTE',
  VENCIDO: 'VENCIDO'
};

export type accion_estado_enum = (typeof accion_estado_enum)[keyof typeof accion_estado_enum]


export const cliente_persona_enum= {
  NATURAL: 'NATURAL',
  EMPRESARIAL: 'EMPRESARIAL'
};

export type cliente_persona_enum = (typeof cliente_persona_enum)[keyof typeof cliente_persona_enum]


export const cliente_servicio_evento_enum= {
  ACTIVACION: 'ACTIVACION',
  SUSPENSION: 'SUSPENSION',
  REACTIVACION: 'REACTIVACION',
  BAJA: 'BAJA'
};

export type cliente_servicio_evento_enum = (typeof cliente_servicio_evento_enum)[keyof typeof cliente_servicio_evento_enum]


export const cliente_servicio_modem_paquete_tipo_enum= {
  REGULAR: 'REGULAR',
  BONO: 'BONO',
  REDUCIDO: 'REDUCIDO',
  ILIMITADO: 'ILIMITADO'
};

export type cliente_servicio_modem_paquete_tipo_enum = (typeof cliente_servicio_modem_paquete_tipo_enum)[keyof typeof cliente_servicio_modem_paquete_tipo_enum]


export const cliente_servicio_ticket_severidad_enum= {
  CRITICA: 'CRITICA',
  ALTA: 'ALTA',
  MEDIA: 'MEDIA',
  BAJA: 'BAJA'
};

export type cliente_servicio_ticket_severidad_enum = (typeof cliente_servicio_ticket_severidad_enum)[keyof typeof cliente_servicio_ticket_severidad_enum]


export const cliente_solicitud_accion_estado_enum= {
  ACEPTADO: 'ACEPTADO',
  RECHAZADO: 'RECHAZADO',
  PENDIENTE: 'PENDIENTE'
};

export type cliente_solicitud_accion_estado_enum = (typeof cliente_solicitud_accion_estado_enum)[keyof typeof cliente_solicitud_accion_estado_enum]


export const cliente_tipodocumentofacturacion_enum= {
  CI: 'CI',
  NIT: 'NIT',
  CEX: 'CEX',
  OTRO: 'OTRO'
};

export type cliente_tipodocumentofacturacion_enum = (typeof cliente_tipodocumentofacturacion_enum)[keyof typeof cliente_tipodocumentofacturacion_enum]


export const flujo_solicitud_tipo_enum= {
  FACTIBILIDAD: 'FACTIBILIDAD',
  ALTA: 'ALTA',
  BAJA: 'BAJA',
  CORTE_TEMPORAL: 'CORTE_TEMPORAL',
  CORTE_MANTENIMIENTO: 'CORTE_MANTENIMIENTO',
  REHABILITACION: 'REHABILITACION',
  MODIFICACION: 'MODIFICACION',
  ALTA_EVENTUAL: 'ALTA_EVENTUAL',
  ENTREGA_EQUIPOS: 'ENTREGA_EQUIPOS',
  RETIRO_EQUIPOS: 'RETIRO_EQUIPOS',
  PROVISIONAMIENTO: 'PROVISIONAMIENTO',
  PRUEBAS: 'PRUEBAS',
  OTRO: 'OTRO'
};

export type flujo_solicitud_tipo_enum = (typeof flujo_solicitud_tipo_enum)[keyof typeof flujo_solicitud_tipo_enum]


export const flujo_ticket_tipo_enum= {
  CAMBIO_DE_PLAN: 'CAMBIO_DE_PLAN',
  MODIFICACION_SERVICIO: 'MODIFICACION_SERVICIO',
  BAJA_DE_SERVICIO: 'BAJA_DE_SERVICIO',
  DEGRADACION_SERVICIO: 'DEGRADACION_SERVICIO',
  CORTE_SERVICIO: 'CORTE_SERVICIO',
  SOPORTE_TECNICO: 'SOPORTE_TECNICO',
  MANTENIMIENTO_CORRECTIVO: 'MANTENIMIENTO_CORRECTIVO',
  MANTENIMIENTO: 'MANTENIMIENTO',
  OTRO: 'OTRO'
};

export type flujo_ticket_tipo_enum = (typeof flujo_ticket_tipo_enum)[keyof typeof flujo_ticket_tipo_enum]


export const instalador_tipodocumentofacturacion_enum= {
  CI: 'CI',
  NIT: 'NIT',
  CEX: 'CEX',
  OTRO: 'OTRO'
};

export type instalador_tipodocumentofacturacion_enum = (typeof instalador_tipodocumentofacturacion_enum)[keyof typeof instalador_tipodocumentofacturacion_enum]


export const users_area_enum= {
  NOC: 'NOC',
  ALMACENES: 'ALMACENES',
  UTI: 'UTI',
  PROYECTOS: 'PROYECTOS',
  EMPRESARIAL: 'EMPRESARIAL',
  ATENCION_CLIENTE: 'ATENCION_CLIENTE',
  SERVICIOS_BASICOS: 'SERVICIOS_BASICOS',
  INSTALACIONES: 'INSTALACIONES',
  FACTURACION: 'FACTURACION',
  AUXILIAR: 'AUXILIAR'
};

export type users_area_enum = (typeof users_area_enum)[keyof typeof users_area_enum]


export const users_dep_enum= {
  DGE: 'DGE',
  DAF: 'DAF',
  COMERCIAL: 'COMERCIAL',
  INGENIERIA: 'INGENIERIA',
  OPERACIONES: 'OPERACIONES'
};

export type users_dep_enum = (typeof users_dep_enum)[keyof typeof users_dep_enum]


export const users_rol_enum= {
  ADMIN: 'ADMIN',
  DIRECTOR: 'DIRECTOR',
  RESPONSABLE: 'RESPONSABLE',
  ENCARGADO: 'ENCARGADO',
  FUNCIONARIO: 'FUNCIONARIO'
};

export type users_rol_enum = (typeof users_rol_enum)[keyof typeof users_rol_enum]
