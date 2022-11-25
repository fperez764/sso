import { Column, Entity, Index, OneToMany } from "typeorm";
import SolicitudServicio from "../solicitudServicio/SolicitudServicio.entity";
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
