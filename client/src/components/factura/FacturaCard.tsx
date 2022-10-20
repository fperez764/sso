import { ArrowPathIcon, CheckIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, QrCodeIcon, TrashIcon } from '@heroicons/react/24/outline';
import { MouseEventHandler, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Factura } from '../../../types/typesABEFAC';
import ClienteFacturaCard from './ClienteFacturaCard';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
    factura: Factura,
}

export default function FacturaCard({ factura }: Props) {
  const [mostrarAcciones, setMostrarAcciones] = useState(false);
  const refresh = async () => {
    const waitFactura = toast.loading('Actualizando');
    try {
        const res = await axios.get(`/factura/${factura.idOperacionPago}`);
        factura = res.data.datos;
        toast.success('Se actualizo', { id: waitFactura });
    } catch (error) {
        toast.error('Hubo un problema al buscar la factura ' + error, { id: waitFactura });
    }
  };
  const anular = async () => {
    try {
        const res = await axios.get(`/factura/${factura.idOperacionPago}`);
        factura = res.data.datos;
        toast.success('Se anulo la factura correctamente.');
    } catch (error) {
        toast.error('No se pudo anular la factura ' + error);
    }
  };
  const pagar = async () => {
    const tPagarFactura = toast.loading('Marcando factura como pagada');
    try {
        const res = await axios.get(`/factura/${factura.idOperacionPago}`);
        factura = res.data.datos;
        toast.success('Se marco la factura como pagada.', { id: tPagarFactura });
    } catch (error) {
        toast.error('Hubo un problema al pagar la factura ' + error, { id: tPagarFactura });
    }
  };


  return (
  <div className='flex w-full h-20 p-1 bg-gray-100 border-b border-gray-400'>
    {/*Acciones + infor principal */}
    <div className="flex w-48">
        {mostrarAcciones && 
        <div className="flex flex-col w-6 h-16 bg-gray-300">
            <ArrowPathIcon className='w-5 h-5' onClick={refresh}/>
            {!factura.pagado && <CheckIcon className='w-5 h-5' onClick={pagar} />}
            {!factura.fechaAnulacion && <TrashIcon className='w-5 h-5' onClick={anular} />}
        </div>}
        <div className="w-6">
        {mostrarAcciones 
        ? <ChevronDoubleLeftIcon className="h-6 cursor-pointer" onClick={()=> setMostrarAcciones(!mostrarAcciones)}/>
        : <ChevronDoubleRightIcon className="h-6 cursor-pointer" onClick={()=> setMostrarAcciones(!mostrarAcciones)}/>}
        <a href={factura.urlPdf} target="_blank">
                <QrCodeIcon className='w-6 h-6 mt-1 rounded'/>
        </a>
        </div>
        <div className="items-center w-4/6 space-x-1 text-sm cursor-pointer whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                No.: {factura.numeroFactura} - {dayjs(factura.fechaEmision).format('DD/MM/YY')}
            </h4>
            <h4 className="text-[15px] overflow-hidden cursor-pointer">
                idOp: {factura.idOperacionPago}
            </h4>
        </div>
    </div>
    {/* Informacion extra de la factura */}
    <div className='hidden w-64 xl:inline'>
        <div className="flex space-x-2 h-12 text-gray-800 text-[16px]">
            <h3 className="w-2/3 overflow-hidden">
            {factura?.descripcion || 'Descripción'}
            </h3>
            <h3 className="w-1/3 font-bold">
                {factura?.facturaDetalles[0].codigo || 'Descripción'}
            </h3>
        </div>
        <h4 className="font-bold text-[14px] hover:underline">
            montoTotal: {factura.montoTotal}
        </h4>
    </div>
    <div className='mx-2 w-28 flex flex-col rounded justify-center font-bold text-[15px] sm:text-[16px]'>
            <h3 className={`${factura.estado.includes('EXITO') ? 'bg-green-400' : 'bg-red-400'}`}>
                {factura.estado}
            </h3>
            <h3 className={`${factura.pagado? 'bg-green-400' : 'bg-red-400'} mt-1 self-center`}>
                {factura?.pagado ? 'Pagada' : 'Por pagar'}
            </h3>
    </div>
    <div className='w-full'>
        <ClienteFacturaCard cliente={factura.cliente}/>
    </div>
  </div>
);}
