import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import User from "../User.entity";
import ServicioPaquete from "./ServicioPaquete.entity";

export enum Categoria {
  SEGMENTO_KU = "SEGMENTO_KU",
  SEGMENTO_C = "SEGMENTO_C",
  SEGMENTO_KA = "SEGMENTO_KA",
  DTH_BSS = "DTH_BSS",
  DTH_FSS = "DTH_FSS",
  RADIO_BSS = "RADIO_BSS",
  RADIO_FSS = "RADIO_FSS",
  KA = "KA",
  KU = "KU",
  VNO = "VNO",
  SUBE = "SUBE",
  BACKHAUL = "BACKHAUL",
  OTRO = "OTRO",
}

@Entity("servicio")
export default class Servicio extends ABEModel {
  static user: any;
  constructor(sS: Partial<Servicio>) {
    super();
    Object.assign(this, sS);
  }
  @Column({
    type: "enum",
    enum: Categoria,
    default: Categoria.OTRO,
  })
  categoria: string;

  @Column({ unique: true })
  descripcion: string;

  @Column()
  activo: boolean;

  @OneToMany(
    () => ServicioPaquete,
    (servicioPaquete) => servicioPaquete.servicio
  )
  servicioPaquetes: ServicioPaquete[];
}
