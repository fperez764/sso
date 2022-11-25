import { Expose } from "class-transformer";
import { Column, Entity, ManyToOne, Unique } from "typeorm";
import logger from "../../utils/logger";
import ABEModel from "../ABEModel/ABEModel";
import SolicitudFlujoRespuesta from "./SolicitudFlujoRespuesta.entity";
import SolicitudServicio from "./SolicitudServicio.entity";

export enum Estado {
  ACEPTADO = "ACEPTADO",
  RECHAZADO = "RECHAZADO",
  PENDIENTE = "PENDIENTE",
}
@Entity("solicitud_servicio_respuesta")
@Unique("UQ_ORDEN_SERVICIO", ["solicitudServicio", "orden"])
export default class SolicitudRespuesta extends ABEModel {
  constructor(sRespuesta: Partial<SolicitudRespuesta>) {
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

  @ManyToOne(() => SolicitudServicio, (sS) => sS.respuestas, {
    nullable: false,
  })
  solicitudServicio: SolicitudServicio;

  @ManyToOne(() => SolicitudFlujoRespuesta)
  solicitudFlujoRespuesta: SolicitudFlujoRespuesta;
}
