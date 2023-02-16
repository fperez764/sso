import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Servicio from "../servicio/Servicio.entity";
import SolicitudGrupo from "./SolicitudGrupo.entity";

@Entity("solicitud_flujo_respuesta")
@Unique("UQ_ORDEN_GRUPOSOLICITUD_SERVICIO", ["orden", "grupo", "servicio"])
export default class SolicitudFlujoRespuesta extends ABEModel {
  constructor(sRespuesta: Partial<SolicitudFlujoRespuesta>) {
    super();
    Object.assign(this, sRespuesta);
  }

  @Column()
  orden: number;

  @Column()
  area: string;

  @Column()
  accion: string;

  @Column() //vigencia en dias para responder
  vigenciaDias: number;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;

  @ManyToOne(() => SolicitudGrupo)
  @JoinColumn({ name: "grupo", referencedColumnName: "nombre" })
  grupo: SolicitudGrupo;
}
