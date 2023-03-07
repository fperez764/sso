import { CheckCircleIcon, PlayPauseIcon, SwatchIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ClienteServicio} from '../../../types/typesSSO';
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

  return (
    <div className='p-3 border-b border-gray-500 cursor-pointer'>
        <div className="flex space-x-3">
            <h1 className="font-bold">{clienteServicio.servicio.nombre}</h1>
            <div className={`w-8 h-8 mr-4 rounded-full ${clienteServicio.activo ? 'bg-green-400':'bg-red-400'}`}>
            {clienteServicio.activo ? <CheckCircleIcon /> : <XCircleIcon />}
            </div>
        </div>
        {/**Acciones Cliente */}
        <div className='flex justify-center h-12 border-b border-gray-500'>
            <Button Icon={SwatchIcon} title="Crear ticket" onClick={nuevoTicket}/>
            <Button Icon={TrashIcon} title="Dar de baja" onClick={porImplementar}/>
        </div>

        {/**Paquetes*/}
        <div>
            <h4 className="mb-2 text-lg font-bold">
                Periodos:
            </h4>
            {/*
            Agregar metodo getPeriodoActual y getPaquetesActivos
            clienteServicio.periodos && clienteServicio.paquetes.map((p)=>(
                <PaqueteWidget paquete={p}/>
            ))*/}
            <div className='mt-3 ml-3'> 
                <Button Icon={PlayPauseIcon} onClick={porImplementar} title='Agregar paquete'/>
            </div>
        </div>
    </div>
);}
