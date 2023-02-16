import { Entity, Column, Index, OneToMany } from "typeorm";

import { Expose } from "class-transformer";
import ABEModel from "../ABEModel/ABEModel";
import ClienteSolicitudServicio from "./ClienteSolicitudServicio.entity";

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

@Entity("solicitud_servicio_grupo")
export default class SolicitudGrupo extends ABEModel {
  constructor(sub: Partial<SolicitudGrupo>) {
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

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @OneToMany(() => ClienteSolicitudServicio, (solicitudS) => solicitudS.grupo)
  solicitudesS: ClienteSolicitudServicio[];

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
