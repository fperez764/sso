import { Entity, JoinColumn, ManyToOne, Column, Unique } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Servicio from "./Servicio.entity";

/**
 * Constructor para registros en BD de paquetes por servicio
 */
@Entity("servicio_paquete")
@Unique("UQ_NOMBRE_SERVICO", ["nombre", "servicio"])
export default class ServicioPaquete extends ABEModel {
  constructor(sS: Partial<ServicioPaquete>) {
    super();
    Object.assign(this, sS);
  }
  @Column({ unique: true })
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  precio: number;

  @ManyToOne(() => Servicio, (servicio) => servicio.servicioPaquetes, {
    nullable: false,
  })
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;

  @Column("boolean", { default: true }) //Renovacion mensual
  renovacion: boolean;

  @Column({ nullable: true })
  vigenciaDias: number;

  @Column() //numero de MB regulares del paquete (puede ser 'ilimitado' = -1)
  mbRegular: number;

  @Column()
  mbBono: number;

  @Column()
  mbRecargo: number;

  @Column()
  perfilReducido: number;

  @Column()
  perfilRegular: number;
}

//Paquete mensual por defecto del 1 al 31 del mes
