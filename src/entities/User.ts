import { Entity, Column, Index, BeforeInsert, OneToMany } from "typeorm";
import { IsEmail, Length } from "class-validator";
import bcrypt from "bcrypt";
import { instanceToPlain, Exclude } from "class-transformer";
import ABEModel from "./ABEModel/ABEModel";
import SolicitudServicio from "./solicitudServicio/SolicitudServicio";

@Entity("users")
export default class User extends ABEModel {
  constructor(user: Partial<User>) {
    super();
    Object.assign(this, user);
  }
  @Index()
  @Length(5, 255, {
    message: "El nombre de usuario debe tener mas de 5 caracteres",
  })
  @Column({ unique: true })
  username: string;

  @Index()
  @IsEmail(undefined, { message: "Debe ser un correo valido" })
  @Length(1, 255, { message: "Email no puede ser vacio" })
  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  @Length(6, 255, { message: "Debe tener al menos 6 caracterers" })
  password: string;

  @Column({ nullable: true, type: "text" })
  area: areas;

  @Column({ nullable: true, type: "text" })
  rol: roles;

  @OneToMany(
    () => SolicitudServicio,
    (solicitudServicio) => solicitudServicio.user
  )
  solicitudesS: SolicitudServicio[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}

//TODO: Definir en base de datos
export enum areas {
  INSTALACIONES,
  COMERCIAL,
  ALMACENES,
  OPERACIONES,
  UTI,
  INGENIERIA,
  DGE,
  AUXILIAR,
}
//TODO: Definir en base de datos
export enum roles {
  SS_ADMIN = "CRMD",
  SS = "CRMD",
  CLIENTES_ADMIN = "CRMD",
  CLIENTES = "R",
  CLIENTES_DOCUMENTOS = "CR",
  CLIENTES_DOCUMENTOS_ADMIN = "CRMD",
  MODEMS_NEWTEC = "CRM",
  MODEMS_GILAT = "CRM",
  FACTURACION = "CRMD",
  SERVICIOS = "CRMD",
}
