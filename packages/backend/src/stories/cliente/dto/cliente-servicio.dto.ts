import {
  IsArray,
  IsBoolean,
  IsLatLong,
  IsMACAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
} from 'class-validator';
import { ModemDto } from './modem.dto';

export class CreateClienteServicioDto {
  @IsBoolean()
  contrato: boolean;

  @IsBoolean()
  activo: boolean;

  @IsNotEmpty()
  @Length(3)
  instalador: string;

  @IsNotEmpty()
  nombreServicio: string;

  @IsOptional()
  @IsArray()
  serialesEquipos?: string[];

  @IsOptional()
  @IsArray()
  modems?: ModemDto[];

  @IsNotEmpty()
  idCliente: number;
}

export class UpdateClienteServicioDto {
  @IsBoolean()
  contrato?: boolean;

  @IsNotEmpty()
  @Length(3)
  instalador?: string;

  @IsNotEmpty()
  nombreServicio?: string;

  @IsArray()
  serialesEquipos?: string[];
}
