import { users_area_enum, users_dep_enum, users_rol_enum } from '.prisma/client';
import { IsEmail, IsOptional } from 'class-validator';

export class EditUserDto {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  activo: boolean;

  @IsOptional()
  area: users_area_enum;

  @IsOptional()
  departamento: users_dep_enum;

  @IsOptional()
  rol: users_rol_enum;
}
