import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
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
    try {
      return this.ticketService.getTickets(page, count, filterKey);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }
  @Get('/reporte')
  getTicketsReporte(@GetQueries() { filterKey }) {
    try {
      return this.ticketService.getTicketsReporte(filterKey);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Get('/asignados') //Asigandos + asignables
  getAsignados(
    @GetUser('username') username: string,
    @GetUser('area') area: string,
    @GetUser('departamento') dep: string,
    @GetQueries() { page, count, filterKey },
  ) {
    try {
      return this.ticketService.getTicketsAsignadosbles(page, count, username, area, dep);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Get('/tuyos')
  //Creados por ti enproceso+resueltos
  getTusTickets(@GetUser('username') username: string, @GetQueries() { page, count }) {
    try {
      return this.ticketService.getTusTickets(page, count, username);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Get('/respondidos')
  //asignados con respuesta en proceso
  getRespondidos(@GetUser('username') username: string, @GetQueries() { page, count }) {
    try {
      return this.ticketService.getTicketsRespondidos(page, count, username);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }

  @Get('/:idTicket')
  getTicket(@Param('idTicket') idTicket: string) {
    try {
      return this.ticketService.getTicket(parseInt(idTicket));
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Post()
  crearTicket(
    @GetUser('username') username: string,
    @Body() ticketDto: CreateTicketDto,
    @Body('modems') modems: ModemDto[],
  ) {
    try {
      return this.ticketService.crearTicket(username, ticketDto, modems);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Post('/resolver/:idTicket')
  resolverTicket(@GetUser('username') username: string, @Param('idTicket') idTicket: string) {
    try {
      this.ticketService.resolverTicket(parseInt(idTicket), username);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Put('/:idTicket')
  actualizarTicket(
    @GetUser('username') username: string,
    @Param('idTicket') idTicket: string,
    @Body() nTicket: EditTicketDto,
  ) {
    try {
      this.ticketService.actualizarTicket(parseInt(idTicket), nTicket, username);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Put('/:idTicket/anular')
  anularTicket(@GetUser('username') username: string, @Param('idTicket') idTicket: string) {
    try {
      this.ticketService.anularTicket(parseInt(idTicket), username);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Delete('/:idTicket')
  deleteTicket(@Param('idTicket') idTicket: string) {
    try {
      this.ticketService.deleteTicket(parseInt(idTicket));
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }

  @UseGuards(JwtGuard)
  @Post('/:idTicket/ordenMantenimiento')
  crearOrdenMantenimiento(
    @Param('idTicket') idTicket: string,
    @GetUser('username') username: string,
    @Body() odmDto: CreateODMDto,
  ) {
    try {
      return this.ticketService.crearODMTicket(parseInt(idTicket), username, odmDto);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }
  @UseGuards(JwtGuard)
  @Post('/:idTicket/actaEntregaEquipos')
  crearActaEntregaEquipos(
    @Param('idTicket') idTicket: string,
    @GetUser('username') username: string,
    @Body() odmDto: CreateODMDto,
  ) {
    try {
      return new NotFoundException('Por implementarse');
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }
  @UseGuards(JwtGuard)
  @Put('/:idTicket/ordenMantenimiento')
  async editarOrdenMantenimiento(
    @Param('idTicket') idTicket: string,
    @GetUser('username') username: string,
    @Body() odmDto: EditODMDto,
  ) {
    try {
      return await this.ticketService.editarODMTicket(parseInt(idTicket), username, odmDto);
    } catch (error) {
      return { status: error.status || 500, message: 'Algo salio mal ' + error };
    }
  }
}
