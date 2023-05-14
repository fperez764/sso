import { toast } from 'react-hot-toast';
import { ClienteServicioModem, ClienteServicioTicket, DateFormat } from '../../../types/typesSSO';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import FlujoServicio from '../flujos/FlujoServicio';
import ModemViewWidget from '../servicio/ModemViewWidget';

interface Props {
    post: ClienteServicioTicket;
}

export default function ClienteTicketWidget({ post } : Props) {
    const porImplementar = async () => {
        toast.error(`Por implementar: url:/clientes/${post.clienteServicio.cliente.nroDocumento}`);
    };

    //Obtener info (ubicacion) del modem de los hubs
    useEffect(()=>{
        toast.success('getModem(post.clienteServicio);');
    },[]);

    return (
        <div className="px-2 py-2 bg-gray-300 border-2 border-gray-200 rounded-md">
            <div className="flex items-center space-x-6">
                {/*Header Cliente*/}<div className='w-1/2'>
                    <h2 className='text-xl font-bold'>Cliente: {post.clienteServicio.cliente.id} ({post.clienteServicio.cliente.persona})</h2>
                    <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline cursor-pointer" onClick={porImplementar}>
                            {post.clienteServicio.cliente.nombreCompleto || 'Nombre Completo'}
                    </h4>
                </div>
                {/**ClienteServicio*/}
                <FlujoServicio servicio={post.clienteServicio.servicio} />
                <div className="flex flex-col">
                    <h4 className='text-sm font-bold'>SERVICIO {post.clienteServicio.contrato ? 'CON CONTRATO' : 'SIN CONTRATO'}</h4>
                    <p className='text-sm'>{`Activo desde el ${dayjs(post.clienteServicio.fechaCreacion).format(DateFormat)}`}</p>
                    <p className='text-sm'>Instalador: {post.clienteServicio.instalador}</p>
                </div>
            </div>
            {!!post.modems && <>
            <h4>Modem(s) afectado(s):</h4>
            <div className="flex flex-col p-2 border-2 border-gray-300 rounded-lg">
                <ol>
                {post.modems?.map((m: ClienteServicioModem) => <li key={m.mac}>
                        <ModemViewWidget modem={m}/>
                    </li>)}
                </ol>
            </div>
            </>}
        </div>
    );
}