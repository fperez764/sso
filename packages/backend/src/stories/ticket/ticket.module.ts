import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import { TicketAccionController } from './accion/ticketAccion.controller';
import { TicketAccionService } from './accion/ticketAccion.service';

@Module({
  controllers: [TicketController, TicketAccionController],
  providers: [TicketService, TicketAccionService],
})
export class TicketModule {}
