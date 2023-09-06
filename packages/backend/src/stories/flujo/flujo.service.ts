import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotImplementedException,
} from '@nestjs/common';
import { PrismaService } from 'src/models/prisma/prisma.service';
import {
  CreateAccionFlujoDto,
  CreateFlujoDto,
  EditAccionFlujoDto,
  UpdateFlujoDto,
} from '../servicio/dto';
import { CreateAccionDto, EditAccionDto } from '../ticket/dto';
import FlujoTicketAccionEntity from './FlujoTicketAccion.entity';
import { isNumber } from 'class-validator';

@Injectable()
export class FlujoService {
  constructor(private prisma: PrismaService) {}

  async getFlujos(page = '0', count = '10', filterKey = '') {
    return await this.prisma.flujoTicket.findMany({
      where: { fechaBaja: null },
      orderBy: { fechaCreacion: 'asc' },
      skip: parseInt(page) * parseInt(count),
      take: parseInt(count),
      include: { flujoTicketAcciones: true },
    });
  }

  async createFlujoAcciones(dto: CreateFlujoDto, acciones: CreateAccionDto[], username: string) {
    return await this.prisma.flujoTicket.create({
      data: {
        ...dto,
        usuarioCreacion: username,
      },
    });
  }

  async updateFlujo(idFlujo: number, dto: UpdateFlujoDto, username: string) {
    return await this.prisma.flujoTicket.update({
      where: {
        id: idFlujo,
      },
      data: {
        ...dto,
        usuarioCreacion: username,
      },
    });
  }

  async updateAccionFlujo(idFlujoAccion: number, dto: EditAccionFlujoDto, username: string) {
    return await this.prisma.flujoTicketAcciones.update({
      where: {
        id: idFlujoAccion,
      },
      data: {
        area: dto.area,
        accion: dto.accion,
        vigenciaDias: dto.vigenciaDias,
        usuarioCreacion: username,
      },
    });
  }

  async insertarAccionFlujo(nuevaAccion: CreateAccionFlujoDto, username: string) {
    if (!nuevaAccion.nombreFlujo)
      throw new BadRequestException('Seleccione el nombre del flujo para insertar Accion.');
    const flujo = await this.prisma.flujoTicket.findUnique({
      where: { nombre: nuevaAccion.nombreFlujo },
      include: { flujoTicketAcciones: true },
    });
    if (
      !nuevaAccion.idAccionAnterior &&
      flujo.flujoTicketAcciones.filter((r) => !r.fechaBaja).length === 0
    ) {
      const orden = flujo.flujoTicketAcciones.length > 0 ? flujo.flujoTicketAcciones.length + 1 : 0;
      return await this.prisma.flujoTicketAcciones.create({
        data: {
          nombreFlujo: nuevaAccion.nombreFlujo,
          orden,
          area: nuevaAccion.area,
          accion: nuevaAccion.accion,
          vigenciaDias:
            typeof nuevaAccion.vigenciaDias === 'string'
              ? parseInt(nuevaAccion.vigenciaDias)
              : nuevaAccion.vigenciaDias,
          usuarioCreacion: username,
        },
      });
    }
    if (!nuevaAccion.idAccionAnterior && flujo.flujoTicketAcciones.length > 0)
      throw new ForbiddenException('No se puede insertar una accion sin el id de la anterior');

    const accionAnterior = await this.prisma.flujoTicketAcciones.findUnique({
      where: { id: nuevaAccion.idAccionAnterior, fechaBaja: null },
      include: { flujoTicket: { include: { flujoTicketAcciones: true } } },
    });
    if (!accionAnterior)
      throw new BadRequestException('No se encontro la acción con el id enviado.');

    const accionesT = accionAnterior.flujoTicket.flujoTicketAcciones.sort(
      (r, s) => r.orden - s.orden,
    );
    const idx = accionesT.findIndex((r) => r.id === accionAnterior.id);

    for (let i = accionesT.length - 1; i > idx; i--) {
      await this.prisma.clienteServicioTicketAccion.update({
        where: { id: accionesT[i].id },
        data: { orden: i + 1 },
      });
    }

    return await this.prisma.flujoTicketAcciones.create({
      data: {
        nombreFlujo: accionAnterior.nombreFlujo,
        orden: accionAnterior?.orden ? accionAnterior?.orden + 1 : 0,
        area: nuevaAccion.area,
        accion: nuevaAccion.accion,
        vigenciaDias:
          typeof nuevaAccion.vigenciaDias === 'string'
            ? parseInt(nuevaAccion.vigenciaDias)
            : nuevaAccion.vigenciaDias,
        usuarioCreacion: username,
      },
    });
  }

  anularPasoAccion = async (idAccionFlujo: number, username: string) => {
    if (!idAccionFlujo) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    const resp = await this.prisma.flujoTicketAcciones.findUnique({
      where: { id: idAccionFlujo },
    });
    return await this.prisma.flujoTicketAcciones.update({
      where: { id: idAccionFlujo },
      data: {
        usuarioBaja: username,
        fechaBaja: new Date(),
      },
    });
  };

  async getAccionesFlujo(idFlujo: number) {
    if (isNaN(idFlujo) || idFlujo < 1) return null;
    Logger.warn('Buscar acciones para: ' + idFlujo);
    const flujo = await this.prisma.flujoTicket.findUnique({
      where: { id: idFlujo },
      include: { flujoTicketAcciones: true },
    });
    return flujo.flujoTicketAcciones;
  }

  async deleteFlujo(idFlujo: number, username: string) {
    return await this.prisma.flujoTicket.update({
      where: { id: idFlujo },
      data: {
        usuarioBaja: username,
        fechaBaja: new Date(),
      },
    });
  }

  async getFlujosPorServicio(nombreServicio: string) {
    return await this.prisma.flujoTicket.findMany({
      where: {
        nombreServicio,
        fechaBaja: null,
        flujoTicketAcciones: { some: { fechaBaja: null } },
      },
    });
  }
}
