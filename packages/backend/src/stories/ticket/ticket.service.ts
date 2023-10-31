import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  ClienteServicioTicket,
  FlujoTicketAcciones,
  accion_estado_enum,
  ticket_tipo_enum,
} from '@prisma/client';
import { PrismaService } from 'src/models/prisma/prisma.service';
import { CreateAccionDto, CreateTicketDto, EditTicketDto } from './dto';
import { ModemDto } from '../cliente/dto/modem.dto';
import ClienteServicioTicketReporteEntity from './clienteServicioTicketReporte.entity';
import ClienteServicioTicketEntity from './clienteServicioTicket.entity';
import { CreateODMDto, EditODMDto } from './dto/odm.dto';
import { startWith } from 'rxjs';

@Injectable()
export class TicketService {
  constructor(private prisma: PrismaService) {}

  ticketInclude = {
    clienteServicio: { include: { cliente: { include: { contactos: true } }, servicio: true } },
    flujoTicket: true,
    acciones: { include: { actaEntrega: true } },
    ordenMantenimiento: true,
    modems: true,
  };

  getTickets = async (page = '0', count = '10', filter: string) => {
    const idTicket = parseInt(filter);
    const tickets =
      filter?.length > 0
        ? isNaN(idTicket) 
          ? await this.prisma.clienteServicioTicket.findMany({
              orderBy: { id: 'desc' },
              where: {
                OR: [
                  { descripcion: { contains: filter, mode: 'insensitive' } },
                  { nombreContacto: { contains: filter, mode: 'insensitive' } },
                  {
                    clienteServicio: {
                      cliente: { razonSocial: { contains: filter, mode: 'insensitive' } },
                    },
                  },
                  {
                    clienteServicio: {
                      cliente: {
                        contactos: {
                          some: { nombreCompleto: { contains: filter, mode: 'insensitive' } },
                        },
                      },
                    },
                  },
                ],
              },
              include: this.ticketInclude,
            })
          : [ await this.prisma.clienteServicioTicket.findUnique({where: {id: idTicket}, include: this.ticketInclude}) ]
        : await this.prisma.clienteServicioTicket.findMany({
            orderBy: { id: 'desc' },
            where: { fechaBaja: null },
            skip: parseInt(page) * parseInt(count),
            take: parseInt(count),
            include: this.ticketInclude,
          });
    return tickets.map((t) => new ClienteServicioTicketEntity(t));
  };

  getTicketsReporte = async (filter: string) => {
    const tickets = await this.prisma.clienteServicioTicket.findMany({
      orderBy: { fechaCreacion: 'desc' },
      include: this.ticketInclude,
    });
    return tickets.map(
      (t) =>
        new ClienteServicioTicketReporteEntity(
          t,
          t.clienteServicio,
          t.clienteServicio.cliente,
          t.clienteServicio.cliente.contactos[0],
          t.flujoTicket,
        ),
    );
  };

  getTicketsAsignadosbles = async (
    page = '0',
    count = '20',
    username: string,
    area: string,
    dep: string,
  ) => {
    //Casos de almacenes amachuma la guardia
    const mainArea = area.split('_')[0];
    const tickets = await this.prisma.clienteServicioTicket.findMany({
      orderBy: { fechaCreacion: 'desc' },
      where: {
        fechaBaja: null,
        resuelto: false,
        acciones: {
          some: {
            fechaRespuesta: null,
            OR: [{ usuarioAsignado: username }, { area: {contains: mainArea }}, { area: {contains: dep }}],
          },
        },
      },
      include: this.ticketInclude,
    });
    const formatted = tickets.map((t) => new ClienteServicioTicketEntity(t));
    const filtered = formatted.filter(
      (t) =>
        t.porResponder?.usuarioAsignado === username ||
        t.porResponder?.area.includes(mainArea) ||
        t.porResponder?.area.includes(dep),
    );
    Logger.warn(
      `Se encontraron los tickets para ${username} de ${area}/${dep}\nTickets: ${tickets.length}\nAsignables: ${filtered.length}`,
    );
    return filtered;
  };

  getTusTickets = async (page = '0', count = '10', username: string) => {
    const tickets = await this.prisma.clienteServicioTicket.findMany({
      orderBy: { fechaCreacion: 'desc' },
      where: { usuarioCreacion: username },
      skip: parseInt(page) * parseInt(count),
      take: parseInt(count),
      include: this.ticketInclude,
    });
    return tickets.map((t) => new ClienteServicioTicketEntity(t));
  };

  getTicketsRespondidos = async (page = '0', count = '10', username: string) => {
    const tickets = await this.prisma.clienteServicioTicket.findMany({
      orderBy: { fechaCreacion: 'desc' },
      where: { fechaBaja: null },
      skip: parseInt(page) * parseInt(count),
      take: parseInt(count),
      include: {
        acciones: {
          where: { usuarioAsignado: username, NOT: { fechaRespuesta: null } },
        },
        ...this.ticketInclude,
      },
    });
    return tickets.map((t) => new ClienteServicioTicketEntity(t));
  };

  getTicket = async (idTicket: number) => {
    const ticket = await this.prisma.clienteServicioTicket.findUnique({
      where: { id: idTicket },
      include: this.ticketInclude,
    });
    if (!ticket) throw new NotFoundException('No se encontro el ticket');
    return new ClienteServicioTicketEntity(ticket);
  };

  crearTicket = async (username: string, ticketDto: CreateTicketDto, modems: ModemDto[]) => {
    const cliSer = await this.prisma.clienteServicio.findUnique({
      where: { id: ticketDto.idClienteServicio },
      include: {
        cliente: {
          include: { contactos: true },
        },
      },
    });
    if (!cliSer)
      throw new NotFoundException(
        'No se encontro un clienteServicio con ese ID: ' + ticketDto.idClienteServicio,
      );
    ticketDto.telefonoContacto =
      ticketDto.telefonoContacto ?? cliSer.cliente?.contactos[0]?.telefono;
    ticketDto.nombreContacto =
      ticketDto.nombreContacto ?? cliSer.cliente?.contactos[0]?.nombreCompleto;
    ticketDto.direccion = ticketDto.direccion ?? cliSer.cliente?.contactos[0]?.direccion;

    const acciones = await this.prisma.flujoTicketAcciones.findMany({
      orderBy: { orden: 'asc' },
      where: { nombreFlujo: ticketDto.nombreFlujo },
    });
    if (!acciones || acciones.length === 0)
      throw new NotFoundException('No se encontraron acciones para el flujo');
    const accionInicial = acciones[0];
    const ticket = await this.prisma.clienteServicioTicket.create({
      data: {
        ...ticketDto,
        usuarioCreacion: username,
        acciones: {
          create: [
            {
              orden: accionInicial.orden,
              area: accionInicial.area,
              vigenciaDias: accionInicial.vigenciaDias,
              accion: accionInicial.accion,
              usuarioCreacion: username,
            },
          ],
        },
      },
    });
    try {
      if (modems.length > 0) {
        await this.prisma.clienteServicioTicketModem.createMany({
          data: modems.map((m) => ({
            macModem: m.mac,
            idTicket: ticket.id,
          })),
        });
      }
    } catch (error) {}
    return new ClienteServicioTicketEntity(ticket);
  };

  crearRespuestaPorDefecto = async (username: string, idTicket: number) => {
    //Crea accion unica para agregar grupo:
    const fechaInicio = new Date();
    let fechaFin = new Date();
    fechaFin.setDate(
      fechaInicio.getDate() + Number.parseInt(process.env.VIGENCIA_RESPUESTAS_DEFECTO || '0'),
    );
    const respuestaPorDefect: CreateAccionDto = {
      estado: accion_estado_enum.PENDIENTE,
      area: (await this.prisma.users.findUnique({ where: { username } })).area,
      idTicket,
      orden: 0,
      accion: 'Confirmar Ticket y asignar FLUJO',
      vigenciaDias: Number.parseInt(process.env.VIGENCIA_RESPUESTAS_DEFECTO || '0'),
    };
    return await this.prisma.clienteServicioTicketAccion.create({
      data: { ...respuestaPorDefect, usuarioCreacion: username },
    });
  };

  vincularAccionesATicket = async (idTicket: number, nombreGrupo: string) => {
    //GetTicket
    const ticket = await this.prisma.clienteServicioTicket.findUnique({ where: { id: idTicket } });
    if (!ticket) return new NotFoundException(`Ticket ${idTicket} no encontrado`);
    //GetFlujo
    const flujo = await this.prisma.flujoTicket.findUnique({ where: { nombre: nombreGrupo } });
    if (!flujo) return new NotFoundException(`Flujo ${nombreGrupo} no encontrado`);
    //GetAcciones
    const flujoAcciones = await this.prisma.flujoTicketAcciones.findMany({
      where: { nombreFlujo: nombreGrupo },
    });
    if (!flujoAcciones || flujoAcciones.length === 0) {
      const message = `No se encontraron acciones pre-definidas para el tipo de solicitud ${flujo.tipo}:${nombreGrupo}`;
      Logger.error(message);
      throw new NotFoundException(message);
    }
    return await this.crearAccionesTicket(ticket, flujoAcciones);
  };

  crearAccionesTicket = async (ticket: ClienteServicioTicket, acciones: FlujoTicketAcciones[]) => {
    for (let i = 0; i < acciones.length; i++) {
      const flujoRespuesta = acciones[i];
      const saveRes = await this.crearAccionTicket(flujoRespuesta, ticket);
      //TODO! if (i === 0) await this.iniciarEsperaRespuesta(saveRes.id);
    }
    Logger.debug(`Respuestas guardadas para SS:${ticket.id}`);
  };

  crearAccionTicket = async (
    flujoRespuesta: FlujoTicketAcciones,
    ticket: ClienteServicioTicket,
  ) => {
    const accion = this.prisma.clienteServicioTicketAccion.create({
      data: {
        usuarioCreacion: ticket.usuarioCreacion,
        idTicket: ticket.id,
        orden: flujoRespuesta.orden,
        area: flujoRespuesta.area,
        accion: flujoRespuesta.accion,
        vigenciaDias: flujoRespuesta.vigenciaDias,
      },
    });
    Logger.debug(
      `Ticket ${ticket.id} Nueva respuesta: ${flujoRespuesta.orden}-${flujoRespuesta.accion}`,
    );
    return accion;
  };

  resolverTicket = async (idTicket: number, tipo: ticket_tipo_enum, username: string) => {
    Logger.debug(`Resolver Ticket: ${idTicket} anulara las respuestas pendientes`);
    const ticket = await this.prisma.clienteServicioTicket.findUnique({
      where: { id: idTicket },
      include: { acciones: true },
    });
    if (!ticket.acciones.find((r) => r.fechaRespuesta))
      throw new ForbiddenException('Ticket debe tener al menos una accion respondida');
    this.prisma.clienteServicioTicketAccion.updateMany({
      where: { idTicket, fechaRespuesta: null, fechaBaja: null },
      data: {
        usuarioBaja: username,
        fechaBaja: new Date(),
      },
    });
    const ticketU = await this.prisma.clienteServicioTicket.update({
      where: { id: idTicket },
      data: {
        resuelto: true,
        fechaModificacion: new Date(),
        tipo,
      },
    });
    return new ClienteServicioTicketEntity(ticketU);
  };

  actualizarTicket = async (idTicket: number, nTicket: EditTicketDto, username: string) => {
    Logger.debug('Actualizar Ticket ' + idTicket);
    const ticket = await this.prisma.clienteServicioTicket.update({
      where: { id: idTicket },
      data: { ...nTicket, usuarioCreacion: username },
    });
    return new ClienteServicioTicketEntity(ticket);
  };

  /***
   * Elimina un ticket de ClienteServicio de base de datos
   */
  deleteTicket = async (idTicket: number) => {
    Logger.warn(`Se eliminara el ticket ${idTicket}`);
    return await this.prisma.clienteServicioTicket.delete({
      where: { id: idTicket },
      include: { acciones: { include: { comentarios: true } } },
    });
  };

  /**
   * Elimina administrativamente el ticket: fechaBaja, usuarioBaja. Ademas hace lo mismo para todas sus respuestas/comentarios.
   */
  anularTicket = async (idTicket: number, username: string) => {
    const fechaBaja = new Date();
    const acciones = await this.prisma.clienteServicioTicketAccion.findMany({
      where: { idTicket },
    });
    for (let i = 0; i < acciones.length; i++) {
      await this.prisma.clienteServicioTicketAccion.update({
        where: { id: acciones[0].id },
        data: { usuarioBaja: username, fechaBaja },
      });
    }
    await this.prisma.clienteServicioTicketAccion.updateMany({
      where: { idTicket },
      data: { usuarioBaja: username, fechaBaja },
    });
    return await this.prisma.clienteServicioTicket.update({
      where: { id: idTicket },
      data: { usuarioBaja: username, fechaBaja },
    });
  };

  crearODMTicket = async (idTicket: number, username: string, odmDto: CreateODMDto) => {
    const horasViaje = parseInt(odmDto.horasViaje);
    delete odmDto.horasViaje;
    const precioAcordado = parseInt(odmDto.precioAcordado);
    delete odmDto.precioAcordado;
    const ticket = await this.prisma.clienteServicioTicket.findUnique({
      where: { id: idTicket },
      include: { ordenMantenimiento: true },
    });
    if (!ticket) return new NotFoundException('No se encontro el ticket con id ' + idTicket);
    if (ticket.ordenMantenimiento)
      return new ForbiddenException(
        'Cada ticket solo puede tener una orden de mantenimiento. El ODM ' +
          ticket.ordenMantenimiento.id +
          ' ya existe',
      );
    const odm = await this.prisma.clienteServicioTicketOrdenMantenimiento.create({
      data: {
        ...odmDto,
        usuarioCreacion: username,
        horasViaje,
        precioAcordado: precioAcordado,
        idTicket: idTicket,
      },
    });
    return odm;
  };

  editarODMTicket = async (idTicket: number, username: string, odmDto: EditODMDto) => {
    let horasViaje = null;
    let precioAcordado = null;
    if (!!odmDto.horasViaje) {
      horasViaje = parseInt(odmDto.horasViaje);
      delete odmDto.horasViaje;
    }
    if (!!odmDto.precioAcordado) {
      precioAcordado = parseInt(odmDto.precioAcordado);
      delete odmDto.precioAcordado;
    }
    return await this.prisma.clienteServicioTicketOrdenMantenimiento.update({
      where: { idTicket },
      data: {
        ...odmDto,
        usuarioCreacion: username,
        idTicket: idTicket,
        ...(horasViaje && { horasViaje: horasViaje }),
        ...(precioAcordado && { precioAcordado: precioAcordado }),
      },
    });
  };

  getClasificacionNoc = async (nombreFlujo: ticket_tipo_enum) => {
    const flujos = await this.prisma.ticketClasificacion.findMany({
      where: { tipo: nombreFlujo },
    });
    if (flujos.length === 0) throw new NotFoundException('No se encontro el flujo ' + nombreFlujo);
    return flujos;
  };
}
