import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import ServicioPaquete from "../servicio/ServicioPaquete.entity";
import ClienteServicioPeriodo from "./ClienteServicioPeriodo.entity";

export enum TipoPaquete {
  REGULAR = "REGULAR",
  BONO = "BONO",
  REDUCIDO = "REDUCIDO",
  ILIMITADO = "ILIMITADO",
}
/**
 * Constructor para registros en BD de MB_ADICIONALES/DETALLE
 */
@Entity("cliente_servicio_modem_paquete")
export default class ClienteServicioModemPaquete extends ABEModel {
  constructor(
    clienteServicioModemPaquete: Partial<ClienteServicioModemPaquete>
  ) {
    super();
    Object.assign(this, clienteServicioModemPaquete);
  }

  @Column()
  inicioVigencia: Date;

  @Column()
  finVigencia: Date;

  @Column()
  modemMac: string;

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

  @ManyToOne(() => ServicioPaquete, { nullable: false })
  @JoinColumn({ name: "servicioPaquete", referencedColumnName: "nombre" })
  servicioPaquete: ServicioPaquete;

  @ManyToOne(
    () => ClienteServicioPeriodo,
    (clienteServicioPeriodo) => clienteServicioPeriodo.clienteServicioPaquetes,
    { nullable: false }
  )
  @JoinColumn({ name: "clienteServicioPeriodo", referencedColumnName: "id" })
  clienteServicioPeriodo: ClienteServicioPeriodo;
}
