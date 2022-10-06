import {
  Entity,
  Column,
  Index,
  OneToMany,
  BeforeInsert,
  ManyToOne,
  JoinColumn,
} from "typeorm";

import { Expose } from "class-transformer";
import ABEModel from "../ABEModel/ABEModel";
import SolicitudServicio from "./SolicitudServicio.entity";
import User from "../User.entity";

@Entity("solicitud_servicio_grupo")
export default class SolicitudGrupo extends ABEModel {
  constructor(sub: Partial<SolicitudGrupo>) {
    super();
    Object.assign(this, sub);
  }

  @Index()
  @Column({ unique: true })
  name: string;

  @Column()
  title: string;

  @Column({ type: "text", nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrn: string;

  @Column({ nullable: true })
  bannerUrn: string;

  @OneToMany(() => SolicitudServicio, (solicitudS) => solicitudS.grupo)
  solicitudesS: SolicitudServicio[];

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
