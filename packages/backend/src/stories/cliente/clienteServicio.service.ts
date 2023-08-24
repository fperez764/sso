import { BadRequestException, ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { CreateClienteServicioDto, UpdateClienteServicioDto } from './dto';
import { PrismaService } from 'src/models/prisma/prisma.service';
import { ModemDto } from './dto/modem.dto';

@Injectable()
export class ClienteServicioService {
  constructor(private prisma: PrismaService) {}

  async agregarClienteServicio(usuarioCreacion: string, servicio: CreateClienteServicioDto) {
    Logger.log('Crear Cliente-Servicio');
    const cliSer = await this.prisma.clienteServicio.create({
      data: {
        activo: servicio.activo,
        contrato: servicio.contrato,
        instalador: servicio.instalador,
        servicio: { connect: { nombre: servicio.nombreServicio } },
        cliente: { connect: { id: servicio.idCliente } },
        usuarioCreacion,
      },
    });
    return cliSer;
  }

  async modificarClienteServicio(
    idClienteServicio: number,
    updatedClienteServicio: UpdateClienteServicioDto,
    username: string,
  ) {
    if (!idClienteServicio) throw new BadRequestException('No se envio el id del clienteServicio');
    await this.prisma.clienteServicio.update({
      where: { id: idClienteServicio },
      data: { ...updatedClienteServicio, usuarioCreacion: username },
    });
  }

  async bajaClienteServicio(idClienteServicio: number, usuarioBaja: string) {
    if (!idClienteServicio) throw new BadRequestException('No se envio el id del clienteServicio');
    const clienteServicio = await this.prisma.clienteServicio.update({
      where: { id: idClienteServicio },
      data: { usuarioBaja },
    });
    await this.prisma.clienteServicio.delete({
      where: { id: idClienteServicio },
    });
    return clienteServicio;
  }

  async asignarModemClienteServicio(
    idClienteServicio: number,
    usuarioCreacion: string,
    modem: ModemDto,
  ) {
    if (!idClienteServicio) throw new BadRequestException('No se envio el id del clienteServicio');
    const isRepetidoActivo =
      (await this.prisma.clienteServicioModem.findFirst({
        where: { mac: modem.mac, usuarioBaja: null },
        include: { clienteServicio: true },
      })) ||
      (await this.prisma.clienteServicioModem.findFirst({
        where: { mac: modem.mac.replace(':', ''), usuarioBaja: null },
        include: { clienteServicio: true },
      }));
    if (isRepetidoActivo)
      throw new BadRequestException(
        `${
          isRepetidoActivo.idClienteServicio === idClienteServicio ? 'Este mismo' : 'El'
        } clienteServicio: ${isRepetidoActivo.clienteServicio} ya tiene asignado al modem ${
          modem.mac
        } con estado activo`,
      );
    return await this.prisma.clienteServicioModem.create({
      data: {
        ...modem,
        usuarioCreacion,
        idClienteServicio,
      },
    });
  }

  async liberarModemClienteServicio(idClienteServicio: number, usuario: string, mac: string) {
    if (!idClienteServicio) throw new BadRequestException('No se envio el id del clienteServicio');
    const clienteServicio = await this.prisma.clienteServicio.findUnique({
      where: { id: idClienteServicio },
      include: { modems: true },
    });
    if (!clienteServicio)
      throw new ForbiddenException(
        'No se pudo encontrar al clienteServicio con id: ' + idClienteServicio,
      );
    const modem = clienteServicio.modems.find((m) => m.mac === mac && !m.usuarioBaja);
    if (!modem)
      throw new ForbiddenException(
        `El clienteServicio ${idClienteServicio} no tiene asignado un modem con mac ${mac}`,
      );
    const lModem = this.prisma.clienteServicioModem.update({
      where: { id: modem.id },
      data: {
        usuarioBaja: usuario,
        fechaBaja: new Date(),
      },
    });
    return lModem;
  }

  async getClienteServicio(idClienteServicio: number) {
    if (!idClienteServicio) throw new BadRequestException('No se envio el id del clienteServicio');
    const clienteServicio = await this.prisma.clienteServicio.findUnique({
      where: {
        id: idClienteServicio,
      },
      include: {
        cliente: { include: { contactos: true } },
      },
    });
    return clienteServicio;
  }
}
