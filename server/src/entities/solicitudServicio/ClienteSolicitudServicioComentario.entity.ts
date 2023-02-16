import { Column, Entity, ManyToOne } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import ClienteSolicitudServicio from "./ClienteSolicitudServicio.entity";

@Entity("solicitud_servicio_comentario")
export default class ClienteSolicitudComentario extends ABEModel {
  constructor(cSolicitudComentario: Partial<ClienteSolicitudComentario>) {
    super();
    Object.assign(this, cSolicitudComentario);
  }

  @Column()
  comentario: string;

  @ManyToOne(() => ClienteSolicitudServicio, (sS) => sS.comentarios, {
    nullable: false,
  })
  clienteSolicitudServicio: ClienteSolicitudServicio;
}
