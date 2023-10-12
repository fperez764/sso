import { equipo_estado_enum } from '@prisma/client';
import { IsNotEmpty, IsNumberString, IsOptional, Length } from 'class-validator';

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
  nombreInstalador: string;
  @IsNotEmpty()
  lugarRecojo: string;
  @IsNotEmpty()
  equipos: RegisterEquipoDto[];
  @IsOptional()
  observaciones: string;
}

export class EditADEDto {
  @IsOptional()
  nombreInstalador: string;
  @IsOptional()
  lugarRecojo: string;
  @IsOptional()
  equipos: EditEquipoDto[];
  @IsOptional()
  observaciones: string;
}

export class RegisterEquipoDto {
  @IsOptional()
  id: number;
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
export class EditEquipoDto {
  @IsOptional()
  tipo: string;
  @IsOptional()
  marca: string;
  @IsOptional()
  modelo: string;
  @IsOptional()
  serial: string;
  @IsOptional()
  mac: string;
  @IsOptional()
  estado: equipo_estado_enum;
  @IsOptional()
  observaciones: string;
}
