import { BadRequestException, ExecutionContext, createParamDecorator } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.user) throw new BadRequestException('No se encontro información del usuario');
  if (data) {
    return request.user[data];
  }
  return request.user;
});

export const GetQueries = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.query;
});
