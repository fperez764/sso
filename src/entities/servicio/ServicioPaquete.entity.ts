import { Entity, JoinColumn, ManyToOne, Column } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Servicio from "./Servicio.entity";

/**
 * Constructor para registros en BD de paquetes por servicio
 */
@Entity("servicio_paquete")
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
  mbRegular: number;

  @Column()
  mbBono: number;

  @Column()
  precio: number;

  @Column()
  perfilReducido: number;

  @Column()
  perfilRegular: number;

  @ManyToOne(() => Servicio, (servicio) => servicio.servicioPaquetes)
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;
}
