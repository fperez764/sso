import { Entity, Index, OneToMany } from "typeorm";
import ClienteSolicitud from "../clienteSolicitud/ClienteSolicitud.entity";
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
    () => ClienteSolicitud,
    (clienteSolicitud) => clienteSolicitud.cliente
  )
  solicitudesServicio: ClienteSolicitud[];

  @OneToMany(
    () => ClienteServicio,
    (clienteServicio) => clienteServicio.cliente
  )
  clienteServicios: ClienteServicio[];
}
