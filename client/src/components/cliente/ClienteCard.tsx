import {
    EnvelopeIcon,
    IdentificationIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Cliente, ClienteRSS, getColorSeveridad } from '../../../types/typesSSO';
import ClienteWidget from './ClienteWidget';

interface Props {
    cliente: Cliente|ClienteRSS;
}

function ClienteCard({ cliente } : Props) {

    if(!cliente) return null;
    const mostrarCliente = async () => {
        toast((t) => (
            <div className='flex flex-col'>
            <XCircleIcon className='self-end w-6 h-6'onClick={()=>{toast.dismiss(t.id)}}/>
            <ClienteWidget post={cliente}/>
            </div>
          ), {duration: 0});
    };

    const sso = 'nombreCompleto' in cliente;
  return (
    cliente &&
    <div className={`flex m-2 border-b border-gray-500 bg-gray-100 rounded-xl cursor-pointer ${(sso ? cliente.usuarioBaja : cliente.fecha_baja) && 'bg-red-500'}`}>
        {/*Info Personal*/}
        <div className="items-center ml-2 space-x-1 whitespace-normal w-80">
            <p className="text-[12px]">ID: {cliente.id}</p>
            {sso && <p>Servicios: {cliente?.clienteServicios?.length > 0 && cliente.clienteServicios.map((servicio) => servicio.servicio.nombre + ": " + servicio.id + " ")}</p>}
            {cliente.clienteServicios?.map(cliSer => cliSer.tickets?.map(tick =>
                <p className={`bg-${getColorSeveridad(tick)} w-24 rounded-full px-2 text-center whitespace-nowrap`}>{tick.id}: {tick.severidad}</p>
            ))}
            <h4 className="font-bold text-[15px] sm:text-[16px]">
                {(sso ? cliente.nombreCompleto : cliente.nombre) || 'Nombre Completo'}
            </h4>
            <div className="flex">
                <IdentificationIcon className='h-4'/>
                <span className="text-sm sm:text-[15px] overflow-auto">
                    CI: {(sso ? cliente.nroDocumento : cliente.ci) ?? 'Documento no registrado'}
               </span>
            </div>
        </div>
        {/**Datos Facturacion*/}
        <div className="self-center ml-2 w-80">
            <h4 className='text-[14px]'>
                Razon Social: {(sso ? cliente.razonSocial : cliente.razon_social)}
            </h4>
            <span className="text-sm sm:text-[15px]">
                Facturar a {sso ? `${cliente.tipoDocumentoFacturacion}-${cliente.nroDocumentoFacturacion}` :`${cliente.tipo_documento}-${cliente.nit}`}
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
