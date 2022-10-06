import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import ServicioPaquete from "../servicio/ServicioPaquete.entity";
import User from "../User.entity";
import ClienteServicioPeriodo from "./ClienteServicioPeriodo.entity";

export enum TipoPaquete {
  REGULAR,
  BONO,
  REDUCIDO,
  ILIMITADO,
}
/**
 * Constructor para registros en BD de MB_ADICIONALES/DETALLE
 */
@Entity("cliente_servicio_paquete")
export default class ClienteServicioPaquete extends ABEModel {
  static user: any;
  constructor(clienteServicioPaquete: Partial<ClienteServicioPaquete>) {
    super();
    Object.assign(this, clienteServicioPaquete);
  }

  @Column()
  inicioVigencia: Date;

  @Column()
  finVigencia: Date;

  @Column()
  consumo: number;

  @Column()
  consumido: boolean;

  @Column({
    type: "enum",
    enum: TipoPaquete,
    default: TipoPaquete.REGULAR,
  })
  tipo: TipoPaquete;

  @Column()
  facturaReferencia: string; //CUF Codigo Unico de Facturacion

  @ManyToOne(() => ServicioPaquete)
  @JoinColumn({ name: "servicioPaquete", referencedColumnName: "nombre" })
  servicioPaquete: ServicioPaquete;

  @ManyToOne(
    () => ClienteServicioPeriodo,
    (clienteServicioPeriodo) => clienteServicioPeriodo.clienteServicioPaquetes
  )
  @JoinColumn({ name: "clienteServicioPeriodo", referencedColumnName: "id" })
  clienteServicioPeriodo: ClienteServicioPeriodo;
}
