import { ArrowDownTrayIcon, ArrowPathIcon, CheckCircleIcon, CheckIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, EllipsisVerticalIcon, QrCodeIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Factura } from '../../../types/typesABEFAC';
import ClienteFacturaCard from './ClienteFacturaCard';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
    factura: Factura,
}

export default function FacturaCard({ factura }: Props) {
  const [mostrarAcciones, setMostrarAcciones] = useState(false);

  const porImplementar = async () => {
    console.log('porimplementar');
    toast.error('Por implementar');
  };
  return (
  <div className='flex p-3 border-b border-gray-400 bg-gray-200 h-20 w-full'>
    {/*Acciones + infor principal */}
    <div className="flex xl:w-60 w-36">
        {mostrarAcciones && 
        <div className="flex flex-col w-8 h-14 bg-gray-300">
            <ArrowPathIcon className='cursor-pointer' onClick={porImplementar}/>
            <CheckIcon className='cursor-pointer' onClick={porImplementar} />
            <TrashIcon className='cursor-pointer' onClick={porImplementar} />
        </div>}
        {mostrarAcciones 
        ? <ChevronDoubleLeftIcon className="cursor-pointer w-6 h-6" onClick={()=> setMostrarAcciones(!mostrarAcciones)}/>
        : <ChevronDoubleRightIcon className="cursor-pointer w-6 h-6" onClick={()=> setMostrarAcciones(!mostrarAcciones)}/>}

        <div className="items-center space-x-1 text-sm whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                <a href={factura.urlPdf} target="_blank">
                No.: {factura.numeroFactura} - {dayjs(factura.fechaEmision).format('DD/MM/YY')}
                </a>
            </h4>
            <h4 className="flex justify-items-center text-[15px]">
                idOp: {factura.idOperacionPago}
                <a href={factura.urlPdf} target="_blank">
                    <QrCodeIcon className='w-6 h-6 ml-2 rounded'/>
                </a>
            </h4>
        </div>
    </div>
    {/* Informacion extra de la factura */}
    <div className='w-48 hidden xl:inline'>
        <h3 className="text-gray-800 text-[15px] sm:text-[16px]">
            {factura?.descripcion || 'Descripción'}
        </h3>
        <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
            montoTotal: {factura.montoTotal}
        </h4>
    </div>
    <div className='mx-2 flex flex-col'>
        <div className="xl:flex font-bold text-[15px] sm:text-[16px]">
            <h3 className={`mx-1 rounded ${factura.pagado? 'bg-green-400' : 'bg-red-400'}`}>
                {factura?.pagado ? 'Pagada' : 'Por pagar'}
            </h3>
            <h3 className={`mx-1 rounded ${factura.estado.includes('EXITO') ? 'bg-green-400' : 'bg-red-400'}`}>
                {factura.estado}
            </h3>
        </div>
        <h3 className="text-gray-800 font-bold self-center xl:mt-4 text-[15px] sm:text-[16px]">
            {factura?.facturaDetalles[0].codigo || 'Descripción'}
        </h3>
    </div>
    <ClienteFacturaCard cliente={factura.cliente}/>
  </div>
);}
