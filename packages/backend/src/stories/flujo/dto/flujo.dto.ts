import { flujo_ticket_tipo_enum, users_area_enum } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { CreateAccionDto } from 'src/stories/ticket/dto';

export class CreateFlujoDto {
  @IsNotEmpty()
  @Length(3)
  nombre: string;

  @IsNotEmpty()
  @Length(3)
  descripcion: string;

  @IsNotEmpty()
  tipo: flujo_ticket_tipo_enum;

  @IsNotEmpty()
  @Length(3)
  nombreServicio: string;
}

export class UpdateFlujoDto {
  @IsNotEmpty()
  @Length(3)
  nombre?: string;

  @IsNotEmpty()
  @Length(3)
  descripcion?: string;

  @IsNotEmpty()
  tipo?: flujo_ticket_tipo_enum;

  @IsNotEmpty()
  @Length(3)
  nombreServicio?: string;
}

export class CreateAccionFlujoDto {
  @IsNotEmpty()
  @Length(3)
  area: users_area_enum;

  @IsNotEmpty()
  vigenciaDias: number;

  @IsNotEmpty()
  @Length(3)
  accion: string;

  @IsNotEmpty()
  nombreFlujo: string;

  @IsOptional()
  idAccionAnterior: number;
}

export class EditAccionFlujoDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  orden: number;

  @IsNotEmpty()
  @Length(3)
  area?: users_area_enum;

  @IsNotEmpty()
  vigenciaDias?: number;

  @IsNotEmpty()
  @Length(3)
  accion?: string;

  @IsNotEmpty()
  nombreFlujo: string;
}
