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
      await this.ticketAccionService.comentarAccion(
        parseInt(idAccion),
        username,
        comentario.comentario,
        imagen,
      );
      return { status: 200, message: 'Comentario guardado correctamente.' };
  }

  @Get('comentario/:idComentario')
  async obtenerComentario(@Param('idComentario') idComentario: string) {
      return await this.ticketAccionService.obtenerImagenComentario(parseInt(idComentario));
  }

  @Post('/:idTicketAccionAnterior')
  async insertarAccionTicket(
    @GetUser('username') username: string,
    @Param('idTicketAccionAnterior') idAccion: string,
    @Body() newAccion: CreateAccionDto,
  ) {
    await this.ticketAccionService.insertarAccionTicket(parseInt(idAccion), username, newAccion);
    return { status: 201, message: 'Accion agregada correctamente.' };
  }

  @Put('/:idTicketAccion')
  async actualizarTicketAccion(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idTicket: string,
    @Body() newAccion: EditAccionDto,
  ) {
      await this.ticketAccionService.actualizarTicketAccion(
        parseInt(idTicket),
        username,
        newAccion,
      );
      return { status: 200, message: 'Accion actualizada correctamente.' };
  }

  @Post('/:idTicketAccion/iniciar')
  async iniciarEspera(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idTicket: string,
  ) {
      await this.ticketAccionService.iniciarEspera(parseInt(idTicket), username);
      return { status: 200, message: 'Vigencia iniciada correctamente.' };
  }

  @Post('/:idTicketAccion/leido')
  async marcarComoLeido(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
  ) {
      await this.ticketAccionService.marcarComoLeido(parseInt(idAccion), username);
      return { status: 200, message: 'Marcado como leido correctamente.' };
  }

  @Post('/:idTicketAccion/asignar')
  async asignar(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
    @Body('usuarioAsignado') usuarioAsignado: string,
  ) {
      await this.ticketAccionService.asignar(parseInt(idAccion), username, usuarioAsignado);
      return { status: 200, message: 'Asignado correctamente.' };
  }

  @Post('/:idTicketAccion/responder')
  async responder(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
    @Body('respuesta') respuesta: string,
  ) {
      await this.ticketAccionService.responder(parseInt(idAccion), respuesta, username);
      return { status: 200, message: 'Respuesta guardada correctamente.' };
  }

  @Post('/:idTicketAccion/rechazar')
  async rechazar(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
    @Body('respuesta') respuesta: string,
  ) {
      await this.ticketAccionService.rechazar(parseInt(idAccion), respuesta, username);
      return { status: 200, message: 'Respuesta guardada correctamente.' };
  }

  @Delete('/:idTicketAccion')
  async softDeletePasoAccion(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
  ) {
      await this.ticketAccionService.anularPasoAccion(parseInt(idAccion), username);
      return { status: 200, message: 'Paso anulado correctamente.' };
  }

  @Delete('/:idTicketAccion/eliminar')
  async hardDeletePasoAccion(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
  ) {
      await this.ticketAccionService.eliminarPasoAccion(parseInt(idAccion), username);
      return { status: 200, message: 'Paso borrado de base de datos correctamente.' };
  }

  @Get('/:idTicketAccion')
  async getTicketAccion(
    @GetUser('username') username: string,
    @Param('idTicketAccion') idAccion: string,
  ) {
      return await this.ticketAccionService.getAccion(parseInt(idAccion), username);
  }

  @Put('/comentario/:idComentario')
  async anularComentario(
    @GetUser('username') username: string,
    @Param('idComentario') idComentario: string,
  ) {
      await this.ticketAccionService.anularComentario(parseInt(idComentario), username);
      return { status: 200, message: 'Comentario anulado correctamente.' };
  }
}
