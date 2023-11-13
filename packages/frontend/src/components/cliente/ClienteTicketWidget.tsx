import { toast } from 'react-hot-toast';
import { Cliente, ClienteServicio } from '../../../types/typesSSO';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import FlujoServicio from '../flujos/FlujoServicio';
import { DateMonth, OnlyDayMonth } from '../../utils/common';
import Link from 'next/link';

interface Props {
    cliente: Cliente;
    clienteServicio: ClienteServicio
}

export default function ClienteTicketWidget({ cliente, clienteServicio } : Props) {
    if(!cliente) return <p>No se pudo cargar el cliente</p>
    return (
        <div className="px-2 py-2 bg-gray-300 border-2 border-gray-200 rounded-md">
            <div className="flex items-start space-x-6">
                {/*Header Cliente*/}
                <Link target='_blank' href={`/clientes/${cliente.id}`} className='w-1/2'>
                    <h2 className='text-lg font-bold'>Cliente: {cliente.id} - {cliente.tipo}</h2>
                    <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline cursor-pointer">
                            {cliente.contactos[0]?.nombreCompleto || 'Nombre Completo'}
                    </h4>
                </Link>
                {/**ClienteServicio*/}
                <FlujoServicio servicio={clienteServicio.servicio} />
                <div className="flex flex-col">
                    <h4 className='text-sm font-bold'>SERVICIO {clienteServicio.contrato ? 'CON CONTRATO' : 'SIN CONTRATO'}</h4>
                    <p className='text-sm'>{`Activo desde ${dayjs(clienteServicio.fechaCreacion).format(OnlyDayMonth)}`}</p>
                    <p className='text-sm'>Instalador: {clienteServicio.instalador}</p>
                </div>
            </div>
        </div>
    );
}