import { ClienteServicioModem } from '@prisma/client';
import { Expose } from 'class-transformer';

export enum Hubs {
  NEWTEC = 'NEWTEC',
  GILAT = 'GILAT',
}

export enum ManufacterMacs {
  NEWTEC = '000639',
  GILAT = '00A0AC',
}

export default class ClienteServicioModemEntity {
  constructor(clienteServicioModem: Partial<ClienteServicioModem>) {
    Object.assign(this, clienteServicioModem);
  }
  id: number;
  fechaCreacion: Date;
  fechaModificacion: Date;
  fechaBaja: Date | null;
  mac: string;
  autoAdministrado: boolean;
  coordenadas: string | null;
  usuarioCreacion: string;
  usuarioBaja: string | null;
  idClienteServicio: number;
  idClienteSolicitudAccion: number;

  @Expose() get hub(): string {
    let macClean = this.mac.replace(':', '');
    macClean = macClean.replace('-', '');
    macClean = macClean.substring(0, 6);
    switch (macClean) {
      case ManufacterMacs.GILAT:
        return Hubs.GILAT;
      case ManufacterMacs.NEWTEC:
        return Hubs.NEWTEC;
      default:
        return 'Hub no identificado';
    }
  }
}
