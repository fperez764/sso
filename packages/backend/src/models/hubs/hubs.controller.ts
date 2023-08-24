import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';

@ApiBearerAuth()
@Controller('hubs')
@UseGuards(JwtGuard)
export class HubsController {}
