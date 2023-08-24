import { cliente_servicio_ticket_severidad_enum } from '.prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsLatLong, IsNotEmpty, Length } from 'class-validator';
import { CreateAccionDto } from './ticket-accion.dto';

export class CreateTicketDto {
  @IsNotEmpty()
  origen: string;

  @IsNotEmpty()
  @Length(3)
  descripcion: string;

  severidad?: cliente_servicio_ticket_severidad_enum;

  @IsNotEmpty()
  telefonoContacto: string;

  @IsNotEmpty()
  nombreContacto: string;

  @IsNotEmpty()
  direccion: string;

  @IsLatLong()
  coordenadas?: string;

  @IsNotEmpty()
  idClienteServicio: number;

  @IsNotEmpty()
  @Length(3)
  nombreFlujo?: string;
}

export class EditTicketDto {
  @IsNotEmpty()
  origen?: string;

  @IsNotEmpty()
  @Length(3)
  descripcion?: string;

  @IsNotEmpty()
  severidad?: cliente_servicio_ticket_severidad_enum;

  @IsNotEmpty()
  telefonoContacto?: string;

  @IsNotEmpty()
  nombreContacto?: string;

  @IsNotEmpty()
  direccion?: string;

  @IsLatLong()
  coordenadas?: string;

  @IsNotEmpty()
  @Length(3)
  nombreFlujo?: string;
}
