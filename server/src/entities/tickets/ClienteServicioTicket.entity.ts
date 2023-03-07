import { Expose } from "class-transformer";
<<<<<<< HEAD
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";
=======
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
>>>>>>> master
import logger from "../../utils/logger";
import ABEModel from "../ABEModel/ABEModel";
import User from "../User.entity";
import GrupoTicket from "./GrupoTicket.entity";
import ClienteServicioTicketRespuesta, {
  Estado,
} from "./ClienteServicioTicketRespuesta.entity";
import ClienteServicio from "../cliente/ClienteServicio.entity";
<<<<<<< HEAD
import ClienteServicioModem from "../cliente/ClienteServicioModem.entity";

export enum Severidad {
  CRITICO = "CRITICO",
  ALTA = "ALTA",
  MEDIA = "MEDIA",
  BAJA = "BAJA",
}
=======
>>>>>>> master

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

<<<<<<< HEAD
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

=======
>>>>>>> master
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

<<<<<<< HEAD
  protected userRespondio: string;
  setUserRespondio(user: User) {
    if (!user) return "NO ASIGNADO";
=======
  protected userAcepto: string;
  setUserVote(user: User) {
>>>>>>> master
    try {
      if (this.respuestas.length < 1) return "SIN RESPUESTAS";
      const index = this.respuestas?.findIndex(
        (v) => v.usuarioCreacion.username === user.username
      );
<<<<<<< HEAD
      this.userRespondio =
=======
      this.userAcepto =
>>>>>>> master
        index > -1 ? this.respuestas[index].estado : "NO ASIGNADO";
    } catch (error) {
      logger.error(
        `No se pudo verificar si el usuario tiene una respuesta en el ticket err:${error}`
      );
      return "ERROR";
    }
  }
}
