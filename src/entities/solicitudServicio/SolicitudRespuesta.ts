import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import User from "../User";
import SolicitudServicio from "./SolicitudServicio";

@Entity("SolicitudServicioRespuesta")
export default class SolicitudRespuesta extends ABEModel {
  constructor(sRespuesta: Partial<SolicitudRespuesta>) {
    super();
    Object.assign(this, sRespuesta);
  }
  @Column()
  area: string;
  aceptado: boolean = false;

  @Column()
  respuesta: string;

  @ManyToOne(() => SolicitudServicio, (sS) => sS.respuestas, {
    nullable: false,
  })
  solicitudServicio: SolicitudServicio;

  @ManyToOne(() => User)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @BeforeInsert()
  async setUsuarioCreacion() {
    this.usuarioCreacion = this.user.username;
  }
}
