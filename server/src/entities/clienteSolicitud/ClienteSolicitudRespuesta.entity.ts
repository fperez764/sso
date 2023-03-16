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
import GrupoSolicitudFlujoRespuestas from "./GrupoSolicitudFlujoRespuestas.entity";
import ClienteSolicitud from "./ClienteSolicitud.entity";
import ClienteSolicitudRespuestaComentario from "./ClienteSolicitudRespuestaComentario.entity";
import User from "../User.entity";

export enum Estado {
  ACEPTADO = "ACEPTADO",
  RECHAZADO = "RECHAZADO",
  PENDIENTE = "PENDIENTE",
}
@Entity("cliente_solicitud_respuesta")
@Unique("UQ_ORDEN_CLIENTESOLICITUDSERVICIO", ["clienteSolicitud", "orden"])
export default class ClienteSolicitudRespuesta extends ABEModel {
  constructor(cSolRespuesta: Partial<ClienteSolicitudRespuesta>) {
    super();
    Object.assign(this, cSolRespuesta);
  }

  @Column()
  orden: number;

  @Column()
  area: string;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: "usuarioAsignado", referencedColumnName: "username" })
  usuarioAsignado: User;

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

  @ManyToOne(() => ClienteSolicitud, (sS) => sS.respuestas, {
    nullable: false,
  })
  clienteSolicitud: ClienteSolicitud;

  @ManyToOne(() => GrupoSolicitudFlujoRespuestas, { nullable: false })
  solicitudFlujoRespuesta: GrupoSolicitudFlujoRespuestas;

  @OneToMany(
    () => ClienteSolicitudRespuestaComentario,
    (comentario) => comentario.clienteSolicitudRespuesta
  )
  comentarios: ClienteSolicitudRespuestaComentario[];

  @Expose() get getComentariosCount(): number {
    return this.comentarios ? this.comentarios.length : 0;
  }
}
