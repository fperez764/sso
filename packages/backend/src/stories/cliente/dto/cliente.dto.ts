import { cliente_tipodocumentofacturacion_enum, cliente_persona_enum } from '@prisma/client';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  Length,
  isNumber,
} from 'class-validator';

export class CreateClienteDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(1)
  nroDocumentoFacturacion: string;

  @IsNotEmpty()
  tipoDocumentoFacturacion: cliente_tipodocumentofacturacion_enum;

  @IsNotEmpty()
  @Length(3)
  razonSocial: string;

  @IsOptional()
  tipo?: cliente_persona_enum;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  nroDocumento: string;

  @IsNotEmpty()
  @Length(3)
  nombreCompleto: string;

  @IsNotEmpty()
  @Length(3)
  direccion: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  telefono: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class UpdateContactoDto {
  @IsOptional()
  @IsNumberString()
  @Length(6)
  nroDocumento?: string;

  @IsOptional()
  @Length(3)
  nombreCompleto?: string;

  @IsOptional()
  @Length(3)
  direccion?: string;

  @IsOptional()
  @IsNumberString()
  @Length(6)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}
export class UpdateClienteDto {
  @IsOptional()
  @IsNumberString()
  @Length(6)
  nroDocumentoFacturacion?: string;

  @IsOptional()
  tipoDocumentoFacturacion?: cliente_tipodocumentofacturacion_enum;

  @IsOptional()
  @Length(3)
  razonSocial?: string;

  @IsOptional()
  tipo?: cliente_persona_enum;

  @IsOptional()
  @IsNumberString()
  @Length(6)
  nroDocumento: string;

  @IsOptional()
  @Length(3)
  nombreCompleto: string;

  @IsOptional()
  @Length(3)
  direccion?: string;

  @IsOptional()
  @IsNumberString()
  @Length(6)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class CreateContactoDto {
  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  nroDocumento: string;

  @IsNotEmpty()
  @Length(3)
  nombreCompleto: string;

  @IsOptional()
  @Length(3)
  direccion?: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  telefono?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class GetByIdDto {
  @IsNotEmpty()
  id: number;
}
export class GetByNombreDto {
  @IsNotEmpty()
  @Length(3)
  nombre: string;
}

export class GetByNroDocDto {
  @IsNotEmpty()
  @IsNumberString()
  nroDocumento: string;
}
