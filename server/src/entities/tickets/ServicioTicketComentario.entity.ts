import { Column, Entity, ManyToOne } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import ServicioTicket from "./ServicioTicket.entity";

@Entity("ticket_servicio_comentario")
export default class ServicioTicketComentario extends ABEModel {
  constructor(tComentario: Partial<ServicioTicketComentario>) {
    super();
    Object.assign(this, tComentario);
  }

  @Column()
  comentario: string;

  @ManyToOne(() => ServicioTicket, (sS) => sS.comentarios, {
    nullable: false,
  })
  ticket: ServicioTicket;
}
