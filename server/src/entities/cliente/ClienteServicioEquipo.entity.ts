import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import ClienteServicio from "./ClienteServicio.entity";

@Entity("cliente_servicio_equipo")
@Unique("UQ_CLIENTESERVICO_EQUIPOSERIAL", ["clienteServicio", "equipoSerial"])
export default class ClienteServicioEquipo extends ABEModel {
  constructor(clienteServicioEquipo: Partial<ClienteServicioEquipo>) {
    super();
    Object.assign(this, clienteServicioEquipo);
  }

  @ManyToOne(() => ClienteServicio)
  @JoinColumn({ name: "clienteServicio", referencedColumnName: "id" })
  clienteServicio: ClienteServicio;

  @Index()
  @Column()
  equipoSerial: string;
}
