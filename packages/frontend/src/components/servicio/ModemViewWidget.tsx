import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuthState } from '../../context/auth';
import { useEffect, useState } from 'react';
import { ArrowRightCircleIcon, LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/outline';
import { ClienteServicioModem } from '../../../types/typesSSO';
import { DataModem, getModemInfo } from '@src/app/api/modem/[mac]';

interface Props{
    modem?:ClienteServicioModem
    mac?: string
    verificar?: (infoMac: any) => void
}

const ModemViewWidget = ({modem, mac, verificar}: Props) => {
    const [dataModem, setDataModem] = useState<DataModem>();
    const { user } = useAuthState(); 

    useEffect(()=>{
        setDataModem(undefined);
    },[mac])

    const getInfoHub = async (mac: string) => {
        if(!mac || mac.length === 0) return toast.error('MAC invalida');
        const tGetModem = toast.loading('Obteniendo modem ' + mac);
        try {
            const res = await getModemInfo(mac);
            //if(res.status !== 200 || !res.data) throw new Error('Algo salio mal');
            setDataModem(res as DataModem);
            toast.success(JSON.stringify(res), {id: tGetModem});
            !!verificar && verificar(res);
        } catch (error: any) {
            console.error('No se pudo recuperar info del modem ' + error);
            toast.error(error.response?.data?.message || 'Algo salio mal\n' + error, {id: tGetModem});
        }
    }
    
  return (<div className='flex'>
        <div className='flex flex-col items-center mr-2'>
            {modem && <p className='font-bold'>{modem.hub}</p>}
            {modem && <h4 className='font-bold text-md'>{modem.mac}</h4>}
            {modem && <h4 className='text-sm'>{modem.coordenadas}</h4>}

            {user && !dataModem && <div className="flex"> 
                <p className='pl-2 text-sm'>Consultar hub</p>
                <ArrowRightCircleIcon className='w-6 h-6 cursor-pointer' onClick={() => getInfoHub(modem?.mac || mac || '')} />
            </div>}
        </div>
        {!!dataModem && <div className='ml-6 overflow-x-scroll overflow-y-scroll grow whitespace-nowrap'>
            {dataModem.bloqueado ? <LockClosedIcon className='w-6 h-6'/>:<LockOpenIcon className='w-6 h-6'/>}
            <p>{dataModem.descripcion}</p>
            <p>{dataModem.nombre}</p>
            <p>{dataModem.plan}</p>
            <p>{dataModem.url}</p>
        </div>}
  </div>)
}

export default ModemViewWidget
