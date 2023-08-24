import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateServicioDto, UpdateServicioDto } from './dto/servicio.dto';
import { ServicioService } from './servicio.service';

@ApiTags('Servicios')
@ApiBearerAuth()
@Controller('servicios')
@UseGuards(JwtGuard)
export class ServicioController {
  constructor(private servicioService: ServicioService) {}
  @Get('/')
  getServicios() {
    return this.servicioService.getServicios();
  }
  @Get('/:idservicio')
  getServicio(@Param('idServicio') id: string) {
    return this.servicioService.getServicio(parseInt(id));
  }
  @Post('/')
  crearServicio(@GetUser('username') username: string, @Body() servicio: CreateServicioDto) {
    return this.servicioService.crearServicio(servicio, username);
  }
  @Put('/:idservicio')
  actualizarServicio(
    @Param('idServicio') id: string,
    @GetUser('username') username: string,
    @Body() servicio: UpdateServicioDto,
  ) {
    return this.servicioService.actualizarServicio(parseInt(id), servicio, username);
  }
}
