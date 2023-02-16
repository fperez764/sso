import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import ClienteServicio from "./ClienteServicio.entity";

@Entity("cliente_servicio_modem")
@Unique("UQ_CLIENTESERVICO_MODEMMAC", ["clienteServicio", "modemMac"])
export default class ClienteServicioModem extends ABEModel {
  constructor(clienteServicioModem: Partial<ClienteServicioModem>) {
    super();
    Object.assign(this, clienteServicioModem);
  }

  @ManyToOne(() => ClienteServicio)
  @JoinColumn({ name: "clienteServicio", referencedColumnName: "id" })
  clienteServicio: ClienteServicio;

  @Index()
  @Column()
  modemMac: string;
}
