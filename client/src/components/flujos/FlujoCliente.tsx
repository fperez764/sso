import {
    IdentificationIcon,
    MapPinIcon,
    PhoneIcon,
} from '@heroicons/react/24/outline';
import { Cliente } from '../../../types/typesSSO';

interface Props {
    cliente?: Cliente;
    className?: string;
}

function FlujoCliente({ cliente, className } : Props) {
  return (
    <div className={`flex items-center hover:bg-gray-200 ${className}`}>
        <h2 className="text-lg font-bold text-center grow">
            {cliente?.nombreCompleto || 'Nombres Apellidos'}
        </h2>
        <div className='flex-col hidden w-36 lg:inline'>
            <div className="flex">
                <IdentificationIcon className='h-4'/>
                <span className="text-sm sm:text-[15px] ml-1">{cliente?.nroDocumento}</span>
            </div>
            <div className="flex">
                <PhoneIcon className='h-4'/>
                <h3 className="ml-1 text-sm">{cliente?.telefono}</h3>
            </div>
            <div className="flex">            
                <MapPinIcon className='h-4'/>
                <h3 className="ml-1 text-xs">
                    {cliente?.direccion}
                </h3>
            </div>
        </div>
    </div>
);
}

export default FlujoCliente;
