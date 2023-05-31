import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import ABEModel from "../ABEModel/ABEModel";
import ClienteServicio from "./ClienteServicio.entity";
import { Expose } from "class-transformer";
import { Matches } from "class-validator";
import ClienteSolicitudRespuesta from "../clienteSolicitud/ClienteSolicitudRespuesta.entity";

export enum Hubs {
  NEWTEC = "NEWTEC",
  GILAT = "GILAT",
}

export enum ManufacterMacs {
  NEWTEC = "000639",
  GILAT = "00A0AC",
}

@Entity("cliente_servicio_modem")
export default class ClienteServicioModem extends ABEModel {
  constructor(clienteServicioModem: Partial<ClienteServicioModem>) {
    super();
    Object.assign(this, clienteServicioModem);
  }

  @ManyToOne(() => ClienteServicio, { nullable: false })
  @JoinColumn({ name: "clienteServicio", referencedColumnName: "id" })
  clienteServicio: ClienteServicio;

  @ManyToOne(() => ClienteSolicitudRespuesta)
  @JoinColumn({ name: "clienteSolicitudRespuesta", referencedColumnName: "id" })
  clienteSolicitudRespuesta: ClienteSolicitudRespuesta;

  @Index()
  @Matches(/^(([0-9A-Fa-f]{2}[:]){5}|([0-9A-Fa-f]{2}){5})([0-9A-Fa-f]{2})$/, {
    message:
      "Una MAC debe tener 6 pares de números hexadecimales, separados por ':' (NEWTEC) o sin separaciones (GILAT).",
  })
  @Column()
  mac: string;

  @Column("boolean", { default: true })
  autoAdministrado: boolean;

  @Column({nullable: true})
  @Matches(/-?(?:[1-8]\d|90)\.\d{1,10},\s*-?(?:1[0-7]\d|\d{1,2})\.\d{1,10}$/)
  coordenadas: string;

  @Expose() get hub(): string {
    let macClean = this.mac.replaceAll(":", "");
    macClean = macClean.replaceAll("-", "");
    macClean = macClean.substring(0, 6);
    switch (macClean) {
      case ManufacterMacs.GILAT:
        return Hubs.GILAT;
      case ManufacterMacs.NEWTEC:
        return Hubs.NEWTEC;
      default:
        return "Hub no identificado";
    }
  }
}
