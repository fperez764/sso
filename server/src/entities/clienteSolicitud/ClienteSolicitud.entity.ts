import { Expose } from "class-transformer";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from "typeorm";
import logger from "../../utils/logger";
import ABEModel from "../ABEModel/ABEModel";
import Cliente from "../cliente/Cliente.entity";
import Servicio from "../servicio/Servicio.entity";
import User from "../User.entity";
import GrupoSolicitud from "./GrupoSolicitud.entity";
import ClienteSolicitudRespuesta, {
  Estado,
} from "./ClienteSolicitudRespuesta.entity";

//Un cliente solicita algun servicio
@Entity("cliente_solicitud")
@Unique("UQ_SOL_CLIENTE_SERVICIO", ["cliente", "servicio"])
export default class ClienteSolicitud extends ABEModel {
  constructor(sS: Partial<ClienteSolicitud>) {
    super();
    Object.assign(this, sS);
  }

  @Column() //TODO:Enum
  origen: string;

  @Column()
  prepagado: boolean;

  @Column()
  descripcion: string;

  @Column()
  recibido: boolean = false;

  @ManyToOne(() => Cliente, (cliente) => cliente.solicitudesServicio, {
    nullable: false,
  })
  @JoinColumn({ name: "cliente", referencedColumnName: "id" })
  cliente: Cliente;

  @ManyToOne(() => Servicio, { nullable: false })
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;

  @Expose() get url(): string {
    return `/ss/${this.grupo?.nombre || "?"}/${
      this.cliente?.nroDocumento || "?"
    }/${this.id}`;
  }

  @ManyToOne(() => GrupoSolicitud, (grupo) => grupo.solicitudesS, {
    nullable: false,
  })
  @JoinColumn({ name: "grupo", referencedColumnName: "nombre" })
  grupo: GrupoSolicitud;

  @OneToMany(
    () => ClienteSolicitudRespuesta,
    (respuesta) => respuesta.clienteSolicitud
  )
  respuestas: ClienteSolicitudRespuesta[];

  @Expose() get getRespuestasCount(): string {
    if (!this.respuestas) return "0/0";
    const aceptados = this.respuestas?.filter(
      (r) => r.estado === Estado.ACEPTADO
    );
    return `${aceptados.length}/${this.respuestas.length}`;
  }

  protected userAcepto: string;
  setUserVote(user: User) {
    if (!user) return "SIN RESPUESTAS";
    try {
      if (this.respuestas.length < 1) return "SIN RESPUESTAS";
      const index = this.respuestas?.findIndex(
        (v) => v.usuarioCreacion.username === user.username
      );
      this.userAcepto =
        index > -1 ? this.respuestas[index].estado : "NO ASIGNADO";
    } catch (error) {
      logger.error(
        `No se pudo verificar si el usuario tiene una respuesta en la solicitud err:${error}`
      );
      return "ERROR";
    }
  }
}
