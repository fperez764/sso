import { Entity, Index, OneToMany } from "typeorm";
import ClienteSolicitudServicio from "../solicitudServicio/ClienteSolicitudServicio.entity";
import ClienteServicio from "./ClienteServicio.entity";
import Persona from "../ABEModel/Persona";

@Entity("cliente")
@Index(["nombreCompleto", "nroDocumento"], { unique: true })
export default class Cliente extends Persona {
  constructor(cliente: Partial<Cliente>) {
    super(cliente);
    Object.assign(this, cliente);
  }

  @OneToMany(
    () => ClienteSolicitudServicio,
    (solicitudServicio) => solicitudServicio.cliente
  )
  solicitudesServicio: ClienteSolicitudServicio[];

  @OneToMany(
    () => ClienteServicio,
    (clienteServicio) => clienteServicio.cliente
  )
  clienteServicios: ClienteServicio[];
}
