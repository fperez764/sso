import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { AuthDto, RegisterDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import * as ldap from 'ldapjs';
import { PrismaService } from 'src/models/prisma/prisma.service';
import { Users } from '@prisma/client';
import { UserEntity } from 'src/stories/users/User.entity';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const emailABE = '@abe.bo';
    if (!dto.email.includes(emailABE)) return 'Correo debe ser del dominio @abe.bo';
    //Generate password
    const hash = await argon.hash(dto.email);
    //Save the user in DB
    try {
      const user = await this.prisma.users.create({
        data: {
          email: dto.email,
          password: hash,
          username: dto.email.replace(emailABE, ''),
          usuarioCreacion: 'registerTickets',
        },
      });
      return this.signToken(user.id, user.email);
    } catch (error) {
      if ('code' in error && error.code === 'P2002')
        throw new ForbiddenException('Credenciales repetidas');
      throw 'No se pudo registrar el usuario:\n' + error;
    }
  }
  async login(dto: AuthDto): Promise<{ access_token: string; user: UserEntity }> {
    //find the user by email or username
    const userRaw = await this.prisma.users.findFirst({
      where: { email: { startsWith: dto.username } },
    });
    const user = new UserEntity(userRaw);
    //If user does not exist GuardCondition: throw exception
    if (!userRaw) throw new ForbiddenException('Ese correo o nombre de usuario no existe');
    //LDAP authentication with Zimbra
    try {
      if (
        this.config.get('LDAP_ENABLED') &&
        (await this.ldapAuthenticate(dto.username, dto.password))
      )
        return { ...(await this.signToken(userRaw.id, userRaw.username)), user };
    } catch (error) {
      Logger.warn('Contraseña LDAP incorrecta, se intentara usar el registro en BD.');
    }
    //Compare db password
    const pwMatches = await argon.verify(userRaw.password, dto.password);
    if (!pwMatches) throw new ForbiddenException('Credenciales incorrectas');
    return { ...(await this.signToken(userRaw.id, userRaw.username)), user };
  }

  async signToken(userId: number, email: string): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('SESSION_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '12h',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  async ldapAuthenticate(username: string, password: string) {
    return new Promise(function (resolve, reject) {
      try {
        let client: ldap.Client;
        client = ldap.createClient({
          url: process.env.LDAP_SERVER,
          connectTimeout: 6000,
        });
        client.on('timeout', function (err) {
          Logger.log('Timeout .....' + err);
          resolve(false);
        });
        client.on('error', function (err) {
          Logger.warn('LDAP connection failed, it will reconnect', err);
          resolve(false);
        });
        client.on('connect', function () {
          client.bind(`uid=${username},ou=people,dc=abe,dc=bo`, password, function (err) {
            resolve(err ? false : true);
          });
        });
      } catch (err) {
        Logger.error('Algo salio mal al autenticar usuario por LDAP\n' + err);
        resolve(false);
      }
    });
  }
}
