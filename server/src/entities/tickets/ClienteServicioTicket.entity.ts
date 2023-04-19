import { Expose } from "class-transformer";
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import GrupoTicket from "./GrupoTicket.entity";
import { Geometry, Point } from 'geojson';

import ClienteServicioTicketRespuesta, {
  Estado,
} from "./ClienteServicioTicketRespuesta.entity";
import ClienteServicio from "../cliente/ClienteServicio.entity";
import ClienteServicioModem from "../cliente/ClienteServicioModem.entity";

export enum Severidad {
  CRITICA = "CRITICA",
  ALTA = "ALTA",
  MEDIA = "MEDIA",
  BAJA = "BAJA",
}

@Entity("cliente_servicio_ticket")
export default class ClienteServicioTicket extends ABEModel {
  constructor(ticket: Partial<ClienteServicioTicket>) {
    super();
    Object.assign(this, ticket);
  }

  @Column() //TODO:Enum
  origen: string;

  @Column()
  descripcion: string;

  @Column({
    type: "enum",
    enum: Severidad,
    default: Severidad.BAJA,
  })
  severidad: Severidad;

  @Column({ nullable: true })
  telefonoContacto: string;

  @Column({ nullable: true })
  nombreContacto: string;

  @Column({ nullable: true })
  direccion: string;

//  @Index({ spatial: true })
  @Column({
    nullable: true,
  })
  location:string;

  @ManyToMany(() => ClienteServicioModem)
  @JoinTable()
  modems: ClienteServicioModem;

  @ManyToOne(
    () => ClienteServicio,
    (clienteServicio) => clienteServicio.tickets,
    { nullable: false }
  )
  @JoinColumn({ name: "servicio", referencedColumnName: "id" })
  clienteServicio: ClienteServicio;

  @Expose() get url(): string {
    return `/ticket/${this.grupo?.nombre || "?"}/${
      this.clienteServicio?.id || "?"
    }/${this.id}`;
  }

  @ManyToOne(() => GrupoTicket, (grupo) => grupo.tickets, { nullable: false })
  @JoinColumn({ name: "grupo", referencedColumnName: "nombre" })
  grupo: GrupoTicket;

  @OneToMany(
    () => ClienteServicioTicketRespuesta,
    (respuesta) => respuesta.ticket, {eager: true}
  )
  respuestas: ClienteServicioTicketRespuesta[];

  @Expose() get respuestasCount(): string {
    if (!this.respuestas || this.respuestas.length === 0) return "0/0";
    const respondidas = this.respuestas?.filter(
      (r) => r.estado === Estado.ACEPTADO
    );
    return `${respondidas.length}/${this.respuestas.length}`;
  }

  @Expose() get porResponder(): ClienteServicioTicketRespuesta {
    return this.respuestas.sort((r, s)=> r.orden - s.orden).find(r => r.estado !== Estado.ACEPTADO);
  }
}
