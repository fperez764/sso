import axios from 'axios';
import { CreateServicioDto, UpdateServicioDto } from './dto/servicio.dto';

//@Controller('servicios')
const endpoint = '/servicios';

//@Get('/')
export const getServicios = async () => {
  await axios.get(`${endpoint}`);
};
//@Get('/:idservicio')
export const getServicio = async (idServicio: string) => {
  await axios.get(`${endpoint}/${idServicio}`);
};
//@Post('/')
export const crearServicio = async (servicio: CreateServicioDto) => {
  await axios.post(`${endpoint}`, servicio);
};
//@Put('/:idservicio')
export const actualizarServicio = async (idServicio: string, servicio: UpdateServicioDto) => {
  await axios.put(`${endpoint}/${idServicio}`, servicio);
};

