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
import User from "../User";

@Entity("SolicitudServicio")
export default class SolicitudServicio extends ABEModel {
  static user: any;
  constructor(sS: Partial<SolicitudServicio>) {
    super();
    Object.assign(this, sS);
  }
  public categoria: string;
  public descripcion: string;
  public activo: boolean;
}

export enum categoria {
  SEGMENTO_KU,
  SEGMENTO_C,
  SEGMENTO_KA,
  DTH_BSS,
  DTH_FSS,
  RADIO_BSS,
  RADIO_FSS,
  KA,
  KU,
  VNO,
  SUBE,
  BACKHAUL,
}
