// swagger config
export const SWAGGER_API_ROOT = 'api/docs';
export const SWAGGER_API_TITLE = 'SSO: Sistema de Soporte a las Operaciones';
export const SWAGGER_API_DESCRIPTION =
  'Manejo de clientes-servicios-equipos tickets/solicitudes por flujos de acciones ';
export const SWAGGER_API_CURRENT_VERSION = '0.1';

export enum Status {
  CREADO = 'CREADO',
  ACTIVE = 'ACTIVO',
  INACTIVE = 'INACTIVO',
  PENDING = 'PENDIENTE',
  SUSPENDING = 'SUSPENDIDO',
  EN_PROCESO = 'EN_PROCESO',
  FINALIZADO = 'FINALIZADO',
  ANULADO = 'ANULADO',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum TipoDocumento {
  CI = 'CI',
  PASAPORTE = 'PASAPORTE',
  OTRO = 'OTRO',
}

export enum Genero {
  MASCULINO = 'M',
  FEMENINO = 'F',
  OTRO = 'OTRO',
}

export enum Transacccion {
  CREAR = 'CREAR',
  ACTUALIZAR = 'ACTUALIZAR',
  COMENTAR = 'COMENTAR',
  ASIGNAR = 'ASIGNAR',
  DERIVAR = 'DERIVAR',
  DEVOLER = 'DEVOLER',
  ATENDER = 'ATENDER',
  FINALIZAR = 'FINALIZAR',
  ANULAR = 'ANULAR',
}

export const USUARIO_SISTEMA = '1';
export const USUARIO_NORMAL = '0';
