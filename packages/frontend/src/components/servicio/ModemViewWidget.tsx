import { toast } from 'react-hot-toast';
import { useAuthState } from '../../context/auth';
import { useEffect, useState } from 'react';
import { ArrowDownCircleIcon, ArrowDownIcon, ArrowUpIcon, LockClosedIcon, LockOpenIcon, PencilIcon } from '@heroicons/react/24/outline';
import { ClienteServicioModem, users_rol_enum } from '../../../types/typesSSO';
import { getModemInfo } from '@src/app/api/modem/route';
import Link from 'next/link';
import Button from '../ui/Button';
import { DataModem } from '../../../types/typesContador';
import Loading from '../ui/Loading';
import ReactDatePicker from 'react-datepicker';
import ReporteContador from '../cliente/ReporteContador';

interface Props{
    mac: string,
    coordenadas?: string|null
    verificar?: (infoMac: any) => void
}

export default function ModemViewWidget({mac, verificar, coordenadas}: Props){
    const [dataModem, setDataModem] = useState<DataModem>();
    const [loading, setLoading] = useState(false);
    const { user } = useAuthState(); 
    const admin = user?.rol === users_rol_enum.ADMIN;
    const [fromDate, setFromDate] = useState<Date>(new Date());
    const [toDate, setToDate] = useState<Date>(new Date());

    useEffect(()=>{
        fromDate.setDate(toDate.getDate() -3);
        setFromDate(fromDate);
    },[]);

    useEffect(()=>{
        fromDate.setHours(0, 0 , 0, 0);
        setFromDate(fromDate);
        toDate.setHours(23, 59, 59, 999);
        setToDate(toDate);
        setDataModem(undefined);
    },[mac, fromDate, toDate]);

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
    
  return <>
  <div className='flex justify-center space-x-6'>
    {/*Info Modem desde el servicioCliente */}
    <div className='flex flex-col items-start justify-center px-2 space-y-2 rounded-md whitespace-nowrap'>
        {mac && <h1 className='font-bold'>Modem {mac.includes(':') ? 'NEWTEC' : 'GILAT'} {mac}</h1>}
        {coordenadas && <h4 className='text-sm'><label>Coordenadas: </label>{coordenadas}</h4>}
        {!!dataModem &&<>
            <Link href={process.env.NEXT_PUBLIC_GRAFANA + dataModem.id} target='_blank'><Button title='Grafana SN1'/></Link>
            <Link href={process.env.NEXT_PUBLIC_GRAFANASN8 + dataModem.id} target='_blank'><Button title='Grafana SN8'/></Link>
        </>}
    </div>
    {/*Info Modem desde el HUB*/}
    <div className='flex flex-col px-2 space-y-2'>
        {user && <div className="flex items-center justify-center w-full cursor-pointer hover:underline" onClick={() => getInfoHub(mac || '')}> 
                <p className='font-semibold'>{dataModem ? 'Actualizar': 'Consultar HUB'}</p>
                <ArrowDownCircleIcon className='w-8 h-8 text-sky-600' />
        </div>}
        {loading && <Loading/>}
        {!!dataModem && !loading && <div className='flex flex-col whitespace-nowrap'>
            <div className='flex font-bold'>ID: {dataModem.id} {dataModem.bloqueado ? <><LockClosedIcon className='w-6 h-6 mx-2'/>Bloqueado</>:<><LockOpenIcon className='w-6 h-6 mx-2'/>Desbloqueado</>}</div>
            <p><label className='font-semibold'>Descripción:</label> {dataModem.descripcion}</p>
            <p><label className='font-semibold'>Nombre:</label> {dataModem.nombre}</p>
            <p><label className='font-semibold'>Plan:</label> {dataModem.plan}</p>
            {admin && <div className='flex my-2'>
            <Button Icon={PencilIcon} title='Modificar'/>
            <Button Icon={dataModem.plan.toUpperCase().includes('FULL') ? ArrowDownIcon : ArrowUpIcon} title={dataModem.plan.toUpperCase().includes('FULL') ? 'Limitar':'Subir a Full'}/>
            <Button Icon={dataModem.bloqueado ? LockOpenIcon : LockClosedIcon} title={dataModem.bloqueado ? 'Desbloquear':'Bloquear'}/>
            </div>}
        </div>}
    </div>
    </div>
    {dataModem && <div className='flex flex-col items-center w-full mb-2 border-t-2 border-slate-200'>
        <h2 className='text-lg font-bold'>Reportes Contador:</h2>
        <div className='flex ml-2 space-x-2'>
        <label>Desde:</label><ReactDatePicker onChange={e => setFromDate(new Date(e || fromDate))} selected={fromDate} className='w-24 rounded-md cursor-pointer'/>
        <label>Hasta:</label><ReactDatePicker onChange={e => setToDate(new Date(e || toDate))} selected={toDate} className='w-24 rounded-md cursor-pointer'/>
        </div>
        <ReporteContador mac={mac} desde={fromDate} hasta={toDate}/>
    </div>}
</>}

