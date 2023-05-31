import Image from 'next/image';
import { Servicio } from '../../../types/typesSSO';

interface Props {
    servicio?: Servicio;
    className?: string;
}

export default function FlujoServicio({ servicio, className }: Props) {
    return (
    <div className={`lg:flex cursor-pointer items-center mx-3 hover:bg-gray-200 ${className}`}>
        {/*<Image
            className='w-12 h-12 rounded'
            src={`/images/servicio-categoria/${servicio?.categoria?.nombre}.png`}
            width={64}
            height={64}
            alt={`${servicio?.categoria?.nombre} Categoria Servicio`}
        />*/}
        <div className="flex flex-col items-start">
            <label className='hidden text-xs font-semibold lg:inline'>Servicio:</label>
            <h3 className="font-bold text-center text-md hover:underline">
                {servicio?.nombre || 'Servicio'}
            </h3>
            <p className='text-sm'>{servicio?.categoria.nombre}</p>
        </div>
    </div>
);}
