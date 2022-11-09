import { Expose } from "class-transformer";
import { Column, Entity, ManyToOne } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import SolicitudServicio from "./SolicitudServicio.entity";

export enum Estado {
  ACEPTADO = "ACEPTADO",
  RECHAZADO = "RECHAZADO",
  PENDIENTE = "PENDIENTE",
}

@Entity("solicitud_servicio_respuesta")
export default class SolicitudRespuesta extends ABEModel {
  constructor(sRespuesta: Partial<SolicitudRespuesta>) {
    super();
    Object.assign(this, sRespuesta);
  }
  @Column()
  area: string;

  @Column({
    type: "enum",
    enum: Estado,
    default: Estado.PENDIENTE,
  })
  estado: Estado;

  @Expose() get fechaRespuesta(): Date {
    return this.fechaModificacion;
  }

  @Column()
  respuesta: string;

  @Column()
  accion: string;

  @ManyToOne(() => SolicitudServicio, (sS) => sS.respuestas, {
    nullable: false,
  })
  solicitudServicio: SolicitudServicio;
}
