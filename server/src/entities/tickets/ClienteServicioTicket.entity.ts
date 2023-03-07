import { Expose } from "class-transformer";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
import logger from "../../utils/logger";
import ABEModel from "../ABEModel/ABEModel";
import User from "../User.entity";
import GrupoTicket from "./GrupoTicket.entity";
import ClienteServicioTicketRespuesta, {
  Estado,
} from "./ClienteServicioTicketRespuesta.entity";
import ClienteServicio from "../cliente/ClienteServicio.entity";
import ClienteServicioModem from "../cliente/ClienteServicioModem.entity";

export enum Severidad {
  CRITICO = "CRITICO",
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
    (respuesta) => respuesta.ticket
  )
  respuestas: ClienteServicioTicketRespuesta[];

  @Expose() get getRespuestasCount(): string {
    if (!this.respuestas) return "0/0";
    const aceptados = this.respuestas?.filter(
      (r) => r.estado === Estado.ACEPTADO
    );
    return `${aceptados.length}/${this.respuestas.length}`;
  }

  protected userRespondio: string;
  setUserRespondio(user: User) {
    if (!user) return "NO ASIGNADO";
    try {
      if (this.respuestas.length < 1) return "SIN RESPUESTAS";
      const index = this.respuestas?.findIndex(
        (v) => v.usuarioCreacion.username === user.username
      );
      this.userRespondio =
        index > -1 ? this.respuestas[index].estado : "NO ASIGNADO";
    } catch (error) {
      logger.error(
        `No se pudo verificar si el usuario tiene una respuesta en el ticket err:${error}`
      );
      return "ERROR";
    }
  }
}
