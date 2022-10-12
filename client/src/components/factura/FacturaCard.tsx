import { CheckCircleIcon, CheckIcon, LinkIcon, SignalIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Factura } from '../../../types/typesABEFAC';
import Button from '../Button';
import ClienteFacturaCard from './ClienteFacturaCard';

interface Props {
    factura: Factura,
}

export default function FacturaCard({ factura }: Props) {
  return (
    <div className={`p-3 border-b border-red-400 bg- w-full cursor-pointer bg-${factura?.pagado ? 'green':'red'}-300`}>
    {/*Header*/}
    <div className={'items-center '}>
        {/**Service info */}
        <div className="flex">
            <div className="">
                <p className='font-bold'>ACCIONES: </p>
                <Button Icon={SignalIcon} onClick={()=> console.log('Por implementar')}/>
                <Button Icon={CheckIcon} onClick={()=> console.log('Por implementar')} />
                <Button Icon={TrashIcon} onClick={()=> console.log('Por implementar')} />
                <Button Icon={LinkIcon} onClick={()=> console.log('Por implementar')} />
            </div>
            <div className='w-8 h-8 mr-4 rounded'>
            {factura?.pagado ? <CheckCircleIcon /> : <XCircleIcon />}
            </div>
            <div className="items-center space-x-1 text-sm whitespace-nowrap">
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                numeroFactura: {factura.numeroFactura}
                </h4>
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                idOperacionPago: {factura.idOperacionPago}
                </h4>
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                fechaEmision: {factura.fechaEmision}
                </h4>
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                montoTotal: {factura.montoTotal}
                </h4>
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                estado: {factura.estado}
                </h4>
            </div>
            <h3 className="text-gray-800 text-[15px] sm:text-[16px] mb-2 hidden xl:inline">
                {factura?.descripcion || 'Descripción'}
            </h3>
            <ClienteFacturaCard cliente={factura.cliente}/>
        </div>
    </div>
</div>
);}
