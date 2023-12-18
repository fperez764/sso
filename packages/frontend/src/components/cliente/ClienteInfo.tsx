import { ArrowsRightLeftIcon, EnvelopeIcon, IdentificationIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Cliente, cliente_persona_enum } from '@types/typesSSO';
import Link from 'next/link';
import { useState } from "react";

interface Props { cliente: Cliente }

const ClienteInfo = ({cliente}: Props) => {
    const [nroContacto, setNroContacto] = useState(0);

    if(!cliente || !cliente.contactos || !cliente.contactos[nroContacto]) return <p className='w-full font-bold text-center text-red-500'>No se pudo cargar el cliente</p>;

  return <div className='w-full'>
    <Link target='_blank' href={`/clientes/${cliente.id}`}>
        <h2 className="text-xl font-bold cursor-pointer hover:underline">
            ID Cliente ({cliente?.tipo}): {cliente?.id}
        </h2>
        <h4 className="font-bold text-[15px] sm:text-[16px] cursor-pointer hover:underline">
            {cliente?.contactos[nroContacto]?.nombreCompleto || 'Nombre Completo'}
        </h4> 
    </Link> 
    <div className='flex space-y-2'>
        {/*Info Personal*/}
        <div className="items-center w-1/2 whitespace-normal">
            <p className="font-bold cursor-pointer" onClick={()=>setNroContacto(nroContacto + 1 < cliente.contactos.length ? nroContacto+1 : 0)}>
            Datos de contacto ({nroContacto + 1}/{cliente.contactos.length}) <ArrowsRightLeftIcon className='w-6 h-6'/>:
            </p>
            {cliente.tipo === cliente_persona_enum.EMPRESARIAL ? (
                <p>PERSONA: {cliente.tipo}</p>
            ) : (
                <div className="flex">
                    <IdentificationIcon className="h-4" />
                    <span className="text-sm sm:text-[15px] overflow-auto ml-1">{cliente.contactos[nroContacto]?.nroDocumento || 'Documento no registrado'}</span>
                </div>
            )}
            <div className="flex">
                <MapPinIcon className="h-4" />
                <p className="text-sm sm:text-[12px] overflow-hidden ml-1">{cliente.contactos[nroContacto]?.direccion || 'No registrada'}</p>
            </div>
            <div className="flex">
                <PhoneIcon className="h-4" />
                <p className="text-sm sm:text-[12px] overflow-hidden ml-1">{cliente?.contactos[nroContacto]?.telefono || 'No registrado'}</p>
            </div>
        </div>
        {/**Datos Facturacion*/}
        <div className="w-1/2">
            <h2 className="font-bold">Datos facturación:</h2>
            <h4 className="text-sm sm:text-[15px] whitespace-nowrap">Razon Social: {cliente.razonSocial}</h4>
            <span className="text-sm sm:text-[15px]">
                Facturar a {cliente.tipoDocumentoFacturacion}: {cliente.nroDocumentoFacturacion}
            </span>
            <div className="flex">
                <EnvelopeIcon className="h-4" />
                <p className="text-sm sm:text-[12px] overflow-hidden ml-1">{cliente.contactos[nroContacto]?.email ?? 'Correo no registrado'}</p>
            </div>
        </div>
    </div>
  </div>
}

export default ClienteInfo
