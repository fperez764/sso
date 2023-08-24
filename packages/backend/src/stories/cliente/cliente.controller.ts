import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards, Logger } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { GetQueries, GetUser } from 'src/auth/decorator';
import { CreateClienteDto, CreateContactoDto, UpdateClienteDto, UpdateContactoDto } from './dto';
import { JwtGuard } from 'src/auth/guard';

@ApiTags('Clientes')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('clientes')
export class ClienteController {
  constructor(private clienteService: ClienteService) {}

  @Get()
  getClientes(@GetQueries() { page, count, filterKey }) {
    try {
      return this.clienteService.getClientes(page, count, filterKey);
    } catch (error) {
      Logger.error('getClientes: Algo salio mal ' + error);
      return { status: 500, msg: 'Algo salio mal ' + error };
    }
  }

  @Get('/:idCliente')
  getCliente(@Param('idCliente') idCliente: string) {
    try {
      return this.clienteService.getCliente(parseInt(idCliente));
    } catch (error) {
      Logger.error('getClientes: Algo salio mal ' + error);
      return { status: 500, msg: 'Algo salio mal ' + error };
    }
  }

  @Post('/')
  crearCliente(@GetUser('username') username: string, @Body() cliente: CreateClienteDto) {
    try {
      return this.clienteService.crearCliente(cliente, username);
    } catch (error) {
      Logger.error('getClientes: Algo salio mal ' + error);
      return { status: 500, msg: 'Algo salio mal ' + error };
    }
  }

  @Put('/:idCliente')
  actualizarCliente(
    @GetUser('username') username: string,
    @Param('idCliente') idCliente: string,
    @Body() cliente: UpdateClienteDto,
  ) {
    try {
      return this.clienteService.actualizarCliente(parseInt(idCliente), cliente, username);
    } catch (error) {
      Logger.error('getClientes: Algo salio mal ' + error);
      return { status: 500, msg: 'Algo salio mal ' + error };
    }
  }

  @Delete('/:idCliente')
  eliminarCliente(@GetUser('username') username: string, @Param('idCliente') idCliente: string) {
    try {
      return this.clienteService.eliminarCliente(parseInt(idCliente), username);
    } catch (error) {
      Logger.error('getClientes: Algo salio mal ' + error);
      return { status: 500, msg: 'Algo salio mal ' + error };
    }
  }

  @Put('/contacto/:nroDocumento')
  actualizarContacto(
    @Param('nroDocumento') nroDocumento: string,
    @Body() contacto: UpdateContactoDto,
    @GetUser('username') username: string,
  ) {
    try {
      return this.clienteService.actualizarContacto(nroDocumento, contacto, username);
    } catch (error) {
      Logger.error('getClientes: Algo salio mal ' + error);
      return { status: 500, msg: 'Algo salio mal ' + error };
    }
  }

  @Post('/:idCliente/contacto')
  agregarContacto(
    @Param('idCliente') idCliente: string,
    @Body() contacto: CreateContactoDto,
    @GetUser('username') username: string,
  ) {
    try {
      return this.clienteService.agregarContacto(parseInt(idCliente), contacto, username);
    } catch (error) {
      Logger.error('getClientes: Algo salio mal ' + error);
      return { status: 500, msg: 'Algo salio mal ' + error };
    }
  }

  @Put('/:nroDocumento/contacto')
  updateContacto(
    @Param('nroDocumento') nroDocumento: string,
    @Body() contacto: UpdateContactoDto,
    @GetUser('username') username: string,
  ) {
    try {
      return this.clienteService.actualizarContacto(nroDocumento, contacto, username);
    } catch (error) {
      Logger.error('getClientes: Algo salio mal ' + error);
      return { status: 500, msg: 'Algo salio mal ' + error };
    }
  }

  @Delete('/:nroDocumento/contacto')
  deleteContacto(
    @Param('nroDocumento') nroDocumento: string,
    @GetUser('username') username: string,
  ) {
    try {
      return this.clienteService.eliminarContacto(nroDocumento, username);
    } catch (error) {
      Logger.error('getClientes: Algo salio mal ' + error);
      return { status: 500, msg: 'Algo salio mal ' + error };
    }
  }
}
