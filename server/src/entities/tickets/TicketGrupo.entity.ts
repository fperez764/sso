import {
  Entity,
  Column,
  Index,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Expose } from "class-transformer";
import ABEModel from "../ABEModel/ABEModel";
import ServicioTicket from "./ServicioTicket.entity";
import TicketFlujoRespuesta from "./TicketFlujoRespuesta.entity";
import Servicio from "../servicio/Servicio.entity";

export enum TipoTicket {
  DESAPUNTAMIENTO = "DESAPUNTAMIENTO",
  CAMBIO_DE_PLAN = "CAMBIO_DE_PLAN",
  SOPORTE_TECNICO = "SOPORTE_TECNICO",
  MANTENIMIENTO_CORRECTIVO = "MANTENIMIENTO_CORRECTIVO",
  MANTENIMIENTO = "MANTENIMIENTO",
}

@Entity("ticket_servicio_grupo")
export default class TicketGrupo extends ABEModel {
  constructor(sub: Partial<TicketGrupo>) {
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

  @OneToMany(() => ServicioTicket, (tickets) => tickets.grupo)
  tickets: ServicioTicket[];

  @OneToMany(
    () => TicketFlujoRespuesta,
    (flujoRespuestas) => flujoRespuestas.grupo
  )
  flujoRespuestas: TicketFlujoRespuesta[];

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
