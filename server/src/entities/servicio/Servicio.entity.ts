import { Expose } from "class-transformer";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Categoria from "./Categoria.entity";
import ServicioPaquete from "./ServicioPaquete.entity";

@Entity("servicio")
@Unique("UQ_NOMBRE_CATEGORIA", ["nombre", "categoria"])
export default class Servicio extends ABEModel {
  constructor(sS: Partial<Servicio>) {
    super();
    Object.assign(this, sS);
  }
  @ManyToOne(() => Categoria)
  @JoinColumn({ name: "categoria", referencedColumnName: "nombre" })
  categoria: Categoria;

  @Column({ unique: true })
  nombre: string;

  @Column()
  descripcion: string;

  @Column()
  activo: boolean;

  @OneToMany(
    () => ServicioPaquete,
    (servicioPaquete) => servicioPaquete.servicio
  )
  servicioPaquetes: ServicioPaquete[];
}
