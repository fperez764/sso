import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, RegisterDto } from './dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from './decorator';
import { Users } from '@prisma/client';
import { JwtGuard } from './guard';
import { UserEntity } from 'src/stories/users/User.entity';
//Receive request; Call the service; return response to browser
@ApiTags('Usuarios')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBadRequestResponse({ description: 'Solo aceptara correos con dominio @abe.bo' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @ApiTags('Auth')
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @ApiBearerAuth()
  @Get('logout')
  logout() {
    return 'Auth Bearer expired';
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get('me')
  getMe(@GetUser() user: Users) {
    return { user: new UserEntity(user) };
  }

  @Get('ping')
  pong() {
    return { status: 200, message: 'pong' };
  }
}
