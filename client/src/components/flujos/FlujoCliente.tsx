import {
    IdentificationIcon,
    MapPinIcon,
    PhoneIcon,
} from '@heroicons/react/24/outline';
import { Cliente } from '../../../types/typesSSO';

interface Props {
    cliente: Cliente;
    className?: string;
}

function FlujoCliente({ cliente, className } : Props) {
  return (
    <div className={`flex items-center hover:bg-gray-200 ${className}`}>
        <h2 className="font-bold text-lg text-center w-2/3">
            {cliente?.nombreCompleto || 'Nombres Apellidos'}
        </h2>
        <div className='flex flex-col'>
            <div className="flex">
                <IdentificationIcon className='h-4'/>
                <span className="text-sm sm:text-[15px] ml-1">{cliente?.nroDocumento}</span>
            </div>
            <div className="flex">
                <PhoneIcon className='h-4'/>
                <h3 className="hidden ml-1 text-sm lg:flex">{cliente?.telefono}</h3>
            </div>
            <div className="flex">            
                <MapPinIcon className='h-4'/>
                <h3 className="hidden overflow-auto text-[12px] lg:flex ml-1">
                    {cliente?.direccion}
                </h3>
            </div>
        </div>
    </div>
);
}

export default FlujoCliente;
