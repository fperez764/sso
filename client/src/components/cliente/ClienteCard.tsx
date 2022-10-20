import {
    PlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Cliente } from '../../../types/typesSSO';

interface Props {
    cliente: Cliente;
}

function ClienteCard({ cliente } : Props) {
    const mostrarCliente = async () => {
        toast.error('Por implementar');
    };
  return (
    <div className="flex w-full p-1 border-b border-gray-500 cursor-pointer">
        {/*Info Personal*/}
        <div className="items-center ml-2 space-x-1 whitespace-normal w-80">
            <p className="text-[12px]">ID: {cliente.id} </p>
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline" onClick={mostrarCliente}>
                {cliente.nombreCompleto || 'Nombre Completo'}
            </h4>
            <span className="text-sm sm:text-[15px] overflow-auto">
                Documento: {cliente.nroDocumento ?? 'Documento no registrado'}
            </span>
        </div>
        {/**Datos Facturacion*/}
        <div className="self-center ml-2 w-80">
            <h4 className='text-[14px]'>
                Razon Social: {cliente.razonSocial}
            </h4>
            <span className="text-sm sm:text-[15px]">
                Facturar a {cliente.tipoDocumento}: {cliente.nit}
            </span>
            <p className="text-sm sm:text-[12px] overflow-hidden hidden md:inline-flex">
                Correo electrónico: {cliente.email && cliente.email !== '-' ? cliente.email : 'No registrado'}
            </p>
        </div>
    </div>
);
}

export default ClienteCard;
