import { IsLatLong, IsMACAddress, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class ModemDto {
  @IsNotEmpty()
  mac: string;

  @IsOptional()
  @IsLatLong()
  coordenadas?: string;

  @IsOptional()
  autoAdministrado?: boolean;
}
