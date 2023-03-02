import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import GrupoSolicitud from "./GrupoSolicitud.entity";

@Entity("grupo_solicitud_flujo_respuestas")
@Unique("UQ_GRUPOSOLICITUD_ORDEN", ["orden", "grupo"])
export default class GrupoSolicitudFlujoRespuestas extends ABEModel {
  constructor(sRespuesta: Partial<GrupoSolicitudFlujoRespuestas>) {
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

  @ManyToOne(() => GrupoSolicitud, { nullable: false })
  @JoinColumn({ name: "grupo", referencedColumnName: "nombre" })
  grupo: GrupoSolicitud;
}
