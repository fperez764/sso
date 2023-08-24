import { Injectable, Logger } from '@nestjs/common';
import { EditUserDto } from './dto';
import { Users, users_area_enum, users_rol_enum } from '.prisma/client';
import { PrismaService } from 'src/models/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    const user = await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        ...dto,
      },
    });
    return user;
  }

  async getUsersFromUserArea(user: Users) {
    try {
      const users = await this.prisma.users.findMany({
        where: {
          ...(user.rol === users_rol_enum.ADMIN ? { area: users_area_enum[user.area] } : {}),
        },
      });
      const userFirst = users.sort((x, y) =>
        x.username === user.username ? -1 : y.username === user.username ? 1 : 0,
      );
      return userFirst;
    } catch (error) {
      Logger.error('getUsers: Algo salio mal\n' + error);
      throw 'No se pudieron obtener usuarios ' + error;
    }
  }

  getUsersPorArea = async (area: string) => {
    try {
      const users = await this.prisma.users.findMany({
        where: { area: users_area_enum[area] },
      });
      if (!users || users.length === 0) {
        Logger.warn('No hay usuarios en el area: ' + area + '. Se mostraran admins');
        return await this.prisma.users.findMany({
          where: { rol: users_rol_enum.ADMIN },
        });
      }
      return users;
    } catch (error) {
      Logger.error('getUsersPorArea: Algo salio mal\n' + error);
      throw 'Algo salio mal\n' + error;
    }
  };
}
