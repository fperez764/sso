import { Exclude, Expose } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import logger from "../../utils/logger";
import ABEModel from "../ABEModel/ABEModel";
import Cliente from "../cliente/Cliente.entity";
import Servicio from "../servicio/Servicio.entity";
import User from "../User.entity";
import SolicitudGrupo from "./SolicitudGrupo.entity";
import ClienteSolicitudRespuesta, {
  Estado,
} from "./ClienteSolicitudRespuesta.entity";
import ClienteSolicitudComentario from "./ClienteSolicitudServicioComentario.entity";

//Un cliente solicita algun servicio
@Entity("cliente_solicitud_servicio")
export default class ClienteSolicitudServicio extends ABEModel {
  constructor(sS: Partial<ClienteSolicitudServicio>) {
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

  @ManyToOne(() => Cliente, (cliente) => cliente.solicitudesServicio)
  @JoinColumn({ name: "cliente", referencedColumnName: "id" })
  cliente: Cliente;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;

  @Expose() get url(): string {
    return `/ss/${this.grupo?.nombre || "?"}/${
      this.cliente?.nroDocumento || "?"
    }/${this.id}`;
  }

  @ManyToOne(() => SolicitudGrupo, (grupo) => grupo.solicitudesS)
  @JoinColumn({ name: "grupo", referencedColumnName: "nombre" })
  grupo: SolicitudGrupo;

  @OneToMany(
    () => ClienteSolicitudRespuesta,
    (respuesta) => respuesta.clienteSolicitudServicio
  )
  respuestas: ClienteSolicitudRespuesta[];

  @Exclude()
  @OneToMany(
    () => ClienteSolicitudComentario,
    (comentario) => comentario.clienteSolicitudServicio
  )
  comentarios: ClienteSolicitudComentario[];

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
