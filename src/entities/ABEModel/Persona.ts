import ABEModel from "../ABEModel/ABEModel";

import {
  Column,
  Index,
} from "typeorm";

export enum TipoDocumento {
  CI = "CI",
  NIT = "NIT",
  CEX = "CEX",
  OTRO = "OTRO",
}

export default abstract class Persona extends ABEModel {
  constructor(persona: Partial<Persona>) {
    super();
    Object.assign(this, persona);
  }

  @Index()
  @Column({unique: false})
  nroDocumento: string;
  
  @Column({
    type: "enum",
    enum: TipoDocumento,
    default: TipoDocumento.CI,
  })
  tipoDocumento: string;

  @Column()
  nombreCompleto: string;

  @Column({ nullable: true, type: "text" })
  direccion: string;
  
  @Column({ nullable: true, type: "text" })
  telefono: string;
  
  @Column({ nullable: true, type: "text" })
  email: string;
  
  @Column()
  nit: string;
  
  @Column()
  razonSocial: string;
}
