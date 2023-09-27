import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateClienteDto, CreateContactoDto, UpdateClienteDto, UpdateContactoDto } from './dto';
import { PrismaService } from 'src/models/prisma/prisma.service';
import { Cliente } from '@prisma/client';

@Injectable()
export class ClienteService {
  constructor(private prisma: PrismaService) {}

  async getClientes(page = '0', count = '10', filter: string) {
    const clientes =
      filter?.length > 0
        ? await this.prisma.cliente.findMany({
            orderBy: { fechaCreacion: 'desc' },
            where: { razonSocial: { contains: filter, mode: 'insensitive' } },
            include: {
              contactos: true,
              clienteServicios: { include: { modems: true, tickets: true, periodos: true } },
            },
          })
        : await this.prisma.cliente.findMany({
            orderBy: { fechaCreacion: 'desc' },
            where: { usuarioBaja: null },
            skip: parseInt(page) * parseInt(count),
            take: parseInt(count),
            include: {
              contactos: true,
              clienteServicios: { include: { tickets: true } },
            },
          });
    Logger.debug('Se encontraron ' + clientes.length + ' clientes para: ' + filter);
    return clientes;
  }

  async getClienteContactos(filter: string) {
    if (!filter || filter?.length === 0)
      throw new BadRequestException('Debe enviar un filtro para buscar clientes');
    const clientePorContactos = await this.prisma.cliente.findMany({
      include: {
        clienteServicios: { include: { modems: true, tickets: true } },
        contactos: { where: { nombreCompleto: { contains: filter, mode: 'insensitive' } } },
      },
    });
    const clientesPorRazonSocial = await this.prisma.cliente.findMany({
      where: { razonSocial: { contains: filter, mode: 'insensitive' } },
      include: {
        clienteServicios: { include: { modems: true, tickets: true } },
      },
    });
    const clientes = [...clientePorContactos, ...clientesPorRazonSocial];
    return clientes.filter((c, index, self) => self.findIndex((s) => s.id === c.id) === index);
  }

  async getCliente(idCliente: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: idCliente },
      include: {
        contactos: true,
        clienteServicios: { include: { modems: true, tickets: true, periodos: true } },
      },
    });
    return cliente;
  }

  async getClientePorNombre(page = '0', count = '10', filterKeyNombre: string) {
    const contactos = await this.prisma.clienteContacto.findMany({
      where: { nombreCompleto: { contains: filterKeyNombre } },
      include: {
        cliente: {
          include: {
            contactos: true,
            clienteServicios: { include: { modems: true, tickets: true, periodos: true } },
          },
        },
      },
      skip: parseInt(page) * parseInt(count),
      take: parseInt(count),
    });
    return contactos.map((c) => c.cliente);
  }

  async crearCliente(clienteData: CreateClienteDto, username: string) {
    if (!username) throw new ForbiddenException('No se pudo obtener el username solicitante');
    if (!clienteData.nroDocumento || !clienteData.nombreCompleto)
      throw new ForbiddenException('NombreCompleto y NroDocumento son campos obligatorios');
    const contactoCliente = await this.prisma.clienteContacto.findFirst({
      where: { nroDocumento: clienteData.nroDocumento, fechaBaja: null },
    });
    if (contactoCliente)
      throw new ForbiddenException(
        'Este nro. de documento ya se encuentra vinculado al contacto-cliente ' +
          contactoCliente.nombreCompleto,
      );
    return await this.prisma.$transaction(async (prisma): Promise<Cliente> => {
      const nCliente = await prisma.cliente.create({
        data: {
          nroDocumentoFacturacion: clienteData.nroDocumentoFacturacion,
          tipoDocumentoFacturacion: clienteData.tipoDocumentoFacturacion,
          tipo: clienteData.tipo,
          razonSocial: clienteData.razonSocial,
          usuarioCreacion: username,
        },
      });
      const nContacto = await prisma.clienteContacto.create({
        data: {
          nombreCompleto: clienteData.nombreCompleto,
          nroDocumento: clienteData.nroDocumento,
          telefono: clienteData.telefono,
          direccion: clienteData.direccion,
          email: clienteData.email,
          usuarioCreacion: username,
          idCliente: nCliente.id,
        },
      });

      return nCliente;
    });
  }

  async actualizarCliente(idCliente: number, clienteData: UpdateClienteDto, username: string) {
    if (!username) throw new ForbiddenException('No se pudo obtener el username solicitante');
    const cliente = await this.prisma.cliente.update({
      where: { id: idCliente },
      data: {
        nroDocumentoFacturacion: clienteData.nroDocumentoFacturacion,
        tipoDocumentoFacturacion: clienteData.tipoDocumentoFacturacion,
        tipo: clienteData.tipo,
        razonSocial: clienteData.razonSocial,
        usuarioCreacion: username,
      },
      include: { contactos: true },
    });
    const contacto = await this.prisma.clienteContacto.update({
      where: { id: cliente.contactos[0].id },
      data: {
        nombreCompleto: clienteData.nombreCompleto,
        nroDocumento: clienteData.nroDocumento,
        telefono: clienteData.telefono,
        direccion: clienteData.direccion,
        email: clienteData.email,
        usuarioCreacion: username,
      },
    });
    return { cliente, contacto };
  }

  async eliminarCliente(idCliente: number, username: string) {
    if (!username) throw new ForbiddenException('No se pudo obtener el username solicitante');
    await this.prisma.clienteContacto.updateMany({
      data: { usuarioBaja: username, fechaBaja: new Date() },
      where: { idCliente },
    });
    return await this.prisma.cliente.update({
      data: { usuarioBaja: username, fechaBaja: new Date() },
      where: { id: idCliente },
    });
  }

  async actualizarContacto(
    nroDocumento: string,
    contactoData: UpdateContactoDto,
    username: string,
  ) {
    if (!username) throw new ForbiddenException('No se pudo obtener el username solicitante');
    const contactoCliente = await this.prisma.clienteContacto.findFirst({
      where: { nroDocumento, fechaBaja: { equals: undefined } },
    });

    const contacto = await this.prisma.clienteContacto.update({
      where: {
        id: contactoCliente.id,
      },
      data: {
        ...contactoData,
        usuarioCreacion: username,
      },
      include: { cliente: true },
    });
    return contacto;
  }

  async agregarContacto(idCliente: number, contactoData: CreateContactoDto, username: string) {
    if (!username) throw new ForbiddenException('No se pudo obtener el username solicitante');
    const cliente = await this.prisma.cliente.findUnique({ where: { id: idCliente } });
    if (!cliente) throw new ForbiddenException('Cliente con ese id no existe');
    const contacto = await this.prisma.clienteContacto.create({
      data: {
        ...contactoData,
        idCliente: cliente.id,
        usuarioCreacion: username,
      },
      include: { cliente: true },
    });
    return contacto;
  }

  async eliminarContacto(nroDocumento: string, username: string) {
    if (!username) throw new ForbiddenException('No se pudo obtener el username solicitante');
    const contactos = await this.prisma.clienteContacto.findMany({
      where: { nroDocumento },
    });
    if (contactos.length === 0)
      throw new NotFoundException(
        'No se encontro un contacto con ese nro de documento: ' + nroDocumento,
      );
    const contactosActivos = contactos.filter((c) => !!c.usuarioBaja);
    if (contactosActivos.length > 1)
      throw new ConflictException(
        'Se encontro mas de un contacto con ese nro de doc activo. Regularice los cliente con id(s): ' +
          contactosActivos.map((c) => c.idCliente),
      );
    await this.prisma.clienteContacto.update({
      where: { id: contactosActivos[0].id },
      data: { usuarioBaja: username, fechaBaja: new Date() },
    });
  }
}
