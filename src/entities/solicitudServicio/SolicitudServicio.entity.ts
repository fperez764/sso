import { Expose } from "class-transformer";
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Cliente from "../cliente/Cliente.entity";
import Servicio from "../servicio/Servicio.entity";
import User from "../User.entity";
import SolicitudGrupo from "./SolicitudGrupo.entity";
import SolicitudRespuesta from "./SolicitudRespuesta.entity";

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
  static user: any;
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

  @ManyToOne(() => User, (user) => user.solicitudesS)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @ManyToOne(() => Cliente, (cliente) => cliente.solicitudesS)
  @JoinColumn({ name: "cliente", referencedColumnName: "id" })
  cliente: Cliente;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: "servicio", referencedColumnName: "descripcion" })
  servicio: Servicio;

  @BeforeInsert()
  async setUsuarioCreacion() {
    this.usuarioCreacion = this.user.username;
  }

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
}
