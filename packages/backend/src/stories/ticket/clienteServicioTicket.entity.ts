import {
  Cliente,
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
}
