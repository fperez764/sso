import { ArrowDownCircleIcon, ArrowDownIcon, CheckCircleIcon, CurrencyDollarIcon, DevicePhoneMobileIcon, DeviceTabletIcon, ExclamationCircleIcon, PlayPauseIcon, SwatchIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ClienteServicio, Roles, SeveridadTicket, getColorSeveridad} from '../../../types/typesSSO';
import Button from '../Button';
import NuevoTicket from '../flujos/NuevoTicketWidget';
import { useAuthState } from '../../context/auth';

interface Props {
    clienteServicio: ClienteServicio,
}

export default function ClienteServicioWidget({ clienteServicio }: Props) {
    const { user } = useAuthState();
    const admin = user?.rol === Roles.ADMIN;

    const porImplementar = async () => {
        toast.error('Por implementar');
    };

    const nuevoTicket = async () => {
        toast((t) => (
            <div className='flex flex-col'>
            <XCircleIcon className='self-end w-6 h-6'onClick={() => toast.dismiss(t.id)}/>
            <NuevoTicket clienteServicio={clienteServicio} handleRefresh={() => toast.dismiss(t.id)}/>
            </div>
          ), {duration: 100000});
    };
    const css = `w-8 h-8 mx-2 rounded-full ${clienteServicio.tickets.length > 0 ? 'bg-yellow-500' : clienteServicio.activo ? 'bg-green-400':'bg-red-400'}`;
  return (<div className='border-blue-300 border-y'>
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
                return <li className={`list-disc rounded-md bg-${getColorSeveridad(tick)} mt-1`}>
                        <h4>{`${tick.grupo?.nombre ?? 'GrupoTipo ticket'}: ${tick.descripcion}`}</h4>
                        <p className='text-xs'>{`${(tick.respuestasCount ?? 'x/y') + ' respondidas'}`}</p>
                    </li>
            })}</ul>
        </div>
    </div>
    {/*PeriodoWidget TODO: reemplazar por PeriodosWidget}
    <div>
        <h4 className="mb-2 text-lg font-bold">
            Periodo: {clienteServicio.periodos?.length > 0 ? clienteServicio.periodos[0].id : 'No tiene periodos activos'}
        </h4>
        <div className='px-2 mb-3 -mt-3 bg-gray-300 rounded-md'>PeriodoID;Acciones?;FecahInicio;FechaFin;Factura;Pagado</div>
        <div className='flex justify-center'>
            {admin && clienteServicio.periodos?.find(p=>p.activo)?.id ?? <Button Icon={CurrencyDollarIcon} onClick={porImplementar} title='Crear periodo'/>}
        </div>
        {clienteServicio.periodos?.find(p => p.activo) && <>
            <h4 className="mb-2 text-lg font-bold">Paquetes activos:</h4> 
            {admin && <Button Icon={CurrencyDollarIcon} onClick={porImplementar} title='Agregar paquete'/>}
        </>}
    </div>*/}

    {/*ModemWidget TODO: reemplazar por ModemWidget*/}
    <div className='flex flex-col'>
        <h4 className="mb-2 text-lg font-bold">
            Modems: {clienteServicio.modems?.length > 0 ? clienteServicio.modems.length + ' modems asignados' : 'No tiene modems asignados'}
        </h4>
        {clienteServicio.modems?.length > 0 ? <ol className='w-80 h-64 overflow-y-scroll'>
        {clienteServicio.modems.map(m => <li className='flex justify-between space-x-2'>
            <p className='font-bold'>{m.hub}:</p>
            <p>{m.mac}</p>
            <ArrowDownCircleIcon className='w-6 cursor-pointer' onClick={()=>toast.error('Por implementar: Recupera información de su Hub.')}/>
            </li>)}
        </ol> : null}
        {admin && <Button Icon={DevicePhoneMobileIcon} onClick={porImplementar} title='Asignar modem' />}
    </div>
    <div className='flex justify-center mt-3'> 
            <Button Icon={SwatchIcon} title="Crear ticket" onClick={nuevoTicket}/>
            {admin && <Button Icon={TrashIcon} title="Dar de baja" onClick={porImplementar}/>}
    </div>
</div>);}
