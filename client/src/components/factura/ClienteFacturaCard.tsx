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
    <div className="cursor-pointer xl:inline ml-2">
    {/*Header*/}
        {/**Cliente info */}
        <div className="">
            <span className="text-sm sm:text-[13px]">
                ID: {cliente.idCuenta}
            </span>
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline w-22 whitespace-nowrap overflow-hidden" onClick={mostrarCliente}>
                {cliente?.razonSocial || 'Razon Social'}
            </h4>
            <span className="text-sm sm:text-[15px]">
                {cliente ? `${cliente?.nroDocumento} : ${cliente?.tipoDocumento}` : 'Nro. Doc.: Tipo Doc.'}
            </span>
        </div>
        {/**Accion Cliente*/}
        {!cliente && <PlusIcon className="w-10 h-10 p-2 hoverEffect hover:bg-sky-100 hover:text-sky-500" />}
    </div>
    );
}

export default ClienteFacturaCard;
