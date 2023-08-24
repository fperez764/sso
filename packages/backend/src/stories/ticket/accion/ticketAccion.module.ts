import { Module } from '@nestjs/common';
import { TicketAccionController } from './ticketAccion.controller';
import { TicketAccionService } from './ticketAccion.service';

@Module({
  controllers: [TicketAccionController],
  providers: [TicketAccionService],
})
export class TicketAccionModule {}
