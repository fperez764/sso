import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { TicketService } from './ticket.service';
import { GetQueries, GetUser } from 'src/auth/decorator';
import { CreateTicketDto, EditTicketDto } from './dto';
import { ModemDto } from '../cliente/dto/modem.dto';
import { CreateODMDto, EditODMDto } from './dto/odm.dto';

@ApiTags('Tickets-Solicitudes')
@ApiBearerAuth()
@Controller('tickets')
export class TicketController {
  constructor(private ticketService: TicketService) {}

  @Get()
  getTickets(@GetQueries() { page, count, filterKey }) {
    return this.ticketService.getTickets(page, count, filterKey);
  }
  @Get('/reporte')
  getTicketsReporte(@GetQueries() { filterKey }) {
    return this.ticketService.getTicketsReporte(filterKey);
  }

  @UseGuards(JwtGuard)
  @Get('/asignados') //Asigandos + asignables
  getAsignados(
    @GetUser('username') username: string,
    @GetUser('area') area: string,
    @GetUser('departamento') dep: string,
    @GetQueries() { page, count, filterKey },
  ) {
    return this.ticketService.getTicketsAsignadosbles(page, count, username, area, dep);
  }

  @UseGuards(JwtGuard)
  @Get('/tuyos')
  //Creados por ti enproceso+resueltos
  getTusTickets(@GetUser('username') username: string, @GetQueries() { page, count }) {
    return this.ticketService.getTusTickets(page, count, username);
  }

  @UseGuards(JwtGuard)
  @Get('/respondidos')
  //asignados con respuesta en proceso
  getRespondidos(@GetUser('username') username: string, @GetQueries() { page, count }) {
    return this.ticketService.getTicketsRespondidos(page, count, username);
  }

  @Get('/:idTicket')
  getTicket(@Param('idTicket') idTicket: string) {
    return this.ticketService.getTicket(parseInt(idTicket));
  }

  @UseGuards(JwtGuard)
  @Post()
  crearTicket(
    @GetUser('username') username: string,
    @Body() ticketDto: CreateTicketDto,
    @Body('modems') modems: ModemDto[],
  ) {
    return this.ticketService.crearTicket(username, ticketDto, modems);
  }

  @UseGuards(JwtGuard)
  @Post('/resolver/:idTicket?')
  resolverTicket(
    @GetUser('username') username: string,
    @Param('idTicket') idTicket: string,
    @Query('tipo') tipo: string,
  ) {
    this.ticketService.resolverTicket(parseInt(idTicket), tipo, username);
  }

  @UseGuards(JwtGuard)
  @Put('/:idTicket')
  actualizarTicket(
    @GetUser('username') username: string,
    @Param('idTicket') idTicket: string,
    @Body() nTicket: EditTicketDto,
  ) {
    this.ticketService.actualizarTicket(parseInt(idTicket), nTicket, username);
  }

  @UseGuards(JwtGuard)
  @Put('/:idTicket/anular')
  anularTicket(@GetUser('username') username: string, @Param('idTicket') idTicket: string) {
    this.ticketService.anularTicket(parseInt(idTicket), username);
  }

  @UseGuards(JwtGuard)
  @Delete('/:idTicket')
  deleteTicket(@Param('idTicket') idTicket: string) {
    this.ticketService.deleteTicket(parseInt(idTicket));
  }

  @UseGuards(JwtGuard)
  @Post('/:idTicket/ordenMantenimiento')
  crearOrdenMantenimiento(
    @Param('idTicket') idTicket: string,
    @GetUser('username') username: string,
    @Body() odmDto: CreateODMDto,
  ) {
    return this.ticketService.crearODMTicket(parseInt(idTicket), username, odmDto);
  }
  @UseGuards(JwtGuard)
  @Post('/:idTicket/actaEntregaEquipos')
  crearActaEntregaEquipos(
    @Param('idTicket') idTicket: string,
    @GetUser('username') username: string,
    @Body() odmDto: CreateODMDto,
  ) {
    return new NotFoundException('Por implementarse');
  }
  @UseGuards(JwtGuard)
  @Put('/:idTicket/ordenMantenimiento')
  async editarOrdenMantenimiento(
    @Param('idTicket') idTicket: string,
    @GetUser('username') username: string,
    @Body() odmDto: EditODMDto,
  ) {
    return await this.ticketService.editarODMTicket(parseInt(idTicket), username, odmDto);
  }
}
