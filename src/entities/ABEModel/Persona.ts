import ABEModel from "../ABEModel/ABEModel";

import { Column, Index } from "typeorm";
import { IsEmail, IsNumberString, Length, ValidateIf } from "class-validator";

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
  @IsNumberString()
  @Length(6, 55, {
    message: "Debe tener más de 5 caracteres",
  })
  @Column({ unique: true })
  nroDocumento: string;

  @Column()
  @Length(3, 55, { message: "Debe tener más de 3 caracteres" })
  nombreCompleto: string;

  @Column({ nullable: true, type: "text" })
  direccion: string;

  @IsNumberString()
  @Length(6, 55, {
    message: "Debe tener más de 5 números",
  })
  @Column({ nullable: true, type: "text" })
  @ValidateIf((object, value) => value !== "")
  telefono: string | null;

  @Index()
  @IsEmail(undefined, { message: "Debe ser un correo valido" })
  @ValidateIf((object, value) => value !== "")
  @Column({ nullable: true, type: "text" })
  email: string | null;

  @IsNumberString({ message: "Solo pueden ser números" })
  @Length(6, 255, {
    message: "Debe tener más de 5 números",
  })
  @Column()
  nroDocumentoFacturacion: string;

  @Column({
    type: "enum",
    enum: TipoDocumento,
    default: TipoDocumento.CI,
  })
  tipoDocumentoFacturacion: string;

  @Column()
  @Length(3, 55, { message: "Debe tener más de 3 caracteres" })
  razonSocial: string;
}
