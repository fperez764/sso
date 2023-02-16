import {
  Column,
  Entity,
  OneToMany,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Servicio from "./Servicio.entity";

export enum CategoriaEjemplos {
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

@Entity("categoria")
export default class Categoria extends ABEModel {
  constructor(categoria: Partial<Categoria>) {
    super();
    Object.assign(this, categoria);
  }

  @Column({ unique: true })
  nombre: string;

  @Column({ unique: true })
  descripcion: string;

  @Column()
  activo: boolean;

  @OneToMany(
    () => Servicio,
    (servicio) => servicio.categoria
  )
  servicios: Servicio[];
}
