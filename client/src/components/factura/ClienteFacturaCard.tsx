import {
    PlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { ClienteFactura } from '../../../types/typesABEFAC';
import { Cliente } from '../../../types/typesSSO';

interface Props {
    cliente: ClienteFactura;
}

function ClienteFacturaCard({ cliente } : Props) {
    const mostrarCliente = async () => {
        toast.error('Por implementar');
    };
  return (
    <div className="p-3 cursor-pointer xl:inline">
    {/*Header*/}
    <div className="flex justify-between">
        {/**Cliente info */}
        <div className="items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline" onClick={mostrarCliente}>
                ID:{cliente.idCuenta} {cliente?.razonSocial || 'Razon Social'}
            </h4>
            <span className="text-sm sm:text-[15px]">
                {cliente ? `${cliente?.nroDocumento} : ${cliente?.tipoDocumento}` : 'Nro. Doc.: Tipo Doc.'}
            </span>
        </div>
        {/**Accion Cliente*/}
        {!cliente && <PlusIcon className="w-10 h-10 p-2 hoverEffect hover:bg-sky-100 hover:text-sky-500" />}
    </div>
</div>
);
}

export default ClienteFacturaCard;
