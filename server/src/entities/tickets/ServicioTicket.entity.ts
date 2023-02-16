import { Exclude, Expose } from "class-transformer";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import logger from "../../utils/logger";
import ABEModel from "../ABEModel/ABEModel";
import User from "../User.entity";
import TicketGrupo from "./TicketGrupo.entity";
import ServicioTicketRespuesta, {
  Estado,
} from "./ServicioTicketRespuesta.entity";
import TicketComentario from "./ServicioTicketComentario.entity";
import ClienteServicio from "../cliente/ClienteServicio.entity";

@Entity("servicio_ticket")
export default class ServicioTicket extends ABEModel {
  constructor(ticket: Partial<ServicioTicket>) {
    super();
    Object.assign(this, ticket);
  }

  @Column() //TODO:Enum
  origen: string;

  @Column()
  descripcion: string;

  @ManyToOne(
    () => ClienteServicio,
    (clienteServicio) => clienteServicio.tickets
  )
  @JoinColumn({ name: "servicio", referencedColumnName: "id" })
  clienteServicio: ClienteServicio;

  @Expose() get url(): string {
    return `/ticket/${this.grupo?.nombre || "?"}/${
      this.clienteServicio?.id || "?"
    }/${this.id}`;
  }

  @ManyToOne(() => TicketGrupo, (grupo) => grupo.tickets)
  @JoinColumn({ name: "grupo", referencedColumnName: "nombre" })
  grupo: TicketGrupo;

  @OneToMany(() => ServicioTicketRespuesta, (respuesta) => respuesta.ticket)
  respuestas: ServicioTicketRespuesta[];

  @Exclude()
  @OneToMany(() => TicketComentario, (comentario) => comentario.ticket)
  comentarios: TicketComentario[];

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
        `No se pudo verificar si el usuario tiene una respuesta en el ticket err:${error}`
      );
      return "ERROR";
    }
  }
}
