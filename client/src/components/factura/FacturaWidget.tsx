import { ArchiveBoxXMarkIcon, ArrowPathIcon, CheckIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon, QrCodeIcon, TrashIcon } from '@heroicons/react/24/outline';
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

export default function FacturaWidget({ factura }: Props) {
  return (
  <div className='p-3 border-b border-gray-400 bg-gray-200 w-full'>
    {/*Acciones + infor principal */}
    <div className="flex items-center space-x-1 text-sm whitespace-nowrap">
        <div>
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                No.: {factura.numeroFactura} - {dayjs(factura.fechaEmision).format('DD/MM/YY')}
            </h4>
            <h4 className="text-[15px] overflow-hidden cursor-pointer">
                idOp: {factura.idOperacionPago}
            </h4>
        </div>
        <a href={factura.urlPdf} target="_blank">
                <QrCodeIcon className='w-10 h-10 border-x border-y border-black rounded ml-8'/>
        </a>
        <a href={factura.urlXml} target="_blank">
                <div className='font-bold w-10 h-10 border-x border-y border-black rounded '>
                    <p className='text-center mt-2 text-xl'>XML</p>
                </div>
        </a>
    </div>
    <div className="items-center space-x-1 mt-2 text-sm whitespace-nowrap">
        <h4 className="ftext-[15px] sm:text-[16px] hover:underline">
            CUF: {factura.cuf}
        </h4>
        <h3 className="font-bold text-[15px] sm:text-[16px] hover:underline">
            Sistema: {factura.sistema}
        </h3>
        <h3 className="text-[15px] sm:text-[16px] hover:underline">
            Usuario Emisión: {factura.usuarioEmision}
        </h3>
        {factura.observacion && <h3 className="font-bold text-[15px] sm:text-[16px] hover:underline">
            Observacion: {factura.observacion}
        </h3>}
        <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
            {JSON.stringify(factura.facturaDetalles)}
        </h4>
    </div>
    {/* Informacion extra de la factura */}
    <div className='mx-2 flex flex-col rounded font-bold text-[15px] sm:text-[16px]'>
        <h3 className={`${factura.estado.includes('EXITO') ? 'bg-green-400' : 'bg-red-400'}`}>
            {factura.estado}
        </h3>
        <h3 className={`${factura.pagado? 'bg-green-400' : 'bg-red-400'} mt-1`}>
            {factura?.pagado ? 'Pagada' : 'Por pagar'}
        </h3>
    </div>
  </div>
);}
