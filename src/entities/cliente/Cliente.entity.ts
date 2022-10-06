import ABEModel from "../ABEModel/ABEModel";

import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import User from "../User.entity";
import SolicitudServicio from "../solicitudServicio/SolicitudServicio.entity";
import ClienteServicio from "./ClienteServicio.entity";

export enum TipoDocumento {
  CI = "CI",
  NIT = "NIT",
  CEX = "CEX",
  OTRO = "OTRO",
}

@Entity("cliente")
export default class Cliente extends ABEModel {
  static user: any;
  constructor(cliente: Partial<Cliente>) {
    super();
    Object.assign(this, cliente);
  }

  @Index()
  @Column()
  nroDocumento: string;
  @Column({
    type: "enum",
    enum: TipoDocumento,
    default: TipoDocumento.CI,
  })
  tipoDocumento: string;

  @Column()
  nombres: string;
  @Column({ nullable: true, type: "text" })
  apellidos: string;
  @Column({ nullable: true, type: "text" })
  direccion: string;
  @Column({ nullable: true, type: "text" })
  telefono: string;
  @Column({ nullable: true, type: "text" })
  email: string;
  @Column()
  nit: string;
  @Column()
  razon_social: string;
  @Column()
  tipoCliente: string;

  @OneToMany(
    () => SolicitudServicio,
    (solicitudServicio) => solicitudServicio.cliente
  )
  solicitudesS: SolicitudServicio[];

  @OneToMany(
    () => ClienteServicio,
    (clienteServicio) => clienteServicio.cliente
  )
  clienteServicios: ClienteServicio[];
}
