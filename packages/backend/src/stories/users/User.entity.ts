import { Users, users_area_enum, users_dep_enum, users_rol_enum } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class UserEntity implements Users {
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  id: number;
  fechaCreacion: Date;
  usuarioCreacion: string | null;
  username: string;
  email: string;
  activo: boolean;
  @Exclude()
  password: string;
  area: users_area_enum;
  departamento: users_dep_enum;
  rol: users_rol_enum;
}
