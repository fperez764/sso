import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuthState } from '../../context/auth';
import { useState } from 'react';
import { ArrowRightCircleIcon } from '@heroicons/react/24/outline';
import InputB from '../InputB';
import { ClienteServicioModem } from '../../../types/typesSSO';

interface DataModem {
    mac: string
    nombre: string
    descripcion: string
    plan: string
    estadoModem?: string
    estadoBloqueo: string
    managedgroup?: string
    subscriber?: string
    adminstate?: string
}

interface Props{
    modem?:ClienteServicioModem
    mac?: string
}

const ModemViewWidget = ({modem, mac}: Props) => {
    const [dataModem, setDataModem] = useState<DataModem>();
    const { user } = useAuthState(); 
    const getInfoHub = async (mac: string) => {
        if(!mac || mac.length === 0) return toast.error('MAC invalida');
        const tGetModem = toast.loading('Obteniendo modem ' + mac);
        try {
            if(dataModem) return;
            const res = await axios.get(`http://localhost:3000/api/modem/${mac}`);
            toast.success(res.data.message, {id: tGetModem});
            setDataModem(res.data.data);                
        } catch (error: any) {
            console.error('No se pudo recuperar info del modem ' + error);
            toast.error(error.response?.data?.message || 'Algo salio mal\n' + error, {id: tGetModem});
        }
      }
    
  return (<div className='flex'>
        <div className='flex flex-col items-center mr-2'>
            {modem && <p className='font-bold'>{modem.hub}</p>}
            {modem && <h4 className='text-sm'>{modem.mac}</h4>}
            {modem && <h4 className='text-sm'>{modem.coordenadas}</h4>}

            {user && !dataModem && <ArrowRightCircleIcon className='w-6 h-6 cursor-pointer' onClick={() => getInfoHub(modem?.mac || mac || '')} />}
        </div>
        {!!dataModem && <div className='grid h-16 grid-cols-3 overflow-x-scroll overflow-y-scroll grow whitespace-nowrap'>
            <InputB placeholder='Nombre' value={dataModem.nombre} disabled className='text-sm'/>
            <InputB placeholder='Plan' value={dataModem.plan} disabled className='text-sm'/>
            <InputB placeholder='Estado' value={dataModem.estadoBloqueo ? 'Bloqueado' : 'Desbloqueado'} disabled className='text-sm'/>
            <InputB placeholder='Descripcion' value={dataModem.descripcion} disabled className='col-span-3 text-sm'/>
        </div>}
  </div>)
}

export default ModemViewWidget
