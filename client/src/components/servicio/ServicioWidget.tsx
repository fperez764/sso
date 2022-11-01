import { CheckCircleIcon, PencilIcon, PlayPauseIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { Servicio } from '../../../types/typesSSO';
import Button from '../Button';
import PaqueteWidget from './PaqueteWidget';

interface Props {
    servicio: Servicio,
}

export default function ServicioWidget({ servicio }: Props) {
    const porImplementar = async () => {
        toast.error('Por implementar');
    };
  return (
    <div className='p-3 border-b border-gray-500 cursor-pointer'>
        <h1 className="font-bold">Servicio: {servicio.nombre}</h1>
        <p className='text-sm'>Creado por @{servicio.usuarioCreacion.username} el {servicio.fechaCreacion.toString()}</p>
        <h2 className="mt-2">{servicio.descripcion}</h2>
        {/**Acciones Cliente */}
        <div className='flex justify-center h-12 border-b border-gray-500'>
            <Button Icon={PencilIcon} active={true} onClick={porImplementar}/>
            <Button Icon={TrashIcon} active={true} onClick={porImplementar}/>
        </div>

        {/**Paquetes*/}
        <div>
            <h4 className="mb-2 text-lg font-bold">
                Paquetes:
            </h4>
            {servicio.servicioPaquetes.map((p)=>(
                <PaqueteWidget paquete={p}/>
            ))}
            <div className='mt-3 ml-3'> 
                <Button Icon={PlayPauseIcon} active={true} onClick={porImplementar} title='Agregar paquete'/>
            </div>
        </div>
    </div>
);}
