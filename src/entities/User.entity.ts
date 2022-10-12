import {
  Entity,
  Column,
  Index,
  BeforeInsert,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
import { IsEmail, Length } from "class-validator";
import bcrypt from "bcrypt";
import { instanceToPlain, Exclude } from "class-transformer";
import SolicitudServicio from "./solicitudServicio/SolicitudServicio.entity";

//TODO: Definir en base de datos
export enum Areas {
  INSTALACIONES = "INSTALACIONES",
  COMERCIAL = "COMERCIAL",
  ALMACENES = "ALMACENES",
  OPERACIONES = "OPERACIONES",
  UTI = "UTI",
  INGENIERIA = "INGENIERIA",
  FACTURACION = "FACTURACION",
  DGE = "DGE",
  AUXILIAR = "AUXILIAR",
}

@Entity("users")
export default class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @CreateDateColumn()
  fechaCreacion: Date;

  @Exclude()
  @Column({ nullable: true, type: "text" })
  usuarioCreacion: string;

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

  @Column({ default: true })
  activo: boolean = true;

  @Exclude()
  @Column()
  @Length(6, 255, { message: "Debe tener al menos 6 caracterers" })
  password: string;

  @Column({
    type: "enum",
    enum: Areas,
    default: Areas.AUXILIAR,
  })
  area: Areas;

  @Column({ nullable: true, type: "text" })
  rol: roles;

  @OneToMany(
    () => SolicitudServicio,
    (solicitudServicio) => solicitudServicio.usuarioCreacion
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
