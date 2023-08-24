import { FlujoTicketAcciones } from '@prisma/client';

export default class FlujoTicketAccionEntity {
  constructor(accion: Partial<FlujoTicketAcciones>) {
    Object.assign(this, accion);
  }
  id: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaBaja: Date | null;
  usuarioCreacion: string;
  usuarioBaja: string | null;
  orden: number;
  area: string;
  accion: string;
  vigenciaDias: number;
  nombreFlujo: string;
}
