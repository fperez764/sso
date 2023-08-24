import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';
import { CreateCategoriaDto, UpdateCategoriaDto } from './dto/servicio.dto';
import { CategoriaService } from './categoria.service';

@ApiTags('Servicios')
@ApiBearerAuth()
@Controller('categorias')
@UseGuards(JwtGuard)
export class CategoriaController {
  constructor(private catService: CategoriaService) {}
  @Get('/')
  getCategorias() {
    return this.catService.getCategorias();
  }
  @Get('/:idcategoria')
  getCategoria(@Param('idCategoria') id: string) {
    return this.catService.getCategoria(parseInt(id));
  }
  @Post('/')
  crearCategoria(@GetUser('username') username: string, @Body() categoria: CreateCategoriaDto) {
    return this.catService.crearCategoria(categoria, username);
  }
  @Put('/categorias/:idCategoria')
  actualizarCategoria(
    @Param('idCategoria') id: string,
    @GetUser('username') username: string,
    @Body() categoria: UpdateCategoriaDto,
  ) {
    return this.catService.actualizarCategoria(parseInt(id), categoria, username);
  }
}
