import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Servicio from "../servicio/Servicio.entity";

export enum TipoSolicitud {
  FACTIBILIDAD = "FACTIBILIDAD",
  ALTA = "ALTA",
  BAJA = "BAJA",
  CORTE_TEMPORAL = "CORTE_TEMPORAL",
  CORTE_MANTENIMIENTO = "CORTE_MANTENIMIENTO",
  REHABILITACION = "REHABILITACION",
  MODIFICACION = "MODIFICACION",
  ALTA_EVENTUAL = "ALTA_EVENTUAL",
  ENTREGA_EQUIPOS = "ENTREGA_EQUIPOS",
  RETIRO_EQUIPOS = "RETIRO_EQUIPOS",
  PROVISIONAMIENTO = "PROVISIONAMIENTO",
  PRUEBAS = "PRUEBAS",
  OTRO = "OTRO",
}

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
    default: TipoSolicitud.PROVISIONAMIENTO,
  })
  tipoSolicitud: TipoSolicitud;

  @Column()
  accion: string;

  @Column() //vigencia en dias para responder
  vigenciaDias: number;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;
}
