import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { EditUserDto } from './dto';
import { Users, users_area_enum, users_dep_enum, users_rol_enum } from '@prisma/client';
import { PrismaService } from 'src/models/prisma/prisma.service';
import { UserEntity } from './User.entity';

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
    return new UserEntity(user);
  }

  async getUsersFromUserArea(user: Users) {
    try {
      if (!user) return (await this.prisma.users.findMany({where: {activo: true}})).map((user) => new UserEntity(user));
      const users = await this.prisma.users.findMany({
        where: {
          ...(user.rol === users_rol_enum.ADMIN ? { area: users_area_enum[user.area] } : {activo: true}),
        },
      });
      const userFirst = users.sort((x, y) =>
        x.username === user.username ? -1 : y.username === user.username ? 1 : 0,
      );
      return userFirst.map((user) => new UserEntity(user));
    } catch (error) {
      Logger.error('getUsers: Algo salio mal\n' + error);
      throw 'No se pudieron obtener usuarios ' + error;
    }
  }

  getUsersPorArea = async (area: string) => {
    const mainArea = area.split('_')[0];
    try {
      const users = await this.prisma.users.findMany({
        where: { activo: true, OR: [{ area: users_area_enum[Object.values(users_area_enum).find(a => a.includes(mainArea)) || users_area_enum.ATENCION_CLIENTE] }, 
        { departamento: users_dep_enum[Object.values(users_area_enum).find(a => a.includes(mainArea)) || users_dep_enum.COMERCIAL] }] },
      });
      if (!users || users.length === 0) throw new NotFoundException('No hay usuarios en el area: ' + area + '. Comercial puede responder');
      
      //completes all users in the dept
      const allUsers = await this.prisma.users.findMany({
        where: { departamento: users[0].departamento },
      });
      return allUsers.map((user) => new UserEntity(user));
    } catch (error) {
      Logger.error('getUsersPorArea: Algo salio mal\n' + error.message);
      const coms = await this.prisma.users.findMany({
        where: { departamento: users_dep_enum.COMERCIAL },
      });
      return coms.map(u => new UserEntity(u));
    }
  };
}
