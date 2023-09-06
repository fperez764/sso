import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ModemDto } from 'src/stories/cliente/dto/modem.dto';

export enum ManufacterMacs {
  NEWTEC = '000639',
  GILAT = '00A0AC',
}

@Injectable()
export class HubsService {
  constructor(private readonly httpService: HttpService) {}
  async getModemInfo(modem: ModemDto) {
    const newtec = modem.mac.replace(':', '').replace('-', '').includes(ManufacterMacs.NEWTEC);
    return this.httpService.get(
      `http://contador.abe.bo/api/${newtec ? 'newtec' : 'gilat'}/${modem.mac}`,
    );
  }
}
