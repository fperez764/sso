import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Logger } from '@nestjs/common';
import { FlujoService } from './flujo.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import {
  CreateAccionFlujoDto,
  CreateFlujoDto,
  EditAccionFlujoDto,
  UpdateFlujoDto,
} from '../servicio/dto';
import { GetQueries, GetUser } from 'src/auth/decorator';
import { flujo_ticket_tipo_enum } from '@prisma/client';
import { CreateAccionDto, EditAccionDto } from '../ticket/dto';

@ApiTags('Tickets-Solicitudes')
@ApiBearerAuth()
@Controller('flujosTickets')
export class FlujoController {
  constructor(private flujoService: FlujoService) {}

  @UseGuards(JwtGuard)
  @Post('/')
  crearFlujoAcciones(
    @GetUser('username') username: string,
    @Body() flujo: CreateFlujoDto,
    @Body() acciones: CreateAccionDto[],
  ) {
    try {
      return this.flujoService.createFlujoAcciones(flujo, acciones, username);
    } catch (error) {
      return { status: error.status || 500, msg: 'Algo salio mal: ' + error };
    }
  }

  @Get('/')
  getFlujos(@GetQueries() { page, count, filterKey }) {
    try {
      return this.flujoService.getFlujos(page, count, filterKey);
    } catch (error) {
      return { status: error.status || 500, msg: 'Algo salio mal: ' + error };
    }
  }

  @Get('/tipos')
  getTipos() {
    try {
      return { list: Object.values(flujo_ticket_tipo_enum) };
    } catch (error) {
      return { status: error.status || 500, msg: 'Algo salio mal: ' + error };
    }
  }

  @Get('/:idFlujo')
  getFlujoAcciones(@Param('idFlujo') idFlujo: number) {
    try {
      return this.flujoService.getAccionesFlujo(idFlujo);
    } catch (error) {
      return { status: error.status || 500, msg: 'Algo salio mal: ' + error };
    }
  }

  @Get('/:idFlujo')
  getFlujoAccionesById(@Param('idFlujo') idFlujo: string) {
    try {
      return this.flujoService.getAccionesFlujo(parseInt(idFlujo));
    } catch (error) {
      return { status: error.status || 500, msg: 'Algo salio mal: ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Delete('/:idFlujo')
  eliminarFlujo(@GetUser('username') username: string, @Param('idFlujo') idFlujo: string) {
    try {
      return this.flujoService.deleteFlujo(parseInt(idFlujo), username);
    } catch (error) {
      return { status: error.status || 500, msg: 'Algo salio mal: ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Put('/:idFlujo')
  actualizarFlujo(
    @GetUser('username') username: string,
    @Param('idFlujo') idFlujo: string,
    @Body() flujo: UpdateFlujoDto,
  ) {
    try {
      return this.flujoService.updateFlujo(parseInt(idFlujo), flujo, username);
    } catch (error) {
      return { status: error.status || 500, msg: 'Algo salio mal: ' + error };
    }
  }

  @Get('/servicios/:nombreServicio')
  getFlujosPorServicio(@Body() nombreServicio: string) {
    try {
      return this.flujoService.getFlujosPorServicio(nombreServicio);
    } catch (error) {
      return { status: error.status || 500, msg: 'Algo salio mal: ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Post('/acciones/')
  async insertarAccionFlujo(
    @GetUser('username') username: string,
    @Body() newAccion: CreateAccionFlujoDto,
  ) {
    try {
      await this.flujoService.insertarAccionFlujo(newAccion, username);
      return { status: 201, message: 'Acción agregada correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @UseGuards(JwtGuard)
  @Put('/acciones/:idAccion')
  async actualizarFlujoAccion(
    @GetUser('username') username: string,
    @Param('idAccion') idAccion: string,
    @Body() newAccion: EditAccionFlujoDto,
  ) {
    try {
      await this.flujoService.updateAccionFlujo(parseInt(idAccion), newAccion, username);
      return { status: 200, message: 'Acción actualizada correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @UseGuards(JwtGuard)
  @Delete('/acciones/:idAccion')
  async eliminarFlujoAccion(
    @GetUser('username') username: string,
    @Param('idAccion') idTicket: string,
  ) {
    try {
      await this.flujoService.anularPasoAccion(parseInt(idTicket), username);
      return { status: 200, message: 'Acción eliminada correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }
}
