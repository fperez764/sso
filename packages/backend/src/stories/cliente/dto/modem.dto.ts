import { IsLatLong, IsMACAddress, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class ModemDto {
  @IsNotEmpty()
  @IsMACAddress({ no_colons: true })
  mac: string;

  @IsOptional()
  @IsLatLong()
  coordenadas?: string;

  @IsOptional()
  autoAdministrado?: boolean;
}
