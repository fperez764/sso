import { Users, users_area_enum } from '.prisma/client';
import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { EditUserDto } from './dto';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from './User.entity';

@ApiTags('Usuarios')
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtGuard)
  @Patch()
  async editUser(@GetUser('id') userId: number, @Body() dto: EditUserDto) {
    return new UserEntity(await this.userService.editUser(userId, dto));
  }

  @Get('/areas')
  getAreas() {
    return { list: Object.values(users_area_enum) };
  }

  @UseGuards(JwtGuard)
  @Get('/')
  async getAll(@GetUser() user: Users) {
    const users = await this.userService.getUsersFromUserArea(user);
    return users.map((user) => new UserEntity(user));
  }

  @UseGuards(JwtGuard)
  @Get('/:area')
  async getUsersPorArea(@Param('area') area: string) {
    const users = await this.userService.getUsersPorArea(area);
    return users.map((user) => new UserEntity(user));
  }
}
