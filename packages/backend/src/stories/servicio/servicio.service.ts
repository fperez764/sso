import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/models/prisma/prisma.service';
import { CreateServicioDto, UpdateServicioDto } from './dto/servicio.dto';

@Injectable()
export class ServicioService {
  constructor(private prisma: PrismaService) {}

  crearServicio = async (servicio: CreateServicioDto, username: string) => {
    Logger.log('Crear servicio');
    return await this.prisma.servicio.create({
      data: {
        ...servicio,
        usuarioCreacion: username,
      },
    });
  };

  actualizarServicio = async (
    idServicio: number,
    servicio: UpdateServicioDto,
    username: string,
  ) => {
    Logger.log('Actualizar servicio ' + idServicio);
    return await this;
  };

  getServicios = async () => {
    return await this.prisma.servicio.findMany({
      include: { paquetes: true, categoriaServicio: true },
    });
  };

  getServicio = async (idServicio: number) => {
    return await this.prisma.servicio.findUnique({
      where: { id: idServicio },
      include: { paquetes: true, categoriaServicio: true },
    });
  };
}
