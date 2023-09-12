import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ClienteServicioService } from './clienteServicio.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { CreateClienteServicioDto, UpdateClienteServicioDto } from './dto';
import { ModemDto } from './dto/modem.dto';
import ClienteServicioModemEntity from './clienteServicioModem.entity';

@ApiTags('Clientes')
@ApiBearerAuth()
@Controller('clienteServicios')
@UseGuards(JwtGuard)
export class ClienteServicioController {
  constructor(private cliSerService: ClienteServicioService) {}
  @Get(':idClienteServicio')
  getClienteServicio(@Param('idClienteServicio') id: string) {
      return this.cliSerService.getClienteServicio(parseInt(id));
  }

  @Post()
  crearClienteServicio(
    @GetUser('username') username: string,
    @Body() servicio: CreateClienteServicioDto,
  ) {
      return this.cliSerService.agregarClienteServicio(username, servicio);
  }

  @Put(':idClienteServicio')
  modificarClienteServicio(
    @GetUser('username') username: string,
    @Param('idClienteServicio') idClienteServicio: string,
    @Body() newCliSer: UpdateClienteServicioDto,
  ) {
      return this.cliSerService.modificarClienteServicio(
        parseInt(idClienteServicio),
        newCliSer,
        username,
      );
  }

  @Delete(':idClienteServicio')
  bajaClienteServicio(
    @GetUser('username') username: string,
    @Param('idClienteServicio') idClienteServicio: string,
  ) {
      return this.cliSerService.bajaClienteServicio(parseInt(idClienteServicio), username);
  }

  @Post(':idClienteServicio/modem')
  async asignarModemClienteServicio(
    @GetUser('username') username: string,
    @Param('idClienteServicio') idClienteServicio: string,
    @Body() modem: ModemDto,
  ) {
      return new ClienteServicioModemEntity(
        await this.cliSerService.asignarModemClienteServicio(
          parseInt(idClienteServicio),
          username,
          modem,
        ),
      );
  }

  @Delete(':idClienteServicio/modem/:mac')
  async liberarModemClienteServicio(
    @GetUser('username') username: string,
    @Param('idClienteServicio') idClienteServicio: string,
    @Param('mac') mac: string,
  ) {
      return new ClienteServicioModemEntity(
        await this.cliSerService.liberarModemClienteServicio(
          parseInt(idClienteServicio),
          username,
          mac,
        ),
      );
  }
}
