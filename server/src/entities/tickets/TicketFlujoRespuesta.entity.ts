import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import Servicio from "../servicio/Servicio.entity";
import TicketGrupo from "./TicketGrupo.entity";

@Entity("ticket_flujo_respuesta")
@Unique("UQ_ORDEN_GRUPOTICKET", ["orden", "grupo"])
export default class TicketFlujoRespuesta extends ABEModel {
  constructor(tRespuesta: Partial<TicketFlujoRespuesta>) {
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

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: "servicio", referencedColumnName: "nombre" })
  servicio: Servicio;

  @ManyToOne(() => TicketGrupo)
  @JoinColumn({ name: "grupo", referencedColumnName: "nombre" })
  grupo: TicketGrupo;
}
