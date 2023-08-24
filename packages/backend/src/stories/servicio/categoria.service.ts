import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/models/prisma/prisma.service';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/servicio.dto';

@Injectable()
export class CategoriaService {
  constructor(private prisma: PrismaService) {}

  getCategorias = async () => {
    return await this.prisma.categoriaServicio.findMany({
      include: { servicios: true },
    });
  };

  getCategoria = async (idCategoria: number) => {
    return await this.prisma.categoriaServicio.findUnique({
      where: { id: idCategoria },
      include: { servicios: true },
    });
  };

  crearCategoria = async (categoria: CreateCategoriaDto, username: string) => {
    Logger.log('Crear servicio');
    return await this.prisma.categoriaServicio.create({
      data: {
        ...categoria,
        usuarioCreacion: username,
      },
    });
  };

  actualizarCategoria = async (
    idCategoria: number,
    categoria: UpdateCategoriaDto,
    username: string,
  ) => {
    return await this.prisma.categoriaServicio.update({
      where: { id: idCategoria },
      data: { ...categoria, usuarioCreacion: username },
    });
  };

  eliminarCategoria = async (idCategoria: number, username: string) => {
    return await this.prisma.categoriaServicio.update({
      where: { id: idCategoria },
      data: {
        usuarioBaja: username,
        fechaBaja: new Date(),
      },
    });
  };
}
