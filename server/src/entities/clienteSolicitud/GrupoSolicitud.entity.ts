import { Entity, Column, Index, OneToMany, ManyToOne, JoinColumn } from "typeorm";

import { Expose } from "class-transformer";
import ABEModel from "../ABEModel/ABEModel";
import ClienteSolicitud from "./ClienteSolicitud.entity";
import Servicio from "../servicio/Servicio.entity";
import GrupoSolicitudFlujoRespuestas from "./GrupoSolicitudFlujoRespuestas.entity";

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

@Entity("grupo_solicitud")
export default class GrupoSolicitud extends ABEModel {
  constructor(sub: Partial<GrupoSolicitud>) {
    super();
    Object.assign(this, sub);
  }

  @Index()
  @Column({ unique: true })
  nombre: string;

  @Column({ type: "text", nullable: true })
  descripcion: string;

  @Column({
    type: "enum",
    enum: TipoSolicitud,
    default: TipoSolicitud.PROVISIONAMIENTO,
  })
  tipo: TipoSolicitud;

  @ManyToOne(() => Servicio, (servicio) => servicio.gruposSolicitud, {
    nullable: true,
  })
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @OneToMany(() => ClienteSolicitud, (solicitudS) => solicitudS.grupo)
  solicitudesS: ClienteSolicitud[];

  @OneToMany(
    () => GrupoSolicitudFlujoRespuestas,
    (flujoRespuestas) => flujoRespuestas.grupo
  )
  respuestas: GrupoSolicitudFlujoRespuestas[];


  @Expose()
  get imageUrl(): string {
    return this.imageUrn
      ? `${process.env.APP_URL}/images/${this.imageUrn}`
      : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
  }

  @Expose()
  get bannerUrl(): string | undefined {
    return this.bannerUrn
      ? `${process.env.APP_URL}/images/${this.bannerUrn}`
      : undefined;
  }
}
