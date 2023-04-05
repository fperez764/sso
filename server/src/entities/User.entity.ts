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
import ClienteSolicitud from "./clienteSolicitud/ClienteSolicitud.entity";
import ClienteServicioTicket from "./tickets/ClienteServicioTicket.entity";

//TODO: Definir en base de datos
export enum Areas {
  ATENCION_CLIENTE = "ATENCION_CLIENTE",
  ALMACENES = "ALMACENES",
  AUXILIAR = "AUXILIAR",
  COMERCIAL = "COMERCIAL",
  DGE = "DGE",
  FACTURACION = "FACTURACION",
  INGENIERIA = "INGENIERIA",
  OPERACIONES = "OPERACIONES",
  UTI = "UTI",
}

export enum Roles {
  ADMIN = "ADMIN",
  DIRECTOR = "DIRECTOR",
  JEFE = "JEFE",
  //TODO? caso del noc ENCARGADO = 'ENCARGADO',
  FUNCIONARIO = "FUNCIONARIO",
}

@Entity("users")
export default class User {
  constructor(user: Partial<User>) {
    Object.assign(this, user);
  }
  @Index()
  @PrimaryGeneratedColumn("uuid")
  id: string;

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

  @Column({ type: "enum", enum: Roles, default: Roles.FUNCIONARIO })
  rol: Roles;

  @OneToMany(
    () => ClienteSolicitud,
    (clienteSolicitud) => clienteSolicitud.usuarioCreacion
  )
  solicitudes: ClienteSolicitud[];

  @OneToMany(() => ClienteServicioTicket, (ticket) => ticket.usuarioCreacion)
  tickets: ClienteServicioTicket[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 6);
  }

  toJSON() {
    return instanceToPlain(this);
  }
}
