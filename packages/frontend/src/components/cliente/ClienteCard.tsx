import {
    EnvelopeIcon,
    IdentificationIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Cliente } from '../../../types/typesSSO';
import { getColorSeveridad } from '@src/utils/common';

interface Props {
    cliente: Cliente;
}

function ClienteCard({ cliente } : Props) {

    if(!cliente) return null;
  return (
    cliente &&
    <div className={`flex m-2 border-b border-gray-500 bg-gray-100 rounded-xl cursor-pointer ${!!cliente.fechaBaja && 'bg-red-500'}`}>
        {/*Info Personal*/}
        <div className='items-center ml-2 space-x-1 whitespace-normal w-80'>
            <p className='text-[12px]'>Cliente: { cliente.id }</p>
            <p><span className='font-bold'>Servicios:</span> {cliente?.clienteServicios?.length > 0 && cliente.clienteServicios.map((cliSer) => `${cliSer.fechaBaja ? 'BAJA-': ''}${cliSer.id}:${cliSer.nombreServicio}; `)}</p>
            <div className="flex overflow-hidden">{cliente.clienteServicios?.map(cliSer => cliSer.tickets?.filter(t => !t.resuelto && !t.fechaBaja)?.map(tick =>
    			<Link href={`/tickets/${tick.id}`} className='m-0 hover:underline'>
                    <p className={`bg-${getColorSeveridad(tick)} w-24 rounded-full px-2 text-center whitespace-nowrap overflow-hidden`}>{tick.id}: {tick.descripcion}</p>
                </Link>
            ))}</div>
            <h4 className='font-bold text-[15px] sm:text-[16px]'>
                {cliente.contactos[0]?.nombreCompleto || 'Nombre Completo'}
            </h4>
            <div className='flex'>
                <IdentificationIcon className='h-4'/>
                <span className='text-sm sm:text-[15px] overflow-auto'>
                    CI: {cliente.contactos[0]?.nroDocumento || 'Documento no registrado'}
               </span>
            </div>
        </div>
        {/**Datos Facturacion*/}
        <div className='self-center ml-2 w-80'>
            <h4 className='text-[14px]'>
                Razon Social: {cliente.razonSocial}
            </h4>
            <span className='text-sm sm:text-[15px]'>
                Facturar a {`${cliente.tipoDocumentoFacturacion}-${cliente.nroDocumentoFacturacion}`}
            </span>
            <div className='flex'>
                <EnvelopeIcon className='h-4'/>
                <p className='text-sm sm:text-[12px] overflow-hidden hidden md:inline-flex'>
                Correo electrónico: {cliente.contactos[0]?.email || 'No registrado'}
                </p>
            </div>
        </div>
    </div>
);
}

export default ClienteCard;
