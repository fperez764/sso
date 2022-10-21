import { Exclude, Expose } from "class-transformer";
import {
  Column,
  Entity,
  EntitySchemaEmbeddedColumnOptions,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Cliente from "../cliente/Cliente.entity";
import Servicio from "../servicio/Servicio.entity";
import User from "../User.entity";
import SolicitudGrupo from "./SolicitudGrupo.entity";
import SolicitudRespuesta, { Estado } from "./SolicitudRespuesta.entity";
import SolicitudServicioComentario from "./SolicitudServicioComentario.entity";

export enum TipoSolicitud {
  FACTIBILIDAD = "FACTIBILIDAD",
  ALTA = "ALTA",
  BAJA = "BAJA",
  CORTE_TEMPORAL = "CORTE_TEMPORAL",
  CORTE_MANTENIMIENTO = "CORTE_MANTENIMIENTO",
  REHABILITACION = "REHABILITACION",
  MODIFICACION = "MODIFICACION",
  ALTA_EVENTUAL = "ALTA_EVENTUAL",
  ENTREGA_EQUIPOS = "ENTREGA_EQUIPOS",
  RETIRO_EQUIPOS = "RETIRO_EQUIPOS",
  PROVISIONAMIENTO = "PROVISIONAMIENTO",
  PRUEBAS = "PRUEBAS",
  OTRO = "OTRO",
}

@Entity("solicitud_servicio")
export default class SolicitudServicio extends ABEModel {
  constructor(sS: Partial<SolicitudServicio>) {
    super();
    Object.assign(this, sS);
  }

  @Column() //TODO:Enum
  origen: string;

  @Column({
    type: "enum",
    enum: TipoSolicitud,
    default: TipoSolicitud.PROVISIONAMIENTO,
  })
  tipo: TipoSolicitud;

  @Column()
  prepagado: boolean;

  @Column()
  descripcion: string;

  @Column()
  recibido: boolean = false;

  @ManyToOne(() => Cliente, (cliente) => cliente.solicitudesS)
  @JoinColumn({ name: "cliente", referencedColumnName: "id" })
  cliente: Cliente;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;

  @Expose() get url(): string {
    return `/ss/${this.grupo?.name || "?"}/${
      this.cliente?.nroDocumento || "?"
    }/${this.id}`;
  }

  @ManyToOne(() => SolicitudGrupo, (grupo) => grupo.solicitudesS)
  @JoinColumn({ name: "grupo", referencedColumnName: "name" })
  grupo: SolicitudGrupo;

  @OneToMany(
    () => SolicitudRespuesta,
    (respuesta) => respuesta.solicitudServicio
  )
  respuestas: SolicitudRespuesta[];

  @Exclude()
  @OneToMany(
    () => SolicitudServicioComentario,
    (comentario) => comentario.solicitudServicio
  )
  comentarios: SolicitudServicioComentario[];

  @Expose() get getComentariosCount(): number {
    return this.comentarios ? this.comentarios.length : 0;
  }

  @Expose() get getRespuestasCount(): string {
    if (!this.respuestas) return "0/0";
    const aceptados = this.respuestas?.filter(
      (r) => r.estado === Estado.ACEPTADO
    );
    return `${aceptados.length}/${this.respuestas.length}`;
  }

  protected userAcepto: string;
  setUserVote(user: User) {
    const index = this.respuestas?.findIndex(
      (v) => v.usuarioCreacion.username === user.username
    );
    this.userAcepto =
      index > -1 ? this.respuestas[index].estado : "NO ASIGNADO";
  }
}
