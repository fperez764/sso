import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Servicio from "../servicio/Servicio.entity";
import Cliente from "./Cliente.entity";
import ClienteServicioPeriodo from "./ClienteServicioPeriodo.entity";
import ServicioTicket from "../tickets/ServicioTicket.entity";

@Entity("cliente_servicio")
@Unique("UQ_CLIENTE_SERVICO", ["cliente", "servicio"])
export default class ClienteServicio extends ABEModel {
  constructor(clienteServicio: Partial<ClienteServicio>) {
    super();
    Object.assign(this, clienteServicio);
  }

  @Column()
  activo: boolean = true; // NOT NULL

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;

  @ManyToOne(() => Cliente, (cliente) => cliente.clienteServicios)
  @JoinColumn({ name: "cliente", referencedColumnName: "id" })
  cliente: Cliente;

  @OneToMany(() => ServicioTicket, (ticket) => ticket.clienteServicio)
  tickets: ServicioTicket[];

  @OneToMany(
    () => ClienteServicioPeriodo,
    (clienteServicioPeriodo) => clienteServicioPeriodo.clienteServicio
  )
  clienteServicioPeriodos: ClienteServicioPeriodo[];
}
