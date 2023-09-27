import { equipo_estado_enum } from '@prisma/client';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateODMDto {
  @IsNotEmpty()
  @Length(3)
  nombreInstalador: string;
  @IsNotEmpty()
  lugarRecojo: string;
  @IsNumberString()
  horasViaje: string;
  @IsNumberString()
  precioAcordado: string;
  @IsNotEmpty()
  fechaVisitaProgramada: Date;
  @IsNotEmpty()
  diagnostico: string;
  @IsOptional()
  detalles: string;
  @IsNotEmpty()
  equipos: string;
}

export class EditODMDto {
  @IsOptional()
  @Length(3)
  nombreInstalador: string;
  @IsOptional()
  lugarRecojo: string;
  @IsOptional()
  @IsNumberString()
  horasViaje: string;
  @IsOptional()
  @IsNumberString()
  precioAcordado: string;
  @IsOptional()
  fechaVisitaProgramada: Date;
  @IsOptional()
  diagnostico: string;
  @IsOptional()
  detalles: string;
  @IsOptional()
  equipos: string;
}

export class CreateODMEquipoDto {
  @IsNotEmpty()
  tipo: string;
  @IsNotEmpty()
  marca: string;
  @IsNotEmpty()
  modelo: string;
  @IsNotEmpty()
  serial: string;
  @IsNotEmpty()
  mac: string;
  @IsNotEmpty()
  estado: equipo_estado_enum;
  @IsOptional()
  observaciones: string;
}
