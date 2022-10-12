import {
  Column,
  Entity,
  OneToMany,
} from "typeorm";
import SolicitudServicio from "../solicitudServicio/SolicitudServicio.entity";
import ClienteServicio from "./ClienteServicio.entity";
import Persona from "../ABEModel/Persona";

@Entity("cliente")
export default class Cliente extends Persona {
  constructor(cliente: Partial<Cliente>) {
    super(cliente);
    Object.assign(this, cliente);
  }

  @Column()
  tipoCliente: string;

  @OneToMany(
    () => SolicitudServicio,
    (solicitudServicio) => solicitudServicio.cliente
  )
  solicitudesS: SolicitudServicio[];

  @OneToMany(
    () => ClienteServicio,
    (clienteServicio) => clienteServicio.cliente
  )
  clienteServicios: ClienteServicio[];
}
