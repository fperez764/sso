import { Expose } from "class-transformer";
import { Column, Entity, ManyToOne, Unique } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import TicketFlujoRespuesta from "./TicketFlujoRespuesta.entity";
import ServicioTicket from "./ServicioTicket.entity";

export enum Estado {
  ACEPTADO = "ACEPTADO",
  RECHAZADO = "RECHAZADO",
  PENDIENTE = "PENDIENTE",
  RESUELTO = "RESUELTO",
}
@Entity("ticket_servicio_respuesta")
@Unique("UQ_TICKETORDEN_SERVICIO", ["ticket", "orden"])
export default class ServicioTicketRespuesta extends ABEModel {
  constructor(sRespuesta: Partial<ServicioTicketRespuesta>) {
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

  @Expose() get fechaRespuesta(): Date {
    return this.fechaModificacion;
  }

  @Column()
  respuesta: string;

  @Column()
  accion: string;

  @ManyToOne(() => ServicioTicket, (sS) => sS.respuestas, {
    nullable: false,
  })
  ticket: ServicioTicket;

  @ManyToOne(() => TicketFlujoRespuesta)
  ticketFlujoRespuesta: TicketFlujoRespuesta;
}
