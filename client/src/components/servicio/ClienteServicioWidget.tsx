import { CheckCircleIcon, PencilIcon, PlayPauseIcon, SwatchIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Servicio } from '../../../types/typesSSO';
import Button from '../Button';
import PaqueteWidget from './PaqueteWidget';

interface Props {
    servicio: Servicio,
}

export default function ClienteServicioWidget({ servicio }: Props) {
    const porImplementar = async () => {
        toast.error('Por implementar');
    };
  return (
    <div className='p-3 border-b border-gray-500 cursor-pointer'>
        <div className="flex space-x-3">
            <h1 className="font-bold">{servicio.nombre}</h1>
            <div className={`w-8 h-8 mr-4 rounded-full ${servicio.activo ? 'bg-green-400':'bg-red-400'}`}>
            {servicio.activo ? <CheckCircleIcon /> : <XCircleIcon />}
            </div>
        </div>
        {/**Acciones Cliente */}
        <div className='flex justify-center h-12 border-b border-gray-500'>
            <Button Icon={SwatchIcon} title="Crear ticket" onClick={porImplementar}/>
            <Button Icon={TrashIcon} title="Dar de baja" onClick={porImplementar}/>
        </div>

        {/**Paquetes*/}
        <div>
            <h4 className="mb-2 text-lg font-bold">
                Paquetes:
            </h4>
            {servicio.servicioPaquetes && servicio.servicioPaquetes.map((p)=>(
                <PaqueteWidget paquete={p}/>
            ))}
            <div className='mt-3 ml-3'> 
                <Button Icon={PlayPauseIcon} onClick={porImplementar} title='Agregar paquete'/>
            </div>
        </div>
    </div>
);}
