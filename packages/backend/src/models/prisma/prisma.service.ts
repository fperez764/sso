import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'info' },
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      errorFormat: 'colorless',
    });

    this.$use(async (params, next) => {
      // Check incoming query type
      if (params.action == 'delete') {
        Logger.warn('Prisma-Delete intercepted');
        // Change action to an update
        params.action = 'update';
        params.args['data'] = params.args.username
          ? { fechaBaja: new Date(), usuarioBaja: params.args.username }
          : { fechaBaja: new Date() };
      }
      // if (params.action == 'deleteMany') {
      //   Logger.warn('Prima-DeleteMany intercepted');
      //   params.action = 'updateMany';
      //   if (params.args.data != undefined) {
      //     params.args.data = { fechaBaja: new Date(), usuarioBaja: params.args.username };
      //   } else {
      //     params.args['data'] = { fechaBaja: new Date(), usuarioBaja: params.args.username };
      //   }
      // }
      return next(params);
    });
  }
  cleanDb() {
    return this.$transaction([this.users.deleteMany()]);
  }
}
