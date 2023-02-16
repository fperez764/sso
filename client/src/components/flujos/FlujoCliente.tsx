import {
    IdentificationIcon,
    MapPinIcon,
    PhoneIcon,
    PlusIcon, XCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Cliente } from '../../../types/typesSSO';
import ClienteWidget from '../cliente/ClienteWidget';

interface Props {
    cliente: Cliente;
}

function FlujoCliente({ cliente } : Props) {
    const mostrarCliente = async () => {
        toast((t) => (
            <div className='flex flex-col'>
            <XCircleIcon className='self-end w-6 h-6'onClick={()=>{toast.dismiss(t.id)}}/>
            <ClienteWidget cliente={cliente}/>
            </div>
          ), {duration: 0});
    };
  return (
    <div className="flex justify-between">
        {/**Cliente info */}
        <div className="items-center space-x-1 whitespace-nowrap hover:bg-gray-200" onClick={mostrarCliente}>
            <h4 className="font-bold text-[15px] sm:text-[14px]  cursor-pointer">
                {cliente?.nombreCompleto || 'Nombres Apellidos'}
            </h4>
            <div className="flex">
                <IdentificationIcon className='h-4'/>
                <span className="text-sm sm:text-[15px] ml-1">
                    {cliente?.nroDocumento}
                </span>
            </div>
            <div className="flex">
                <PhoneIcon className='h-4'/>
                <h3 className="hidden ml-1 text-sm font-bold lg:flex">
                    {cliente?.telefono}
                </h3>
            </div>
            <div className="flex">
                <MapPinIcon className='h-4'/>
                <h3 className="hidden overflow-auto text-[12px] lg:flex  ml-1">
                    {cliente?.direccion}
                </h3>
            </div>
        </div>
    </div>
);
}

export default FlujoCliente;
