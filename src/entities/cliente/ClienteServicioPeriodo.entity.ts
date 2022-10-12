import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import User from "../User.entity";
import ClienteServicio from "./ClienteServicio.entity";
import ClienteServicioPaquete from "./ClienteServicioPaquete.entity";

/**
 * Constructor para registros en BD de CLIENTE_SERVICIO_PERIODO
 */
@Entity("cliente_servicio_periodo")
export default class ClienteServicioPeriodo extends ABEModel {
  constructor(clienteServicioPaquete: Partial<ClienteServicioPeriodo>) {
    super();
    Object.assign(this, clienteServicioPaquete);
  }

  @Column()
  fechaInicio: Date;
  @Column()
  fechaFin: Date;

  @ManyToOne(
    () => ClienteServicio,
    (clienteServicio) => clienteServicio.clienteServicioPeriodos
  )
  @JoinColumn({ name: "clienteServicio", referencedColumnName: "id" })
  clienteServicio: ClienteServicio;

  @Column()
  inicioVigencia: Date;

  @Column()
  finVigencia: Date;

  @OneToMany(
    () => ClienteServicioPaquete,
    (clienteServicioPaquete) => clienteServicioPaquete.clienteServicioPeriodo
  )
  clienteServicioPaquetes: ClienteServicioPaquete[];
}
