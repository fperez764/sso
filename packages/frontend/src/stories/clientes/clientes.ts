//@Controller('clientes')

import axios from 'axios';
import { toast } from 'react-hot-toast';
const endpoint = '/clientes';
type createClienteDto = object;
type UpdateClienteDto = object;
type UpdateContactoDto = object;
type CreateContactoDto = object;


//  @Get()
export const getClientes = async (page= 0, count= 10, filterKey = '') => {
    return await axios.get(`${endpoint}?${page}&${count}&${filterKey}`);
};

export const getCliente = async (idCliente: number) => {
    if (!idCliente) return;
    try {
        const res = await axios.get(`${endpoint}/${idCliente}`);
        return res.data;
    } catch (error) {
        toast.error('No se encontro al cliente.\n' + JSON.stringify(error));
        return undefined;
    }
};


export const crearCliente = async (cliente: createClienteDto) => {
    return await axios.post(`${endpoint}`, cliente);
};

export const actualizarCliente = async (idCliente: number, cliente: UpdateClienteDto) => {
    return await axios.put(`${endpoint}/${idCliente}`, cliente);
};

//@Put('contacto/:nroDocumento')
export const actualizarContacto = async (nroDocumento: string, contacto: UpdateContactoDto) => {
    return await axios.put(`${endpoint}/${nroDocumento}`, contacto);
};

//@Post('/:idCliente/contacto')
export const agregarContacto = async (idCliente: number, contacto: CreateContactoDto) => {
    return await axios.post(`${endpoint}/${idCliente}`, contacto);
};

//@Delete
export const eliminarCliente = async (idCliente: number)=>{
    const tE = toast.loading('Eliminando...');
    try {
        const res = await axios.delete(`${endpoint}/${idCliente}`);
        toast.success('Cliente eliminado', {id: tE});
        console.log(res);
    } catch (error) {
        toast.error('Algo salio mal al intentar eliminar al cliente ' + idCliente, {id: tE});
        console.error(error);
    }
};
