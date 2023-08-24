import { Module } from '@nestjs/common';
import { ServicioController } from './servicio.controller';
import { ServicioService } from './servicio.service';
import { CategoriaController } from './categoria.controller';
import { CategoriaService } from './categoria.service';

@Module({
  controllers: [ServicioController, CategoriaController],
  providers: [ServicioService, CategoriaService],
})
export class ServicioModule {}
