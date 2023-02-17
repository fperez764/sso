import {
    EnvelopeIcon,
    EyeIcon,
    IdentificationIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { toast, ToastBar } from 'react-hot-toast';
import { Cliente } from '../../../types/typesSSO';
import ClienteWidget from './ClienteWidget';

interface Props {
    cliente: Cliente;
}

function ClienteCard({ cliente } : Props) {

    const mostrarCliente = async () => {
        toast((t) => (
            <div className='flex flex-col'>
            <XCircleIcon className='self-end w-6 h-6'onClick={()=>{toast.dismiss(t.id)}}/>
            <ClienteWidget cliente={cliente}/>
            </div>
          ), {duration: 0});
    };

    
  return (
    <div className={`flex w-full p-1 border-b border-gray-500 cursor-pointer ${cliente.usuarioBaja && 'bg-red-500'}`}>
        {/*Info Personal*/}
        <div className="items-center ml-2 space-x-1 whitespace-normal w-80">
            <p className="text-[12px]">ID: {cliente.id} </p>
            <p>Servicios: {cliente?.clienteServicios?.length > 0 && cliente.clienteServicios.map((servicio) => servicio.servicio.nombre + ": " + servicio.id + " ")}</p>
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline" onClick={mostrarCliente}>
                {cliente.nombreCompleto || 'Nombre Completo'}
            </h4>
            <div className="flex">
                <IdentificationIcon className='h-4'/>
                <span className="text-sm sm:text-[15px] overflow-auto">
                    CI: {cliente.nroDocumento ?? 'Documento no registrado'}
               </span>
            </div>
        </div>
        {/**Datos Facturacion*/}
        <div className="self-center ml-2 w-80">
            <h4 className='text-[14px]'>
                Razon Social: {cliente.razonSocial}
            </h4>
            <span className="text-sm sm:text-[15px]">
                Facturar a {cliente.tipoDocumentoFacturacion} - {cliente.nroDocumentoFacturacion}
            </span>
            <div className="flex">
                <EnvelopeIcon className='h-4'/>
                <p className="text-sm sm:text-[12px] overflow-hidden hidden md:inline-flex">
                Correo electrónico: {cliente.email && cliente.email !== '-' ? cliente.email : 'No registrado'}
                </p>
            </div>
        </div>
    </div>
);
}

export default ClienteCard;
