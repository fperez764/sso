import {
  BadRequestException,
  ExecutionContext,
  Logger,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.user) {
    Logger.error('No se encontro información del usuario');
    return null;
  }
  if (data) {
    return request.user[data];
  }
  return request.user;
});

export const GetQueries = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.query;
});
