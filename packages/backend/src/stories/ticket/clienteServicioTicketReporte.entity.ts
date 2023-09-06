import {
  Cliente,
  ClienteContacto,
  ClienteServicio,
  ClienteServicioModem,
  ClienteServicioTicket,
  ClienteServicioTicketAccion,
  FlujoTicket,
  accion_estado_enum,
  cliente_servicio_ticket_severidad_enum,
} from '@prisma/client';
import { Expose, Exclude } from 'class-transformer';
import ClienteServicioModemEntity from '../cliente/clienteServicioModem.entity';
import dayjs from 'dayjs';

export default class ClienteServicioTicketReporteEntity {
  constructor(
    ticket: Partial<ClienteServicioTicket>,
    clienteServicio?: ClienteServicio,
    cliente?: Cliente,
    contacto?: Partial<ClienteContacto>,
    flujo?: FlujoTicket,
  ) {
    if (contacto) {
      delete contacto.fechaCreacion;
      delete contacto.usuarioCreacion;
      delete contacto.fechaBaja;
      delete contacto.usuarioBaja;
      delete contacto.id;
      delete contacto.fechaModificacion;
      delete contacto.idCliente;
      Object.keys(contacto).map((k) => {
        contacto[k + 'ClienteContacto'] = contacto[k];
        delete contacto[k];
      });
    }
    Object.assign(this, ticket, contacto);
    if (clienteServicio) this.clienteServicio = clienteServicio;
    if (cliente) this.cliente = cliente;
    if (flujo) this.flujo = flujo;
    if ('modems' in ticket) {
      const modems = ticket.modems as ClienteServicioModem[];
      this.modems = modems.map((modem) => new ClienteServicioModemEntity(modem));
    }
  }

  id: number;
  @Exclude()
  fechaCreacion: Date;
  @Expose() get fechaDeCreacion(): String {
    return this.fechaCreacion.toLocaleString('es-ES');
  }
  usuarioCreacion: string;
  @Exclude()
  fechaBaja: Date | null;
  @Expose() get fechaDeBaja(): String {
    return this.fechaBaja?.toLocaleString('es-ES') || '';
  }
  usuarioBaja: string | null;
  @Exclude()
  fechaModificacion: Date;
  @Expose() get fechaModif(): String {
    return this.fechaModificacion?.toLocaleString('es-ES') || '';
  }
  origen: string;
  reclamo: boolean;
  resuelto: boolean;
  descripcion: string;
  severidad: cliente_servicio_ticket_severidad_enum;
  @Exclude()
  coordenadas: string | null;
  idClienteServicio: number;
  @Exclude()
  modems: ClienteServicioModem[];
  @Exclude()
  acciones: ClienteServicioTicketAccion[];
  //ClienteServicio
  @Exclude()
  clienteServicio: ClienteServicio;
  @Expose() get nombreServicio(): string {
    return this.clienteServicio?.nombreServicio || '';
  }
  //Cliente
  telefonoContacto: string | null;
  nombreContacto: string | null;
  direccion: string | null;
  @Exclude()
  cliente: Cliente;
  @Expose()
  get razonSocialCliente(): string {
    return this.cliente?.razonSocial || '';
  }
  @Expose()
  get nroDocFacturacionCliente(): string {
    return this.cliente?.nroDocumentoFacturacion || '';
  }
  //Flujo
  nombreFlujo: string | null;
  @Exclude()
  flujo: FlujoTicket;
  @Expose() get tipoFlujo(): string {
    return this.flujo?.tipo || '';
  }
  @Exclude() get porResponder(): ClienteServicioTicketAccion {
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
    return this.porResponder ? `${this.porResponder.area}` : 'Sin acción en estado pendiente';
  }
  @Expose() get infoPorResponder(): string {
    return this.porResponder
      ? `ID:${this.porResponder.id}/${this.porResponder.accion}/${
          this.porResponder.usuarioAsignado || 'No Asignado'
        }`
      : 'Sin acción en estado pendiente';
  }

  @Expose() get latitud(): String {
    return this.coordenadas?.split(',')[0] || '';
  }
  @Expose() get longitud(): String {
    return this.coordenadas?.split(',')[1] || '';
  }
}
