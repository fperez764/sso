import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import GrupoTicket from "./GrupoTicket.entity";

@Entity("grupo_ticket_flujo_respuestas")
@Unique("UQ_GRUPOTICKET_ORDEN", ["orden", "grupo"])
export default class GrupoTicketFlujoRespuestas extends ABEModel {
  constructor(tRespuesta: Partial<GrupoTicketFlujoRespuestas>) {
    super();
    Object.assign(this, tRespuesta);
  }

  @Column()
  orden: number;

  @Column()
  area: string;

  @Column()
  accion: string;

  @Column() //vigencia en dias para responder
  vigenciaDias: number;

  @ManyToOne(() => GrupoTicket, { nullable: false })
  @JoinColumn({ name: "grupo", referencedColumnName: "nombre" })
  grupo: GrupoTicket;
}
