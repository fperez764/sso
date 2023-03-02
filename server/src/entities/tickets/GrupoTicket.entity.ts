import { Entity, Column, Index, OneToMany } from "typeorm";

import { Expose } from "class-transformer";
import ABEModel from "../ABEModel/ABEModel";
import ClienteServicioTicket from "./ClienteServicioTicket.entity";
import GrupoTicketFlujoRespuestas from "./GrupoTicketFlujoRespuestas.entity";

export enum TipoTicket {
  DESAPUNTAMIENTO = "DESAPUNTAMIENTO",
  CAMBIO_DE_PLAN = "CAMBIO_DE_PLAN",
  SOPORTE_TECNICO = "SOPORTE_TECNICO",
  MANTENIMIENTO_CORRECTIVO = "MANTENIMIENTO_CORRECTIVO",
  MANTENIMIENTO = "MANTENIMIENTO",
}

@Entity("grupo_ticket")
export default class GrupoTicket extends ABEModel {
  constructor(sub: Partial<GrupoTicket>) {
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
    enum: TipoTicket,
    default: TipoTicket.SOPORTE_TECNICO,
  })
  tipo: TipoTicket;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @OneToMany(() => ClienteServicioTicket, (tickets) => tickets.grupo)
  tickets: ClienteServicioTicket[];

  @OneToMany(
    () => GrupoTicketFlujoRespuestas,
    (flujoRespuestas) => flujoRespuestas.grupo
  )
  flujoRespuestas: GrupoTicketFlujoRespuestas[];

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
