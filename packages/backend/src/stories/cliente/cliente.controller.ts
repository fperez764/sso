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
    return this.clienteService.getClientes(page, count, filterKey);
  }

  @Get('/:idCliente')
  getCliente(@Param('idCliente') idCliente: string) {
    return this.clienteService.getCliente(parseInt(idCliente));
  }

  @Post('/')
  crearCliente(@GetUser('username') username: string, @Body() cliente: CreateClienteDto) {
    return this.clienteService.crearCliente(cliente, username);
  }

  @Put('/:idCliente')
  actualizarCliente(
    @GetUser('username') username: string,
    @Param('idCliente') idCliente: string,
    @Body() cliente: UpdateClienteDto,
  ) {
    return this.clienteService.actualizarCliente(parseInt(idCliente), cliente, username);
  }

  @Delete('/:idCliente')
  eliminarCliente(@GetUser('username') username: string, @Param('idCliente') idCliente: string) {
    return this.clienteService.eliminarCliente(parseInt(idCliente), username);
  }

  @Put('/contacto/:nroDocumento')
  actualizarContacto(
    @Param('nroDocumento') nroDocumento: string,
    @Body() contacto: UpdateContactoDto,
    @GetUser('username') username: string,
  ) {
    return this.clienteService.actualizarContacto(nroDocumento, contacto, username);
  }

  @Post('/:idCliente/contacto')
  agregarContacto(
    @Param('idCliente') idCliente: string,
    @Body() contacto: CreateContactoDto,
    @GetUser('username') username: string,
  ) {
    return this.clienteService.agregarContacto(parseInt(idCliente), contacto, username);
  }

  @Put('/:nroDocumento/contacto')
  updateContacto(
    @Param('nroDocumento') nroDocumento: string,
    @Body() contacto: UpdateContactoDto,
    @GetUser('username') username: string,
  ) {
    return this.clienteService.actualizarContacto(nroDocumento, contacto, username);
  }

  @Delete('/:nroDocumento/contacto')
  deleteContacto(
    @Param('nroDocumento') nroDocumento: string,
    @GetUser('username') username: string,
  ) {
    return this.clienteService.eliminarContacto(nroDocumento, username);
  }
}
