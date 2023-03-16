import { CheckCircleIcon, CurrencyDollarIcon, DevicePhoneMobileIcon, DeviceTabletIcon, ExclamationCircleIcon, PlayPauseIcon, SwatchIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ClienteServicio, SeveridadTicket, getColorSeveridad} from '../../../types/typesSSO';
import Button from '../Button';
import NuevoTicket from '../flujos/NuevoTicketWidget';

interface Props {
    clienteServicio: ClienteServicio,
}

export default function ClienteServicioWidget({ clienteServicio }: Props) {
    const porImplementar = async () => {
        toast.error('Por implementar');
    };

    const nuevoTicket = async () => {
        toast((t) => (
            <div className='flex flex-col'>
            <XCircleIcon className='self-end w-6 h-6'onClick={()=>{toast.dismiss(t.id)}}/>
            <NuevoTicket clienteServicio={clienteServicio} handleCancel={()=>{toast.dismiss(t.id)}}/>
            </div>
          ), {duration: 100000});
    };
    const css = `w-8 h-8 mx-2 rounded-full ${clienteServicio.tickets.length > 0 ? 'bg-yellow-500' : clienteServicio.activo ? 'bg-green-400':'bg-red-400'}`;
  return (<div className='border-y border-blue-300'>
    <div className="flex">
        {/*Nombre*/}
        <h1 className="font-bold whitespace-nowrap">{clienteServicio.servicio.nombre}</h1>
        {/*Exist Ticket Icon*/}
        {clienteServicio.tickets.length > 0 ? <ExclamationCircleIcon className={css}/> : clienteServicio.activo ? <CheckCircleIcon className={css}/> : <XCircleIcon className={css}/>}
        {/*TicketsList*/}
        <div className='flex-col'>
            <p className='text-sm'>{clienteServicio.tickets?.length > 0 && 'Tickets:'}</p>
            <ul className="ml-5">
            {clienteServicio.tickets?.map(tick => {
                return <li className={`list-disc rounded-md bg-${getColorSeveridad} mt-1`}>
                        <h4>{`${tick.grupo?.nombre ?? 'GrupoTipo ticket'}: ${tick.descripcion}`}</h4>
                        <p className='text-xs'>{`${(tick.respuestasCount ?? 'x/y') + ' respondidas'}`}</p>
                    </li>
            })}</ul>
        </div>
    </div>
    {/*PeriodoWidget TODO: reemplazar por PeriodosWidget*/}
    <div>
        <h4 className="mb-2 text-lg font-bold">
            Periodo: {clienteServicio.periodos?.length > 0 ? clienteServicio.periodos[0].id : 'No tiene periodos activos'}
        </h4>
        <div className='bg-gray-300 rounded-md -mt-3 mb-3 px-2'>PeriodoID;Acciones?;FecahInicio;FechaFin;Factura;Pagado</div>
        <div className='flex justify-center'>
            {clienteServicio.periodos?.find(p=>p.activo)?.id ?? <Button Icon={CurrencyDollarIcon} onClick={porImplementar} title='Crear periodo'/>}
        </div>
        {clienteServicio.periodos?.find(p => p.activo) && <>
            <h4 className="mb-2 text-lg font-bold">Paquetes activos:</h4> 
            <Button Icon={CurrencyDollarIcon} onClick={porImplementar} title='Agregar paquete'/>
        </>}
    </div>
    {/*ModemWidget TODO: reemplazar por ModemWidget*/}
    <div>
        <h4 className="mb-2 text-lg font-bold">
            Modems: {clienteServicio.modems?.length > 0 ? clienteServicio.modems[0].mac : 'No tiene modems asignados'}
        </h4>
        <div className='bg-blue-300 rounded-md -mt-3 mb-3 px-2'>ModemID;ModemMac;ModemHub</div>
        {clienteServicio.modems.map(m => `${m.hub} : ${m.mac}`)}
        <div className='flex justify-center'>
            <Button Icon={DevicePhoneMobileIcon} onClick={porImplementar} title='Asignar modem'/>
        </div>
    </div>
    <div className='mt-3 flex justify-center'> 
            <Button Icon={SwatchIcon} title="Crear ticket" onClick={nuevoTicket}/>
            <Button Icon={TrashIcon} title="Dar de baja" onClick={porImplementar}/>
    </div>
</div>);}
