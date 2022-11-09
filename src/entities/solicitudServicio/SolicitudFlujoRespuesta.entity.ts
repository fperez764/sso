import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Servicio from "../servicio/Servicio.entity";
import { TipoSolicitud } from "./SolicitudServicio.entity";

@Entity("solicitud_flujo_respuesta")
@Unique("UQ_ORDEN_TIPO_SERVICIO", ["orden", "tipoSolicitud", "servicio"])
export default class SolicitudFlujoRespuesta extends ABEModel {
  constructor(sRespuesta: Partial<SolicitudFlujoRespuesta>) {
    super();
    Object.assign(this, sRespuesta);
  }

  @Column()
  orden: number;

  @Column()
  area: string;

  @Column({
    type: "enum",
    enum: TipoSolicitud,
  })
  tipoSolicitud: TipoSolicitud;

  @Column()
  accion: string;

  @Column() //vigencia en dias para responder TODO: aprobar nombre
  esperaDias: number;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;
}
