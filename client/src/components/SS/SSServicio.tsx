import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Servicio } from '../../../types/typesSSO';

interface Props {
    servicio: Servicio,
}

export default function SSServicio({ servicio }: Props) {
    return (
    <div className='flex-col w-12 mt-2 cursor-pointer justify-items-center lg:mx-3'>
        <h3 className="font-bold text-[15px] text-center self-center sm:text-[16px] hover:underline">
            {servicio.nombre}
        </h3>
        <img
            className='w-12 rounded'
            src={`/images/servicio-categoria/${servicio.categoria.nombre}.png`}
            alt=''
        />
    </div>
);}
