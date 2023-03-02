import { Column, Entity, ManyToOne } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import ClienteSolicitud from "./ClienteSolicitud.entity";
import ClienteSolicitudRespuesta from "./ClienteSolicitudRespuesta.entity";

@Entity("cliente_solicitud_respuesta_comentario")
export default class ClienteSolicitudRespuestaComentario extends ABEModel {
  constructor(
    cSolicitudComentario: Partial<ClienteSolicitudRespuestaComentario>
  ) {
    super();
    Object.assign(this, cSolicitudComentario);
  }

  @Column()
  comentario: string;

  @ManyToOne(
    () => ClienteSolicitudRespuesta,
    (sSRespuesta) => sSRespuesta.comentarios,
    {
      nullable: false,
    }
  )
  clienteSolicitudRespuesta: ClienteSolicitudRespuesta;
}
