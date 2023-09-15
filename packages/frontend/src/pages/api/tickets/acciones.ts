import axios from 'axios';
import { CreateAccionDto, CreateComentarioDto, EditAccionDto, RespuestaDto } from '../dto';
import toast from 'react-hot-toast';
import { ClienteServicioTicketAccion, users_area_enum } from '@types/typesSSO';
  
//@Controller('ticketsAcciones')
const endpoint = '/ticketsAcciones';

//@Get('/:idTicketAccion')
export const getTicketAccion = async (idAccion: number) => {
    const res = await axios.get(`${endpoint}/${idAccion}`);
    return res.data;
};

export const insertarAccionParaCerrarTicket = async (accionAnterior: ClienteServicioTicketAccion) => {
    const accionPorDefecto = {
        area: users_area_enum.ATENCION_CLIENTE,
        accion: 'CONFIRMAR Y CERRAR TICKET',
        orden: accionAnterior.orden + .5,
        idTicket: accionAnterior.idTicket,
        vigenciaDias: 1        
    } as ClienteServicioTicketAccion;
    return await insertarAccionDespuesDeAccion(accionAnterior, accionPorDefecto);
}

//@Post('/:idTicketAccionAnterior')
export const insertarAccionDespuesDeAccion = async (accionAnterior: ClienteServicioTicketAccion, partialNewAction: CreateAccionDto) => {
    if(!accionAnterior) return undefined;
    const tNAccion = toast.loading('Insertando nueva acción para flujo.');
    try {
        const nAccion = { 
            ...partialNewAction, 
            orden: accionAnterior.orden + .5, 
            idTicket: accionAnterior.idTicket
        } as ClienteServicioTicketAccion;

        console.log(partialNewAction)
        const res = await axios.post(`${endpoint}/${accionAnterior.id}`, nAccion);
        toast.success('Nueva acción guardada.', { id: tNAccion });
        return res.data;
    } catch (error: any) {
        toast.error('No se pudo guardar la nueva acción.\n' + JSON.stringify(error.response?.data || error), {id: tNAccion});
        return undefined;
    }
};

//@Put('/:idTicketAccion')
export const modificarAccion = async (originalAction: ClienteServicioTicketAccion, partialNewAction: EditAccionDto) => {
    if(!originalAction) return undefined;
    const tNAccion = toast.loading('Modificando acción para flujo.');
    try {
        const nAccion = { 
            ...partialNewAction, 
            orden: originalAction.orden, 
            idTicket: originalAction.idTicket
        } as ClienteServicioTicketAccion;
        const res = await axios.put(`${endpoint}/${originalAction.id}`, nAccion);
        toast.success('Acción actualizada.', { id: tNAccion });
        return res.data;
    } catch (error: any) {
        toast.error(error.code + 'No se pudo actualizar la respuesta ' + JSON.stringify(error.message), {id: tNAccion});
        return undefined;
    }
};

//@Post('/:idTicketAccion/iniciar')
export const iniciarEspera = async (idAccion: number) => {
    try {
        const res = await axios.post(`${endpoint}/${idAccion}/iniciar`);
        toast.success('Vigencia inicializada! \n' + res.data);
        return res.data;
    } catch (error: any) {
        toast.error('No se pudo guardar el flujo:\n' + JSON.stringify(error.response?.data || error));
        return undefined;
    }
};

//@Post('/:idTicketAccion/leido')
//Si la respuesta esta asignada y el ususario asignado la renderiza en este componente se marca como leida.
export const marcarComoLeido = async (idAccion: number) => {    
    if(!idAccion) return;
    try {
        const accionRes = await axios.post(`${endpoint}/leido`);
        toast.success('Respuesta marcada como leida.');
        return accionRes.data;
    } catch (error: any) {
        console.error('No se pudo marcar como leída: \n' + error);
        return undefined;
    }
};

//@Post('/:idTicketAccion/asignar')
export const asignar = async (idAccion: number, usuarioAsignado: string) => {
    await axios.post(`${endpoint}/${idAccion}/asignar`, { usuarioAsignado});
    if (!usuarioAsignado) {
        toast.error('Selecciona un usuario para asignarlo');
        return;
    }
    const tAsignar = toast.loading('Asignando esta acción a funcionario ' + usuarioAsignado);
    try {
        const res = await axios.post(`/ticketsAcciones/${idAccion}/asignar`, { usuarioAsignado });
        toast.success('Acción de ticket asignada a ' + usuarioAsignado, { id: tAsignar });
        return res.data;
    } catch (error: any) {
        toast.error(`Algo salio mal ${JSON.stringify(error.response?.data || error)}`, { id: tAsignar });
        return undefined;
    }
};

//@Post('/:idTicketAccion/responder')
export const responderAccion = async (idAccion: number, respuesta: string) => {
    if (!respuesta) {
        toast.error('Respuesta vacia');
        return undefined;
    }
    const responderToast = toast.loading('Guardando respuesta...');
    try {
        const res = await axios.post(`${endpoint}/${idAccion}/responder`, { respuesta });
        toast.success(`Respuesta publicada ${res.data?.respuesta + ' a ' + res.data?.accion}.`, {
            id: responderToast,
        });
        return res.data;
    } catch (error: any) {
        toast.error(`No se pudo responder: ${JSON.stringify(error.response?.data?.message)}`, { id: responderToast });
        return undefined;
    }
};

//@Post('/:idTicketAccion/rechazar')
export const rechazarAccion = async (idAccion: number, respuesta: string) => {
    if (!respuesta) {
        toast.error('Respuesta vacia');
        return undefined;
    }
    if (respuesta === 'Hecho') {
        toast.error('Texto rechazo no puede ser "Hecho"');
        return undefined;
    }
    const responderToast = toast.loading('Rechazando...');
    try {
        const res = await axios.post(`${endpoint}/${idAccion}/rechazar`, { respuesta });
        toast.success('Respuesta rechazada.', {
            id: responderToast,
        });
        return res.data;
    } catch (error: any) {
        toast.error(`No se pudo rechazar: ${JSON.stringify(error.response)}`, {
            id: responderToast,
        });
        return undefined;
    }
};

//@Delete('/:idTicketAccion')
export const eliminarPasoAccion = async (idAccion: number) => {
    const res = await axios.delete(`${endpoint}/${idAccion}`);
    return res.data;
};

//@Post('/:idTicketAccion/comentar')
export const comentarAccion = async (comentario: CreateComentarioDto, idAccion: number) => {
    const res = await axios.post(`${endpoint}/${idAccion}/comentar`, comentario);
    return res.data;
};

//@Delete('/comentario/:idComentario')
export const anularComentario = async (idComentario: number) => {
    const res = await axios.delete(`${endpoint}/${idComentario}`);
    return res.data;
};

export const sugerirAccion = async (nombreFlujo: string, ordenAntAccion: number)=>{
    try {
        const res =  await axios.get(`${endpoint}/sugerir?nombreFlujo=${nombreFlujo}&orden=${ordenAntAccion}`);
        if(!res.data) toast.error(`No existe una sugerencia para el flujo ${nombreFlujo} con la acción ${ordenAntAccion + 1}`);
        return res.data;            
    } catch (error) {
        console.error(error);
        toast.error(`Algo salio mal al buscar la acción sugerida por el flujo\n${error.response?.data?.message}`);
        return null;
    }
};
