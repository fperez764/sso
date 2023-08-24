//@Controller('categorias')
import axios from 'axios';

const endpoint = '/categorias';
type CreateCategoriaDto = object;
type UpdateCategoriaDto = object;

//@Get('/')
export const getCategorias = async () => {
return await axios.get(`${endpoint}`);
};

//@Get('/:idcategoria')
export const getCategoria = (idCategoria: string) => {
return axios.get(`${endpoint}/${idCategoria}`);
};
//@Post('/')
export const crearCategoria = (categoria: CreateCategoriaDto) => {
return axios.get(`${endpoint}`, categoria);
};
//@Put('/categorias/:idCategoria')
export const actualizarCategoria = (
    idCategoria: string, categoria: UpdateCategoriaDto,
) => {
return axios.get(`${endpoint}/${idCategoria}`, categoria);
};
