import { CreateTicketDto, EditTicketDto } from './dto';
import { ModemDto } from '../cliente/dto/modem.dto';
import axios from 'axios';

//@Controller('tickets')
const endpoint = '/tickets';

//@Get()
export const getTickets = async (page: number, count: number, filterKey: string) => {
    return await axios.get(`${endpoint}?${page}&${count}&${filterKey}`);
};

//@Get('/asignados') //Asigandos + asignables
export const getAsignados= async (page: number, count: number, filterKey: string) => {
    return await axios.get(`${endpoint}/asignados?${page}&${count}&${filterKey}`);
};

//@Get('/tuyos')
//Creados por ti enproceso+resueltos
export const getTusTickets = async (page: number, count: number, filterKey: string) => {
    return await axios.get(`${endpoint}/tuyos?${page}&${count}&${filterKey}`);
};

//@Get('/respondidos')
//asignados con respuesta en proceso
export const getRespondidos = async (page: number, count: number, filterKey: string) => {
    return await axios.get(`${endpoint}/respondidos?${page}&${count}&${filterKey}`);
};

//@Get('/:idTicket')
export const getTicket = async (idTicket: string) => {
    return await axios.get(`${endpoint}/${idTicket}`);
};

//@Post()
export const crearTicket = async (ticketDto: CreateTicketDto, modems: ModemDto[]) => {
   return await axios.post(`${endpoint}`, { ...ticketDto, modems: modems });
};

//@Post('/resolver/:idTicket')
export const resolverTicket = async (idTicket: string, tipo: string) => {
   return await axios.post(`${endpoint}/resolver/${idTicket}?tipo=${tipo}`);
};

//@Put('/:idTicket')
export const actualizarTicket = async (idTicket: string, nTicket: EditTicketDto) => {
   return await axios.put(`${endpoint}/${idTicket}`, nTicket);
};

//@Put('/:idTicket/anular')
export const anularTicket = async (idTicket: string) => {
  return await axios.put(`${endpoint}/${idTicket}/anular`);
};

//@Delete('/:idTicket')
export const deleteTicket = async (idTicket: string) => {
   return await axios.delete(`${endpoint}/${idTicket}`);
};

