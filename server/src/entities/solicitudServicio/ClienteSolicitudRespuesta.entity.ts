import { Expose } from "class-transformer";
import { Column, Entity, ManyToOne, Unique } from "typeorm";
import logger from "../../utils/logger";
import ABEModel from "../ABEModel/ABEModel";
import SolicitudFlujoRespuesta from "./SolicitudFlujoRespuesta.entity";
import ClienteSolicitudServicio from "./ClienteSolicitudServicio.entity";

export enum Estado {
  ACEPTADO = "ACEPTADO",
  RECHAZADO = "RECHAZADO",
  PENDIENTE = "PENDIENTE",
}
@Entity("cliente_solicitud_servicio_respuesta")
@Unique("UQ_ORDEN_CLIENTESOLICITUDSERVICIO", [
  "clienteSolicitudServicio",
  "orden",
])
export default class ClienteSolicitudRespuesta extends ABEModel {
  constructor(cSolRespuesta: Partial<ClienteSolicitudRespuesta>) {
    super();
    Object.assign(this, cSolRespuesta);
  }

  @Column()
  orden: number;

  @Column()
  area: string;

  @Column({
    type: "enum",
    enum: Estado,
    default: Estado.PENDIENTE,
  })
  estado: Estado;

  @Column({ nullable: true })
  fechaInicio: Date;

  @Column({ nullable: true })
  fechaFin: Date;

  @Expose() get fechaRespuesta(): Date {
    return this.fechaModificacion;
  }

  @Column()
  respuesta: string;

  @Column()
  accion: string;

  @ManyToOne(() => ClienteSolicitudServicio, (sS) => sS.respuestas, {
    nullable: false,
  })
  clienteSolicitudServicio: ClienteSolicitudServicio;

  @ManyToOne(() => SolicitudFlujoRespuesta)
  solicitudFlujoRespuesta: SolicitudFlujoRespuesta;
}
