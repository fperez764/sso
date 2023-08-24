import { Module } from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { ClienteServicioController } from './clienteServicio.controller';
import { ClienteService } from './cliente.service';
import { ClienteServicioService } from './clienteServicio.service';

@Module({
  controllers: [ClienteController, ClienteServicioController],
  providers: [ClienteService, ClienteServicioService],
})
export class ClienteModule {}
