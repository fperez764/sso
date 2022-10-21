import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Servicio } from '../../../types/typesSSO';

interface Props {
    servicio: Servicio,
}

export default function SSServicio({ servicio }: Props) {
    return (
    <div className='flex-col w-[70px] cursor-pointer justify-items-center'>
        <div className="mt-2 flex">        
            <h3 className="font-bold text-[15px] text-center self-center sm:text-[16px] hover:underline">
                {servicio.nombre}
            </h3>
            {servicio.activo 
            ? <CheckCircleIcon className='w-8 h-8 rounded-full bg-green-400'/> 
            : <XCircleIcon className='w-8 h-8 rounded-full bg-red-400'/>}
        </div>
        <div className="justify-self-center w-12"><img
        className='rounded'
        src={`/images/servicio-categoria/${servicio.categoria.nombre}.png`}
        alt=''
        /></div>
    </div>
);}
