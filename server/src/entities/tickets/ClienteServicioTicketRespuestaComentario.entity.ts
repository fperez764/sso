import { Column, Entity, ManyToOne } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import ClienteServicioTicketRespuesta from "./ClienteServicioTicketRespuesta.entity";

@Entity("cliente_servicio_ticket_respuesta_comentario")
export default class ClienteServicioTicketRespuestaComentario extends ABEModel {
  constructor(tComentario: Partial<ClienteServicioTicketRespuestaComentario>) {
    super();
    Object.assign(this, tComentario);
  }

  @Column()
  comentario: string;

  @Column({nullable: true})
  imagen: string;

  @ManyToOne(() => ClienteServicioTicketRespuesta, (sSRespuesta) => sSRespuesta.comentarios, {
    nullable: false, onDelete: "CASCADE"
  })
  ticketRespuesta: ClienteServicioTicketRespuesta;
}
