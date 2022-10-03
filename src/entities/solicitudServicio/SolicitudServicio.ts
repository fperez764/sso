import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import User from "../User";
import SolicitudGrupo from "./SolicitudGrupo";
import SolicitudRespuesta from "./SolicitudRespuesta";

@Entity("SolicitudServicio")
export default class SolicitudServicio extends ABEModel {
  static user: any;
  constructor(sS: Partial<SolicitudServicio>) {
    super();
    Object.assign(this, sS);
  }

  @Index()
  @Column()
  origen: string;

  @Column()
  prepagado: boolean;

  @Column()
  descripcion: string;

  @Column()
  recibido: boolean = false;

  @ManyToOne(() => User, (user) => user.solicitudesS)
  @JoinColumn({ name: "username", referencedColumnName: "username" })
  user: User;

  @BeforeInsert()
  async setUsuarioCreacion() {
    this.usuarioCreacion = this.user.username;
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

export enum areasAceptacion {
  INSTALADOR = 0,
  COMERCIAL,
  DOCUMENTOS_COMERCIAL,
  DOCUMENTOS_INSTALADOR,
  MODEM_ALMACEN,
  MODEM_INSTALADOR,
  INSTALADO,
  ACTIVADO,
  DOCUMENTOS_ENTREGADOSEGADOS,
}

export enum tipo {
  FACTIBILIDAD,
  ALTA,
  BAJA,
  CORTE_TEMPORAL,
  CORTE_MANTENIMIENTO,
  REHABILITACION,
  MODIFICACION,
  ALTA_EVENTUAL,
  ENTREGA_EQUIPOS,
  RETIRO_EQUIPOS,
  PROVISIONAMIENTO,
  PRUEBAS,
  OTRO,
}
