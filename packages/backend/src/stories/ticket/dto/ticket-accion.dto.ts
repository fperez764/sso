import { users_area_enum } from '@prisma/client';
import { accion_estado_enum } from '@prisma/client';
import { IsBase64, IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';

export class CreateAccionDto {
  @IsOptional()
  estado: accion_estado_enum;

  @IsNotEmpty()
  @IsNumber()
  orden: number;

  @IsNotEmpty()
  @Length(3)
  area: users_area_enum;

  @IsNotEmpty()
  vigenciaDias: number;

  @IsNotEmpty()
  @Length(3)
  accion: string;

  @IsNotEmpty()
  @IsNumber()
  idTicket: number;
}

export class EditAccionDto {
  @IsOptional()
  estado: accion_estado_enum;

  @IsOptional()
  @Length(3)
  area?: users_area_enum;

  @IsOptional()
  vigenciaDias?: number;

  @IsOptional()
  fechaInicio?: Date;

  @IsOptional()
  @Length(3)
  accion?: string;

  @IsOptional()
  idTicket: number;
}

export class EditEstadoAccionDto {
  @IsNotEmpty()
  estado: accion_estado_enum;
}

export class CreateComentarioDto {
  comentario: string;

  imagen?: Express.Multer.File | string;
}

export class RespuestaDto {
  @IsNotEmpty()
  respuesta: string;

  @IsNotEmpty()
  usuarioAsignado: string;
}
