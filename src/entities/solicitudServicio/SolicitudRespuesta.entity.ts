import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import User from "../User.entity";
import SolicitudServicio from "./SolicitudServicio.entity";

export enum AreasAceptacion {
  INSTALADOR = "INSTALADOR",
  COMERCIAL = "COMERCIAL",
  DOCUMENTOS_COMERCIAL = "DOCUMENTOS_COMERCIAL",
  DOCUMENTOS_INSTALADOR = "DOCUMENTOS_INSTALADOR",
  MODEM_ALMACEN = "MODEM_ALMACEN",
  MODEM_INSTALADOR = "MODEM_INSTALADOR",
  INSTALADO = "INSTALADO",
  ACTIVADO = "ACTIVADO",
  DOCUMENTOS_ENTREGADOS = "DOCUMENTOS_ENTREGADOS",
}

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
  @Column({
    type: "enum",
    enum: AreasAceptacion,
    default: AreasAceptacion.INSTALADOR,
  })
  area: AreasAceptacion;

  @Column({
    type: "enum",
    enum: Estado,
    default: Estado.PENDIENTE,
  })
  estado: Estado;

  @Column()
  respuesta: string;

  @Column()
  accion: string;

  @ManyToOne(() => SolicitudServicio, (sS) => sS.respuestas, {
    nullable: false,
  })
  solicitudServicio: SolicitudServicio;
}
