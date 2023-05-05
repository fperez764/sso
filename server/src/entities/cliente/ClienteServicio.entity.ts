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
import ClienteServicioTicket from "../tickets/ClienteServicioTicket.entity";
import ClienteServicioModem from "./ClienteServicioModem.entity";

@Entity("cliente_servicio")
@Unique("UQ_CLIENTE_SERVICO", ["cliente", "servicio"])
export default class ClienteServicio extends ABEModel {
  constructor(clienteServicio: Partial<ClienteServicio>) {
    super();
    Object.assign(this, clienteServicio);
  }

  @Column()
  activo: boolean = true; // NOT NULL

  @ManyToOne(() => Servicio, { nullable: false })
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;

  @Column({default: false})
  contrato: boolean = false; // NOT NULL
  
  @Column({ nullable: false, default: 'POR MIGRAR RSS' })
  instalador: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.clienteServicios, {
    nullable: false, eager: true
  })
  @JoinColumn({ name: "cliente", referencedColumnName: "id" })
  cliente: Cliente;

  @OneToMany(() => ClienteServicioTicket, (ticket) => ticket.clienteServicio)
  tickets: ClienteServicioTicket[];

  @OneToMany(
    () => ClienteServicioPeriodo,
    (clienteServicioPeriodo) => clienteServicioPeriodo.clienteServicio
  )
  clienteServicioPeriodos: ClienteServicioPeriodo[];

  @OneToMany(() => ClienteServicioModem, (modem) => modem.clienteServicio, {eager: true})
  modems: ClienteServicioModem[];
}
