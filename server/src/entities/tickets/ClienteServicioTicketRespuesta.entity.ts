import { Expose } from "class-transformer";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import GrupoTicketFlujoRespuestas from "./GrupoTicketFlujoRespuestas.entity";
import ClienteServicioTicket from "./ClienteServicioTicket.entity";
import ClienteServicioTicketRespuestaComentario from "./ClienteServicioTicketRespuestaComentario.entity";
import User from "../User.entity";

export enum Estado {
  ACEPTADO = "ACEPTADO",
  RECHAZADO = "RECHAZADO",
  PENDIENTE = "PENDIENTE",
  RESUELTO = "RESUELTO",
}
@Entity("cliente_servicio_ticket_respuesta")
@Unique("UQ_TICKET_ORDEN_RESPUESTA", ["ticket", "orden"])
export default class ClienteServicioTicketRespuesta extends ABEModel {
  constructor(sRespuesta: Partial<ClienteServicioTicketRespuesta>) {
    super();
    Object.assign(this, sRespuesta);
  }

  @Column()
  orden: number;

  @Column()
  area: string;

  @Column({
    type: "enum",
    enum: Estado,
    default: Estado.PENDIENTE,
  })
  estado: Estado;

  @Column({ nullable: true })
  fechaInicio: Date;

  @Column({ nullable: true })
  fechaFin: Date;

  @Column({ nullable: true })
  fechaRespuesta: Date;

  @Column({ nullable: true })
  respuesta: string;

  @Column()
  accion: string;

  @Column({default: false})
  leido: boolean;

  @ManyToOne(() => ClienteServicioTicket, (sS) => sS.respuestas, {
    nullable: false,
  })
  ticket: ClienteServicioTicket;

  @ManyToOne(() => GrupoTicketFlujoRespuestas, { nullable: true })
  ticketFlujoRespuesta: GrupoTicketFlujoRespuestas;

  @OneToMany(
    () => ClienteServicioTicketRespuestaComentario,
    (comentario) => comentario.ticketRespuesta, {onDelete: "CASCADE", eager: true}
  )
  comentarios: ClienteServicioTicketRespuestaComentario[];

  @Expose() get getComentariosCount(): number {
    return this.comentarios ? this.comentarios.length : 0;
  }

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "usuarioAsignado", referencedColumnName: "username" })
  usuarioAsignado: User;
}
