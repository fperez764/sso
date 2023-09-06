import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
//import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { NextFunction, json, urlencoded } from 'express';
import {
  SWAGGER_API_CURRENT_VERSION,
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_ROOT,
  SWAGGER_API_TITLE,
} from './common';

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // const options = new DocumentBuilder()
  //   .addBearerAuth({ type: 'http', name: 'Authorization', in: 'header' }, 'X-API-KEY')
  //   .addServer(process.env.DEV_SERVER, 'Servidor local de desarrollo')
  //   .addServer(process.env.DEV_SERVER, 'Servidor de producción')
  //   .setTitle(SWAGGER_API_TITLE)
  //   .addTag('Auth')
  //   .setDescription(SWAGGER_API_DESCRIPTION)
  //   .setVersion(SWAGGER_API_CURRENT_VERSION)
  //   .build();

  // const document = SwaggerModule.createDocument(app, options);
  // SwaggerModule.setup(SWAGGER_API_ROOT, app, document, {
  //   explorer: true,
  //   swaggerOptions: {
  //     filter: true,
  //     showRequestDuration: true,
  //   },
  // });

  app.enableCors({
    origin: ['http://localhost:3000', 'http://sso.abe.bo'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(helmet.hidePoweredBy());
  app.use(helmet());
  app.setGlobalPrefix(configService.get('PATH_SUBDOMAIN') || 'api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  if (process.env.NODE_ENV !== 'production') {
    app.use((req: Request, res: Response, next: NextFunction) => {
      if (req.method.toLowerCase() === 'options') return next();
      Logger.debug(`${req.method} ${req.url}`);
      return next();
    });
  }

  const port = configService.get('SERVER_PORT');
  console.log('Servidor nest corriendo en: ' + port);
  await app.listen(port);
};

bootstrap();
