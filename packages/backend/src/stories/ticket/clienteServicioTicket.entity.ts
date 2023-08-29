import {
  ClienteServicio,
  ClienteServicioModem,
  ClienteServicioTicket,
  ClienteServicioTicketAccion,
  FlujoTicket,
  accion_estado_enum,
  cliente_servicio_ticket_severidad_enum,
} from '@prisma/client';
import { Expose } from 'class-transformer';
import ClienteServicioModemEntity from '../cliente/clienteServicioModem.entity';
import dayjs from 'dayjs';

export default class ClienteServicioTicketEntity {
  constructor(ticket: Partial<ClienteServicioTicket>) {
    if (!ticket) return null;
    Object.assign(this, ticket);
    if ('modems' in ticket) {
      const modems = ticket.modems as ClienteServicioModem[];
      this.modems = modems.map((modem) => new ClienteServicioModemEntity(modem));
    }
  }
  id: number;
  fechaCreacion: Date;
  @Expose() get fecha(): String {
    return this.fechaCreacion.toLocaleString('es-ES');
  }

  fechaModificacion: Date;
  @Expose() get fechaUltModif(): String {
    return this.fechaModificacion.toLocaleString('es-ES');
  }

  fechaBaja: Date | null;
  origen: string;
  reclamo: boolean;
  resuelto: boolean;
  descripcion: string;
  severidad: cliente_servicio_ticket_severidad_enum;
  telefonoContacto: string | null;
  nombreContacto: string | null;
  direccion: string | null;
  coordenadas: string | null;
  usuarioCreacion: string;
  usuarioBaja: string | null;
  idClienteServicio: number;
  nombreFlujo: string | null;
  modems: ClienteServicioModem[];
  clienteServicio: ClienteServicio;
  flujo: FlujoTicket;
  acciones: ClienteServicioTicketAccion[];
  @Expose() get porResponder(): ClienteServicioTicketAccion {
    if (!this.acciones) return null;
    const respuestaPdte = this.acciones
      .sort((r, s) => r.orden - s.orden)
      .find((accion) => !accion.fechaBaja && accion.estado !== accion_estado_enum.ACEPTADO);
    return respuestaPdte;
  }

  //Exposes for reports

  @Expose() get respuestasCount(): string {
    if (!this.acciones || this.acciones.length === 0) return '0/0 ANULADO';
    const respondidas = this.acciones?.filter((r) => r.estado === accion_estado_enum.ACEPTADO);
    return `${respondidas.length}/${this.acciones.length}${
      respondidas.length === this.acciones.length ? ' RESUELTO' : ''
    }`;
  }

  @Expose() get areaPorResponder(): string {
    return this.porResponder ? `${this.porResponder.area}` : 'NA/Sin acción en estado pendiente';
  }
  @Expose() get infoPorResponder(): string {
    return this.porResponder
      ? `ID:${this.porResponder.id}/${this.porResponder.accion}/${
          this.porResponder.usuarioAsignado || 'NoAsignado'
        }`
      : 'NA/Sin acción en estado pendiente';
  }

  @Expose() get latitud(): String {
    return this.coordenadas?.split(',')[0] || '';
  }
  @Expose() get longitud(): String {
    return this.coordenadas?.split(',')[1] || '';
  }
}
