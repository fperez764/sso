import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './stories/users/users.module';
import { ClienteModule } from './stories/cliente/cliente.module';
import { PrismaModule } from './models/prisma/prisma.module';
import { ServicioModule } from './stories/servicio/servicio.module';
import { FlujoModule } from './stories/flujo/flujo.module';
import { TicketModule } from './stories/ticket/ticket.module';
import { UsersService } from './stories/users/users.service';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
//import { join } from 'path';
//import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    //ServeStaticModule.forRoot({ rootPath: join(__dirname, '../..', 'frontend', '.next') }),
    UsersModule,
    ClienteModule,
    AuthModule,
    PrismaModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServicioModule,
    FlujoModule,
    TicketModule,
    ScheduleModule.forRoot(),
    MailerModule.forRoot({transport: {
      host: process.env.MAIL_HOST,
      port: parseInt(process.env.MAIL_PORT || '25'),
      secure: false,
      tls: {rejectUnauthorized: false},
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
      }
    }})
  ],
  controllers: [],
  providers: [UsersService],
})
export class AppModule {}
