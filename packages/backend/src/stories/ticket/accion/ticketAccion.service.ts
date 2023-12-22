import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { accion_estado_enum, users_area_enum, users_rol_enum } from '@prisma/client';
import { PrismaService } from 'src/models/prisma/prisma.service';
import { CreateAccionDto, EditAccionDto } from '../dto';
import ClienteServicioTicketEntity from '../clienteServicioTicketReporte.entity';
import { promises as fs } from 'fs';
import { CreateADEDto, EditADEDto } from '../dto/odm.dto';
import { MailerService } from '@nestjs-modules/mailer';
import dayjs from 'dayjs';

@Injectable()
export class TicketAccionService {
  constructor(private prisma: PrismaService, private readonly mailerService: MailerService) {}

  /**
   * Crea una Accion extra asociada a un ticket (no sigue el flujo pre-definido por areas)
   * @param req
   * @param res
   * @returns
   */
  insertarAccionTicket = async (
    idTicketAccionAnterior: number,
    username: string,
    nuevaAccion: CreateAccionDto,
  ) => {
    if (!idTicketAccionAnterior)
      throw new BadRequestException('Seleccione el id de la Accion anterior para insertar Accion.');

    const respAnterior = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idTicketAccionAnterior, fechaBaja: null },
      include: { clienteServicioTicket: { include: { acciones: { where: {fechaBaja: null} } } } },
    });
    if (!respAnterior) throw new BadRequestException('No se encontro la acción con el id enviado.');

    //If any action after ${idAccionAnterior} with status ACCEPTED it throws an error
    if (
      respAnterior.clienteServicioTicket.acciones.find(
        (a) => a.estado === accion_estado_enum.ACEPTADO && a.orden > respAnterior.orden,
      )
    )
      throw new ForbiddenException('No se pueden agregar pasos antes de acciones aceptadas.');

    const accionesT = respAnterior.clienteServicioTicket.acciones;
    accionesT.sort((r, s) => r.orden - s.orden);
    const idx = accionesT.findIndex((r) => r.id === respAnterior.id);

    for (let i = accionesT.length - 1; i > idx; i--) {
      const newOrder = accionesT[i].orden + 1;
      Logger.debug(`Insertar: Actualiza orden de accion: ${accionesT[i].id} a ${newOrder}`);
      await this.prisma.clienteServicioTicketAccion.update({
        where: { id: accionesT[i].id },
        data: { orden: newOrder },
      });
    }
    Logger.debug('Insertar: Crea acccion con orden ' + respAnterior.orden);
    const accionNueva = await this.prisma.clienteServicioTicketAccion.create({
      data: {
        idTicket: respAnterior.idTicket,
        orden: respAnterior.orden + 1,
        area: nuevaAccion.area,
        accion: nuevaAccion.accion,
        vigenciaDias:
          typeof nuevaAccion.vigenciaDias === 'string'
            ? parseInt(nuevaAccion.vigenciaDias)
            : nuevaAccion.vigenciaDias,
        usuarioCreacion: username,
      },
    });

    //Si la anterior Accion fue aceptada inicializa la vigencia de la nueva Accion.
    if (respAnterior?.estado === accion_estado_enum.ACEPTADO)
      this.iniciarEspera(accionNueva.id, username);

    return accionesT;
  };

  /**
   * Obtiene el siguiente paso en el flujo que el nombreFlujo del ticket tiene asociado
   * @param nombreFlujo Nombre del flujo correspondiente al escogido en el ticket
   * @param ordenAccionAnterior orden la accionAnterior a la sugerencia
   * @returns
   */
  getSugerenciaAccionTicket = async (nombreFlujo: string, ordenAccionAnterior: number) => {
    if (!nombreFlujo)
      throw new BadRequestException('Seleccione el nombre del flujo para insertar Accion.');
    return await this.prisma.flujoTicketAcciones.findFirst({
      orderBy: { orden: 'asc' },
      where: { nombreFlujo, orden: { gt: ordenAccionAnterior || 0 } },
    });
  };

  /***
   * Actualiza una Accion existente cambiando unicamente los campos definidos por el usuario: accion y respuesta
   * Esto genera una concatenacion en la Accion, para no perder los datos de la anterior Accion.
   */
  actualizarTicketAccion = async (
    idTicketAccion: number,
    username: string,
    nAccion: EditAccionDto,
  ) => {
    if (!idTicketAccion) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    const accion = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idTicketAccion },
    });
    if (!!accion.respuesta)
      throw new ForbiddenException('Esta accion ya fue respondida, no puede modificarse');
    return await this.prisma.clienteServicioTicketAccion.update({
      where: { id: idTicketAccion },
      data: {
        idTicket: nAccion.idTicket,
        area: nAccion.area,
        accion: nAccion.accion,
        vigenciaDias:
          typeof nAccion.vigenciaDias === 'string'
            ? parseInt(nAccion.vigenciaDias)
            : nAccion.vigenciaDias,
        usuarioCreacion: username,
      },
    });
  };

  marcarComoLeido = async (idTicketAccion: number, username: string) => {
    if (!idTicketAccion) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    const accion = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idTicketAccion },
    });
    if (accion.usuarioAsignado !== username)
      throw new ForbiddenException('Este usuario no esta asignado a la Accion.');
    Logger.verbose(`Accion ${idTicketAccion} se marca como leída`);
    return await this.prisma.clienteServicioTicketAccion.update({
      where: { id: idTicketAccion },
      data: {
        leido: true,
      },
    });
  };

  iniciarEspera = async (idAccion: number, username: string) => {
    if (!idAccion) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    const resp = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idAccion },
    });
    if (!resp) throw new NotFoundException('No se encontro la Accion con id: ' + idAccion);
    if (!!resp.respuesta) throw new ForbiddenException('Esta accion ya fue respondida');

    const fechaInicio = new Date();
    const vigencia = resp.vigenciaDias || parseInt(process.env.VIGENCIA_ACCIONES_DEFECTO || '1');
    const fechaFin = vigencia === 0 ? null : new Date();
    fechaFin.setDate(fechaInicio.getDate() + vigencia);
    return await this.prisma.clienteServicioTicketAccion.update({
      where: { id: idAccion },
      data: {
        fechaInicio,
        fechaFin,
        usuarioCreacion: username,
      },
    });
  };

  //Agrega un texto de Accion e inicializa la espera de la siguiente accion/Accion
  responder = async (idTicketAccion: number, respuesta: string, username: string) => {
    if (!idTicketAccion) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    if (!respuesta) throw new BadRequestException('Accion es requerida');
    const resp = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idTicketAccion },
      include: { clienteServicioTicket: { include: { acciones: true } } },
    });
    const ticket = new ClienteServicioTicketEntity(resp.clienteServicioTicket);
    if (ticket.porResponder.id !== idTicketAccion)
      throw new ForbiddenException(
        `Se debe responder o rechazar ${ticket.porResponder.id} primero`,
      );
    if (!!resp.respuesta) throw new ForbiddenException('Esta accion ya fue respondida');

    const accionResp = await this.prisma.clienteServicioTicketAccion.update({
      where: { id: idTicketAccion },
      data: {
        respuesta,
        usuarioAsignado: username,
        fechaRespuesta: new Date(),
        estado: accion_estado_enum.ACEPTADO,
      },
    });
    //Inicia la vigencia de la siguiente Accion
    const sigteAccion = ticket.acciones
      .sort((prev, next) => prev.orden - next.orden)
      .find((a) => a.orden > ticket.porResponder.orden && !a.fechaBaja);
    if (sigteAccion)
      this.iniciarEspera(sigteAccion.id, username)
        .then(() => Logger.verbose('Siguiente respuesta inicia espera'))
        .catch((e) =>
          Logger.verbose('Algo salio mal al iniciar la espera de la siguiente accion\n' + e),
        );
    return accionResp;
  };

  /***
   * Marca Accion como rechazada. Limpia las vigencias. Agrega un comentario con la razon del rechazo a la Accion
   * Anterior Accion: Se agrega una extensión de vigencia; se convierte la Accion en comentario; estado vuelve a pendiente.
   */
  rechazar = async (idTicketAccion: number, causaRechazo: string, usuarioRechazo: string) => {
    if (!idTicketAccion) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    if (!causaRechazo) throw new BadRequestException('Razon de rechazo es obligatoria');
    const accPorRechazar = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idTicketAccion },
      include: { clienteServicioTicket: { include: { acciones: true } } },
    });
    if (!!accPorRechazar.respuesta)
      throw new ForbiddenException('No puedes rechazar una acción ya respondida');
    const ticket = new ClienteServicioTicketEntity(accPorRechazar.clienteServicioTicket);
    if (ticket.porResponder.id !== idTicketAccion)
      throw new ForbiddenException(
        `Se debe responder o rechazar ${ticket.porResponder.id} primero`,
      );
    const acciones = accPorRechazar.clienteServicioTicket.acciones
      .filter((a) => !a.fechaBaja)
      .sort((r, s) => r.orden - s.orden);
    const idx = acciones.indexOf(acciones.find((r) => r.id === accPorRechazar.id));
    if (idx - 1 < 0) throw 'No se puede rechazar la primera Accion. Anule el ticket.';

    const accRechazada = await this.prisma.clienteServicioTicketAccion.update({
      where: { id: idTicketAccion },
      data: {
        usuarioAsignado: usuarioRechazo,
        estado: accion_estado_enum.RECHAZADO,
        fechaInicio: null,
        fechaFin: null,
      },
    });
    //Acciones anterior Accion: Reinicia vigencias; vuelve la Accion en comentario y la limpia
    await this.rechazarAccionAnterior(acciones[idx - 1].id, usuarioRechazo, causaRechazo);
    return accPorRechazar;
  };

  //Cuando alguien se equivoco al responder o la siguiente Accion es rechazada
  //Guarda el contanido de la Accion en un comentario a si misma
  rechazarAccionAnterior = async (
    idAccRechazada: number,
    usuarioRechazo: string,
    causaRechazo: string,
  ) => {
    if (!idAccRechazada) throw new ForbiddenException('No se puede rechazar Accion null');
    const accReiniciada = await this.prisma.clienteServicioTicketAccion.update({
      where: { id: idAccRechazada },
      data: {
        respuesta: null,
        fechaRespuesta: null,
        estado: accion_estado_enum.PENDIENTE,
      },
    });
    const comentario = `RECHAZO: ${idAccRechazada}: '${
      accReiniciada.accion
    }' en fecha ${new Date().toLocaleString('es-ES')} de ${
      accReiniciada.usuarioAsignado
    }. Causa: ${causaRechazo}`;
    const usuario = await this.prisma.users.findUnique({ where: { username: usuarioRechazo } });
    if (!usuario) throw new ForbiddenException('No se encontro el usuario');
    const comentarioAccion = await this.prisma.clienteServicioTicketAccion.update({
      where: { id: idAccRechazada },
      data: {
        comentarios: {
          create: [
            {
              comentario,
              usuarioCreacion: usuarioRechazo,
              usuarioArea: usuario.area,
            },
          ],
        },
      },
    });
    this.iniciarEspera(idAccRechazada, usuarioRechazo)
      .then(() => Logger.verbose('Anterior respuesta reinicia espera por rechazo'))
      .catch((e) =>
        Logger.verbose(
          'Algo salio mal al reiniciar la espera de la anterior accion por rechazo\n' + e,
        ),
      );
    return comentarioAccion;
  };

  anularPasoAccion = async (idTicketAccion: number, username: string) => {
    if (!idTicketAccion) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    const accion = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idTicketAccion },
    });
    
    if (!!accion.respuesta) throw new ForbiddenException('Esta accion ya fue respondida');

    return await this.prisma.clienteServicioTicketAccion.update({
      where: { id: idTicketAccion },
      data: {
        usuarioBaja: username,
        fechaBaja: new Date(),
        orden: null
      },
    });
  };

  eliminarPasoAccion = async (idTicketAccion: number, username: string) => {
    if (!idTicketAccion) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    const accion = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idTicketAccion },
    });
    if (!!accion.respuesta) throw new ForbiddenException('Esta accion ya fue respondida');
    return await this.prisma.clienteServicioTicketAccion.delete({
      where: { id: idTicketAccion },
    });
  };

  asignar = async (idTicketAccion: number, usuarioCreacion: string, usuarioAsignado: string) => {
    if (!idTicketAccion) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    if (!usuarioAsignado)
      throw new BadRequestException('Se debe especificar el usuario por asignarse.');
    const accion = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idTicketAccion },
    });
    if (!!accion.respuesta) throw new ForbiddenException('Esta accion ya fue respondida');
    const userToAssign = await this.prisma.users.findUnique({
      where: { username: usuarioAsignado },
    });
    const puedeAsignar =
      (userToAssign.area === accion.area && userToAssign.username === usuarioAsignado) || //Se autoasigna si es del area
      userToAssign.rol !== users_rol_enum.FUNCIONARIO; //Es Admin o es RESPONSABLE DE AREA/JEFE/DIRECTOR

    if (!puedeAsignar)
      throw new ForbiddenException(
        `Solo el responsable o funcionarios de la misma área ${accion.area} pueden asignarse la acción.`,
      );
    return await this.prisma.clienteServicioTicketAccion.update({
      where: { id: idTicketAccion },
      data: {
        usuarioCreacion,
        usuarioAsignado,
      },
    });
  };

  getAccion = async (idTicketAccion: number) => {
    if (!idTicketAccion) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    const accion = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idTicketAccion },
      include: {
        comentarios: true,
        actaEntrega: { where: { fechaBaja: null }, include: { equipos: true } },
        clienteServicioTicket: {
          include: {
            ordenMantenimiento: true,
            clienteServicio: { include: { cliente: { include: { contactos: true } } } },
          },
        },
      },
    });
    const comentarios = accion.comentarios.filter((com) => !com.fechaBaja);
    accion.comentarios = comentarios;
    return accion;
  };

  obtenerImagenComentario = async (idComentario: number) => {
    if (!idComentario) throw new BadRequestException('Id del comentario no puede ser vacia.');
    const comentario = await this.prisma.clienteServicioTicketAccionComentario.findUnique({
      where: { id: idComentario },
    });
    if (!comentario) throw new ForbiddenException('No se encontro el comentario');
    if (!comentario.imagen) throw new ForbiddenException('Comentario sin imagen');
    const file = await fs.readFile(`./files/${comentario.imagen}`);
    //Envia imagen como base64 lista para ser rendereada (Tomando en cuenta ambos casos: que ya esta en base64 o no)
    const base64Data = Buffer.from(file).toString('base64');
    const alBase64Data = Buffer.from(file).toString();
    comentario.imagen = alBase64Data.includes('base64,')
      ? alBase64Data
      : 'data:image/jpg;base64,' + base64Data;
    return comentario;
  };

  comentarAccion = async (
    idTicketAccion: number,
    usuarioCreacion: string,
    comentario: string,
    imagen: Express.Multer.File,
  ) => {
    if (!idTicketAccion) throw new BadRequestException('Id de la Acción no puede ser vacia.');
    const usuario = await this.prisma.users.findUnique({ where: { username: usuarioCreacion } });
    if (!usuario) throw new ForbiddenException('No se encontro el usuario');
    Logger.warn(idTicketAccion);
    Logger.warn(comentario);
    Logger.warn(usuarioCreacion);
    const nComentario = await this.prisma.clienteServicioTicketAccionComentario.create({
      data: {
        comentario,
        usuarioCreacion,
        usuarioArea: usuario.area,
        idTicketAccion,
      },
    });
    if (!imagen) return nComentario;
    const saveName = `C${nComentario.id}Accion${nComentario.idTicketAccion}-${imagen.originalname}`;
    this.guardarImagen(imagen, saveName);
    return await this.prisma.clienteServicioTicketAccionComentario.update({
      where: { id: nComentario.id },
      data: { imagen: saveName },
    });
  };

  guardarImagen = async (imagen: Express.Multer.File, saveName: string) => {
    await fs.writeFile(`./files/${saveName}`, imagen.buffer);
  };

  anularComentario = async (idComentario: number, username: string) => {
    if (!idComentario) throw new BadRequestException('Id del Comentario no puede ser vacio.');
    const comentario = await this.prisma.clienteServicioTicketAccionComentario.findUnique({
      where: { id: idComentario },
    });
    if (comentario.imagen)
      fs.unlink(`./files/${comentario.imagen}`)
        .then(() => Logger.warn('Se elimino la imagen del comentario: ' + idComentario))
        .catch((error) =>
          Logger.error(
            `Algo salio mal al eliminar la imagen del comentario ${idComentario}\n${error}`,
          ),
        );

    return await this.prisma.clienteServicioTicketAccionComentario.update({
      where: { id: idComentario },
      data: {
        usuarioBaja: username,
        fechaBaja: new Date(),
      },
    });
  };

  rechazarPendientes = async () => {
    const accionesVencidas = await this.prisma.clienteServicioTicketAccion.findMany({
      where: {
        fechaRespuesta: null,
        fechaFin: { lt: new Date() },
        fechaBaja: null,
        clienteServicioTicket: { resuelto: false, fechaBaja: null },
      },
    });
    let count = 0;
    for (const accion of accionesVencidas) {
      try {
        if (
          accion.area === users_area_enum.EXT_CLIENTE ||
          accion.area === users_area_enum.EXT_INSTALADOR ||
          accion.area === users_area_enum.NOC || 
          accion.area === users_area_enum.ALMACENES
        ) {
          await this.rechazar(accion.id, 'Vencimiento de vigencia', 'sistemas');
          Logger.verbose(
            `Accion rechazada por vencimiento de vigencia: ${accion.id}/${accion.area}/${accion.accion}`,
          );
          count++;
        } else
          Logger.verbose(
            `Accion no rechazada (solo rechaza areas CLIENTE, INSTALADOR, NOC, ALMACENES): ${accion.id}/${accion.area}/${accion.accion}`,
          );
      } catch (error) {
        Logger.error('Algo salio mal al rechazar la accion: ' + accion.id + '\n' + error?.message);
      }
      Logger.log(
        `${count}/${accionesVencidas.length} acciones rechazadas por vencimiento de vigencia`,
      );
    }
  };

  crearADETicket = async (idAccion: number, username: string, adeDto: CreateADEDto) => {
    //verificaODM
    const acciont = await this.prisma.clienteServicioTicketAccion.findUnique({
      where: { id: idAccion },
    });
    if (!acciont) throw new NotFoundException('No se encontro la accion con id ' + idAccion);
    const ticket = await this.prisma.clienteServicioTicket.findUnique({
      where: { id: acciont.idTicket },
      include: {
        ordenMantenimiento: true,
        clienteServicio: true,
      },
    });
    //creaADEcon equipos
    const ade = await this.prisma.clienteServicioActaEntrega.upsert({
      where: { idTicketAccion: idAccion },
      update: {
        nombreInstalador: adeDto.nombreInstalador,
        lugarRecojo: adeDto.lugarRecojo,
        observaciones: adeDto.observaciones || '',
        usuarioCreacion: username,
        fechaBaja: null,
        usuarioBaja: null,
        entrega: adeDto.entrega,
      },
      create: {
        nombreInstalador: adeDto.nombreInstalador,
        lugarRecojo: adeDto.lugarRecojo,
        observaciones: adeDto.observaciones || '',
        usuarioCreacion: username,
        idClienteServicio: ticket.idClienteServicio,
        idTicketAccion: idAccion,
        entrega: adeDto.entrega,
      },
    });
    //verificaEquipos -> Registra equipos como no verificados y los asigna al servicio del ticket
    const equipos = adeDto.equipos;
    for (let i = 0; i < equipos.length; i++) {
      const equipo = await this.prisma.clienteServicioEquipo.findUnique({
        where: { serial: equipos[i].serial },
      });
      !equipo
        ? await this.prisma.clienteServicioEquipo.create({
            data: {
              ...equipos[i],
              usuarioCreacion: username,
              idActaEntrega: ade.id,
              idClienteServicio: adeDto.entrega ? ticket.idClienteServicio : null,
              verificado: false,
            },
          })
        : await this.prisma.clienteServicioEquipo.update({
            where: { id: equipo.id },
            data: {
              idClienteServicio: adeDto.entrega ? ticket.idClienteServicio : null,
              idActaEntrega: ade.id,
              observaciones: equipos[i].observaciones || '',
            },
          });
      await this.prisma.clienteServicioActaEntregaEquipo.create({
        data: {
          serial: equipos[i].serial,
          estado: equipos[i].estado,
          verificado: !!equipo,
          observaciones: adeDto.entrega ? 'ENTREGA' : 'DEVOLUCION' + equipos[i].observaciones,
          idClienteServicio: ade.idClienteServicio,
          idActaEntrega: ade.id,
        },
      });
    }
  };
  modificarADETicket = async (idADE: number, username: string, adeDto: EditADEDto) => {
    const ade = await this.prisma.clienteServicioActaEntrega.update({
      where: { id: idADE },
      data: {
        observaciones: adeDto.observaciones,
        fechaModificacion: new Date(),
        usuarioCreacion: username,
        entrega: adeDto.entrega,
      },
    });
    await this.prisma.clienteServicioEquipo.deleteMany({
      where: { idActaEntrega: idADE, verificado: false },
    });
    await this.prisma.clienteServicioActaEntregaEquipo.deleteMany({
      where: { idActaEntrega: idADE },
    });
    await this.prisma.clienteServicioEquipo.updateMany({
      where: { idActaEntrega: idADE },
      data: { idActaEntrega: null, idClienteServicio: null },
    });
    //verificaEquipos -> Registra equipos como no verificados y los asigna al servicio del ticket
    const equipos = adeDto.equipos;
    for (let i = 0; i < equipos.length; i++) {
      const equipo = await this.prisma.clienteServicioEquipo.upsert({
        where: { serial: equipos[i].serial },
        create: {
          ...equipos[i],
          usuarioCreacion: username,
          idActaEntrega: ade.id,
          idClienteServicio: adeDto.entrega ? ade.idClienteServicio : null,
          verificado: false,
        },
        update: {
          idClienteServicio: adeDto.entrega ? ade.idClienteServicio : null,
          idActaEntrega: ade.id,
          observaciones: equipos[i].observaciones,
        },
      });

      await this.prisma.clienteServicioActaEntregaEquipo.create({
        data: {
          serial: equipos[i].serial,
          estado: equipos[i].estado,
          verificado: equipo.verificado,
          observaciones: adeDto.entrega ? 'ENTREGA' : 'DEVOLUCION' + equipos[i].observaciones,
          idClienteServicio: ade.idClienteServicio,
          idActaEntrega: ade.id,
        },
      });
    }
  };

  anularADETicket = async (idADE: number, username: string) => {
    const ade = await this.prisma.clienteServicioActaEntrega.findUnique({ where: { id: idADE } });
    const user = await this.prisma.users.findUnique({ where: { username } });
    if (!ade) throw new NotFoundException('No se encontro la accion con id ' + idADE);
    if (ade.usuarioCreacion !== username || user.rol !== users_rol_enum.ADMIN)
      throw new ForbiddenException('Solo el usuario que creo el acta puede anularla');
    await this.prisma.clienteServicioEquipo.deleteMany({
      where: { idActaEntrega: idADE, verificado: false },
    });
    await this.prisma.clienteServicioActaEntregaEquipo.deleteMany({
      where: { idActaEntrega: idADE },
    });
    await this.prisma.clienteServicioEquipo.updateMany({
      where: { idActaEntrega: idADE },
      data: { idActaEntrega: null, idClienteServicio: null },
    });
    await this.prisma.clienteServicioActaEntrega.delete({
      where: { id: idADE },
    });
  };

  reportarAccionesPendientes = async () => {
    Logger.debug('Generando reporte de pendientes');
    const lastReg = await this.prisma.areaPendienteHistorial.findFirst({ orderBy: { fechaRegistro: 'desc' } });
    if(new Date(lastReg.fechaRegistro).getDate() !== new Date().getDate()){
      const tickets = await this.prisma.clienteServicioTicket.findMany({
        orderBy: { fechaCreacion: 'desc' },
        where: {resuelto: false, fechaBaja: null}, 
        include: {acciones: true}
      });
      const pdtesPorResp = tickets.map(t =>  new ClienteServicioTicketEntity(t));
      Logger.debug('Tickets con acciones pendientes:', pdtesPorResp.length);
      const fechaRegistro = new Date();
      const pdtesPorArea = Object.values(users_area_enum).map(area => {
        return {  
          fechaRegistro,
          area,
          totalPendientes: pdtesPorResp.filter(p => p.areaPorResponder === area).length
      }});
      pdtesPorArea.sort((a, b) => b.totalPendientes - a.totalPendientes);
      await this.prisma.areaPendienteHistorial.createMany({
        data: pdtesPorArea
      });
    }
    const fechas = await this.prisma.areaPendienteHistorial.findMany({
      select: {
        fechaRegistro: true
      },
      distinct: ["fechaRegistro"],
      orderBy: {
        fechaRegistro: 'desc'
      },
      take: 4
    });
    fechas.reverse();
    const pdtesAnteriores = await this.prisma.areaPendienteHistorial.findMany({
      where: {
        fechaRegistro: { in: fechas.map(f => f.fechaRegistro)}
      }
    });
    Logger.warn('Fechas por reportar:', fechas);
    Logger.debug('Pendientes por area:', pdtesAnteriores.length);
    try {
      this.mailerService.sendMail({
        from: process.env.MAIL_USER || 'tikets@abe.bo',
        to: process.env.MAIL_TO || 'sistemas@abe.bo',
        subject: 'Reporte de Tickets Pendientes por Area',
        html: `
        <h3>Reporte de tickets pendientes por area</h3>
        <style>
          td {
            border: 2px solid black;
            background-color: lightgray; 
            text-align: center; 
            padding: 2px;
          }
        </style>
        <p>Este reporte contiene la cantidad de tickets pendientes por area semanalmente:</br></p>
        <table style="border: 2px solid black; border-collapse: collapse; padding: 3px">
          <tr style="font-size: 16px; font-weight: bold;">
            <td style="width: 140px; background-color: lightblue;">Area</td>
            ${fechas.map(f => `<td key=${f.fechaRegistro} style="background-color: lightblue;">${f.fechaRegistro.toLocaleDateString('es')}</td>`).join('')}
          </tr>
        ${Object.values(users_area_enum).map(pdteArea => `<tr style="border: 2px solid black; font-size: 16px; display: flex;" key=${pdteArea}> 
          <td style="width: 120px">${pdteArea}</td>
          ${fechas.map(f => `<td key=${f.fechaRegistro} style="background-color: lightgray;">
            <p>${pdtesAnteriores.find(p => 
              p.area === pdteArea && 
              new Date(p.fechaRegistro).getTime() === new Date(f.fechaRegistro).getTime())?.totalPendientes
            }</p>
            </td>`).join('')}
          </tr>`).join('')}
        </table>
        <br/>        
        <a href='https://sso.abe.bo/reportes' target='_blank'>Revisa el reporte completo en: sso.abe.bo/reportes</a>`
      })        
    } catch (error) {
      Logger.error('No se pudo enviar el correo de pendientes por area\n'+ error);
    }
  }

  getHistorialPendientes = async (cant = Object.values(users_area_enum).length*4) => {
    return await this.prisma.areaPendienteHistorial.findMany({
      orderBy: {
        fechaRegistro: 'asc',
      },
      take: cant,
    })
  }
}
