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
    <div className="w-full flex p-1 cursor-pointer xl:inline border-b border-gray-500">
        {/*Info Personal*/}
        <div className="w-80 ml-2 items-center space-x-1 whitespace-normal">
            <p className="text-[12px]">ID: {cliente.id} </p>
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline" onClick={mostrarCliente}>
                {cliente.nombreCompleto || 'Nombre Completo'}
            </h4>
            <span className="text-sm sm:text-[15px] overflow-auto">
                Documento: {cliente.nroDocumento ?? 'Documento no registrado'}
            </span>
        </div>
        {/**Datos Facturacion*/}
        <div className="w-80
            ml-2 self-center">
            <h4 className='text-[14px]'>
                Razon Social: {cliente.razonSocial}
            </h4>
            <span className="text-sm sm:text-[15px]">
                Facturar a {cliente.tipoDocumento}: {cliente.nit}
            </span>
            <p className="text-sm sm:text-[12px] overflow-hidden">
                Correo facturación: {cliente.email && cliente.email !== '-' ? cliente.email : 'Dirección de correo no registrada'}
            </p>
        </div>
    </div>
);
}

export default ClienteCard;
