import { IsNotEmpty, IsOptional, IsString, Length, isNotEmpty } from 'class-validator';

export class CreateServicioDto {
  @IsNotEmpty()
  @Length(3)
  nombre: string;

  @IsNotEmpty()
  @Length(3)
  descripcion: string;

  @IsOptional()
  activo: boolean;

  @IsNotEmpty()
  nombreCategoria: string;
}

export class UpdateServicioDto {
  @IsOptional()
  @Length(3)
  nombre: string;

  @IsOptional()
  @Length(3)
  descripcion: string;

  @IsOptional()
  activo: boolean;

  @IsOptional()
  nombreCategoria: string;
}

export class CreateCategoriaDto {
  @IsNotEmpty()
  @Length(3)
  nombre: string;

  @IsNotEmpty()
  @Length(3)
  descripcion: string;

  activo: boolean;
}
export class UpdateCategoriaDto {
  @IsOptional()
  @Length(3)
  nombre: string;

  @IsOptional()
  @Length(3)
  descripcion: string;

  @IsOptional()
  activo: boolean;
}
