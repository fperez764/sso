import { equipo_estado_enum } from '@prisma/client';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
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

export class CreateADEDto {
  @IsNotEmpty()
  @Length(3)
  nombreInstalador: string;
  @IsNotEmpty()
  @Length(3)
  lugarRecojo: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  equipos: RegisterEquipoDto[];
  @IsOptional()
  observaciones: string;
}

export class EditADEDto {
  @IsOptional()
  @Length(3)
  nombreInstalador: string;
  @IsOptional()
  @Length(3)
  lugarRecojo: string;
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  equipos: RegisterEquipoDto[];
  @IsOptional()
  observaciones: string;
}

export class RegisterEquipoDto {
  @IsOptional()
  id: number;
  @IsNotEmpty()
  @Length(3)
  tipo: string;
  @IsNotEmpty()
  @Length(2)
  marca: string;
  @IsOptional()
  modelo: string;
  @IsNotEmpty()
  @Length(3)
  serial: string;
  @IsOptional()
  mac: string;
  @IsNotEmpty()
  estado: equipo_estado_enum;
  @IsOptional()
  observaciones: string;
}
