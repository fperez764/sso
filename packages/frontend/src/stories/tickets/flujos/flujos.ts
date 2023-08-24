import axios from 'axios';
import { CreateFlujoDto, UpdateFlujoDto } from '../servicio/dto';
import { CreateAccionDto, EditAccionDto } from '../ticket/dto';
import toast from 'react-hot-toast';
import { FlujoTicketAcciones } from '@types/typesSSO';

//@Controller('flujosTickets')
const endpoint = '/flujosTickets';

  //@Get('/')
  export const getFlujos = async (page= 0, count= 10, filterKey = '') => {
    return await axios.get(`${endpoint}?${page}&${count}&${filterKey}`);
  };

  //@Get('/tipos')
  export const getTipos = async () => {
    return await axios.get(`${endpoint}/tipos`);
  };

  //@Get('/:idFlujo')
  export const getFlujoAcciones = async (idFlujo: number) => {
    return await axios.get(`${endpoint}/${idFlujo}`);
  };

  //@Get('/:idTicketFlujoAcciones')
  export const getFlujoAccionesById = async (idFlujo: string) => {
    return await axios.get(`${endpoint}/${idFlujo}`);
  };


  //@Get('/servicios/:nombreServicio')
  export const getFlujosPorServicio = async (nombreServicio: string) => {
    return await axios.get(`${endpoint}/${nombreServicio}`);
  };

  //@Post('/')
  export const crearFlujoAcciones = async (flujo: CreateFlujoDto, acciones: CreateAccionDto[]) => {
    return await axios.post(`${endpoint}`, {...flujo, acciones: acciones});
  };

  //@Post('/')
  export const crearFlujoTipo = async (tipo: string) => {
    return await axios.post(`${endpoint}`,{ tipo });
  };

  //@Delete('/:idFlujo')
  export const eliminarFlujo = async (idFlujo: string) => {
    return await axios.delete(`${endpoint}/${idFlujo}`);
  };

  //@Put('/:idFlujo')
  export const actualizarFlujoTipo = async (idFlujo: string, flujo: UpdateFlujoDto) => {
    return await axios.get(`${endpoint}/${idFlujo}`, flujo);
  };

  //@Post('/acciones/:idAccionAnterior')
  export const insertarAccionFlujo = async (
    accionAnterior: FlujoTicketAcciones,
    flujo: CreateAccionDto,
  ) => {
    if(!accionAnterior) return undefined;
    console.log('anterior:', accionAnterior);
    const t = toast.loading('Guardando...');
    try {
      const nuevaAccion = {
        ...flujo,
        orden: accionAnterior.orden + .5,
        nombreFlujo: accionAnterior.nombreFlujo
      }
      console.log(`${endpoint}/acciones/${accionAnterior.id}`);
      await axios.post(`${endpoint}/acciones/${accionAnterior.id}`, nuevaAccion);
      toast.success('Accion agregada correctamente.', {id: t});
    } catch (err) {
      toast.error('No se pudo agregar la accion.', {id: t});
    }
  }

  //@Put('/acciones/:idAccion')
  export const actualizarAccionFlujo = async (
    accionOriginal: FlujoTicketAcciones,
    flujo: EditAccionDto,
  ) => {
    if(!accionOriginal) return undefined;
    const t = toast.loading('Actualizando...');
    try {
      await axios.put(`${endpoint}/acciones/${accionOriginal.id}`, flujo);
      toast.success('Accion actualizada correctamente.', {id: t});
    } catch (err) {
      toast.error('No se pudo actualizar la accion.', {id: t});
    }
  }

  //@Delete('/acciones/:idAccion')
  export const eliminarAccionFlujo = async (
    idFlujo: number,
  ) => {
    if(!idFlujo) return true;
    const t = toast.loading('Actualizando...');
    try {
      await axios.delete(`${endpoint}/acciones/${idFlujo}`);
      toast.success('Accion eliminada correctamente.', {id: t});
      return true;
    } catch (err) {
      toast.error('No se pudo eliminar la accion.', {id: t});
      return false;
    }
  }
  