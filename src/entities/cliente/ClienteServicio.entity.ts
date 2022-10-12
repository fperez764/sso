import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Servicio from "../servicio/Servicio.entity";
import Cliente from "./Cliente.entity";
import ClienteServicioPeriodo from "./ClienteServicioPeriodo.entity";
/**
 * Constructor para registros en BD de CLIENTE_SERVICIO
 */
@Entity("cliente_servicio")
export default class ClienteServicio extends ABEModel {
  constructor(clienteServicio: Partial<ClienteServicio>) {
    super();
    Object.assign(this, clienteServicio);
  }

  @Column()
  activo: boolean = true; // NOT NULL

  @Index()
  @Column()
  modemMac: string;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;

  @ManyToOne(() => Cliente, (cliente) => cliente.clienteServicios)
  @JoinColumn({ name: "cliente", referencedColumnName: "id" })
  cliente: Cliente;

  @OneToMany(
    () => ClienteServicioPeriodo,
    (clienteServicioPeriodo) => clienteServicioPeriodo.clienteServicio
  )
  clienteServicioPeriodos: ClienteServicioPeriodo[];
}
