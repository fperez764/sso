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
      return this.flujoService.createFlujoAcciones(flujo, acciones, username);
  }

  @Get('/')
  getFlujos(@GetQueries() { page, count, filterKey }) {
      return this.flujoService.getFlujos(page, count, filterKey);
  }

  @Get('/tipos')
  getTipos() {
      return { list: Object.values(flujo_ticket_tipo_enum) };
  }

  @Get('/:idFlujo')
  getFlujoAcciones(@Param('idFlujo') idFlujo: number) {
      return this.flujoService.getAccionesFlujo(idFlujo);
  }

  @Get('/:idFlujo')
  getFlujoAccionesById(@Param('idFlujo') idFlujo: string) {
      return this.flujoService.getAccionesFlujo(parseInt(idFlujo));
  }

  @UseGuards(JwtGuard)
  @Delete('/:idFlujo')
  eliminarFlujo(@GetUser('username') username: string, @Param('idFlujo') idFlujo: string) {
      return this.flujoService.deleteFlujo(parseInt(idFlujo), username);
  }

  @UseGuards(JwtGuard)
  @Put('/:idFlujo')
  actualizarFlujo(
    @GetUser('username') username: string,
    @Param('idFlujo') idFlujo: string,
    @Body() flujo: UpdateFlujoDto,
  ) {
      return this.flujoService.updateFlujo(parseInt(idFlujo), flujo, username);
  }

  @Get('/servicios/:nombreServicio')
  getFlujosPorServicio(@Body() nombreServicio: string) {
      return this.flujoService.getFlujosPorServicio(nombreServicio);
  }

  @UseGuards(JwtGuard)
  @Post('/acciones/')
  async insertarAccionFlujo(
    @GetUser('username') username: string,
    @Body() newAccion: CreateAccionFlujoDto,
  ) {
      await this.flujoService.insertarAccionFlujo(newAccion, username);
      return { status: 201, message: 'Acción agregada correctamente.' };
  }

  @UseGuards(JwtGuard)
  @Put('/acciones/:idAccion')
  async actualizarFlujoAccion(
    @GetUser('username') username: string,
    @Param('idAccion') idAccion: string,
    @Body() newAccion: EditAccionFlujoDto,
  ) {
      await this.flujoService.updateAccionFlujo(parseInt(idAccion), newAccion, username);
      return { status: 200, message: 'Acción actualizada correctamente.' };
  }

  @UseGuards(JwtGuard)
  @Delete('/acciones/:idAccion')
  async eliminarFlujoAccion(
    @GetUser('username') username: string,
    @Param('idAccion') idTicket: string,
  ) {
      await this.flujoService.anularPasoAccion(parseInt(idTicket), username);
      return { status: 200, message: 'Acción eliminada correctamente.' };
  }
}
