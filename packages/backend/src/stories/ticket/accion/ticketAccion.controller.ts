import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { TicketAccionService } from './ticketAccion.service';
import { CreateAccionDto, CreateComentarioDto, EditAccionDto, RespuestaDto } from '../dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Tickets-Solicitudes')
@ApiBearerAuth()
@Controller('ticketsAcciones')
@UseGuards(JwtGuard)
export class TicketAccionController {
  constructor(private ticketAccionService: TicketAccionService) {}

  @Post('/:idTicketAccion/comentar')
  @UseInterceptors(FileInterceptor('imagen'))
  async comentarAccion(
    @GetUser('username') username: string,
    @Body() comentario: any,
    @Param('idTicketAccion') idAccion: string,
    @UploadedFile() imagen: Express.Multer.File,
  ) {
    try {
      await this.ticketAccionService.comentarAccion(
        parseInt(idAccion),
        username,
        comentario.comentario,
        imagen,
      );
      return { status: 200, message: 'Comentario guardado correctamente.' };
    } catch (error) {
      return {
        status: error.status || 500,
        msg: 'Algo salio mal al guardar el comentario.' + error.message,
      };
    }
  }

  @Get('comentario/:idComentario')
  async obtenerComentario(@Param('idComentario') idComentario: string) {
    try {
      return await this.ticketAccionService.obtenerImagenComentario(parseInt(idComentario));
    } catch (error) {
      return {
        status: error.status || 500,
        msg: 'Algo salio mal al obtener el comentario.' + error.message,
      };
    }
  }

  @Post('/:idTicketAccionAnterior')
  async insertarAccionTicket(
    @GetUser('username') username: string,
    @Param('idTicketAccionAnterior') idAccion: string,
    @Body() newAccion: CreateAccionDto,
  ) {
    //    try {
    await this.ticketAccionService.insertarAccionTicket(parseInt(idAccion), username, newAccion);
    return { status: 201, message: 'Accion agregada correctamente.' };
    // } catch (err) {
    //   return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    // }
  }

  @Put('/:idTicketAccion')
  async actualizarTicketAccion(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idTicket: string,
    @Body() newAccion: EditAccionDto,
  ) {
    try {
      await this.ticketAccionService.actualizarTicketAccion(
        parseInt(idTicket),
        username,
        newAccion,
      );
      return { status: 200, message: 'Accion actualizada correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @Post('/:idTicketAccion/iniciar')
  async iniciarEspera(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idTicket: string,
  ) {
    try {
      await this.ticketAccionService.iniciarEspera(parseInt(idTicket), username);
      return { status: 200, message: 'Vigencia iniciada correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @Post('/:idTicketAccion/leido')
  async marcarComoLeido(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
  ) {
    try {
      await this.ticketAccionService.marcarComoLeido(parseInt(idAccion), username);
      return { status: 200, message: 'Marcado como leido correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @Post('/:idTicketAccion/asignar')
  async asignar(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
    @Body('usuarioAsignado') usuarioAsignado: string,
  ) {
    try {
      await this.ticketAccionService.asignar(parseInt(idAccion), username, usuarioAsignado);
      return { status: 200, message: 'Asignado correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @Post('/:idTicketAccion/responder')
  async responder(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
    @Body('respuesta') respuesta: string,
  ) {
    try {
      await this.ticketAccionService.responder(parseInt(idAccion), respuesta, username);
      return { status: 200, message: 'Respuesta guardada correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @Post('/:idTicketAccion/rechazar')
  async rechazar(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
    @Body('respuesta') respuesta: string,
  ) {
    try {
      await this.ticketAccionService.rechazar(parseInt(idAccion), respuesta, username);
      return { status: 200, message: 'Respuesta guardada correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @Delete('/:idTicketAccion')
  async softDeletePasoAccion(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
  ) {
    try {
      await this.ticketAccionService.anularPasoAccion(parseInt(idAccion), username);
      return { status: 200, message: 'Paso anulado correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @Delete('/:idTicketAccion/eliminar')
  async hardDeletePasoAccion(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
  ) {
    try {
      await this.ticketAccionService.eliminarPasoAccion(parseInt(idAccion), username);
      return { status: 200, message: 'Paso borrado de base de datos correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @Get('/:idTicketAccion')
  async getTicketAccion(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
  ) {
    try {
      return await this.ticketAccionService.getAccion(parseInt(idAccion), username);
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }

  @Put('/comentario/:idComentario')
  async anularComentario(
    @GetUser('username') username: string,
    @Param('idComentario') idComentario: string,
  ) {
    try {
      await this.ticketAccionService.anularComentario(parseInt(idComentario), username);
      return { status: 200, message: 'Comentario anulado correctamente.' };
    } catch (err) {
      return { status: err.status | 500, message: 'Algo salio mal: ' + err };
    }
  }
}
