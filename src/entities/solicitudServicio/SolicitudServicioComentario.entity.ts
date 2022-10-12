import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import SolicitudServicio from "./SolicitudServicio.entity";

@Entity("solicitud_servicio_comentario")
export default class SolicitudServicioComentario extends ABEModel {
  constructor(sComentario: Partial<SolicitudServicioComentario>) {
    super();
    Object.assign(this, sComentario);
  }

  @Column()
  comentario: string;

  @ManyToOne(() => SolicitudServicio, (sS) => sS.comentarios, {
    nullable: false,
  })
  solicitudServicio: SolicitudServicio;
}
