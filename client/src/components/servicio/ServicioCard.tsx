import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Servicio } from '../../../types/typesSSO';

interface Props {
    servicio: Servicio,
}

export default function SSServicio({ servicio }: Props) {
  return (
    <div className={`p-3 border-b border-red-400 bg- w-1/6 cursor-pointer bg-${servicio?.activo ? 'green':'red'}-300 bg-red-300`}>
    {/*Header*/}
    <div className={'items-center '}>
        {/**Service info */}
        <div className="flex justify-between">
            <img
                className="w-12 h-12 mr-4 rounded"
                src={'/servicio-categoria/INTERNET.gif'}
                alt={servicio?.categoria || 'servicio-categoria'}
            />
            <div className='w-8 h-8 mr-4 rounded'>
            {servicio?.activo ? <CheckCircleIcon /> : <XCircleIcon />}
            </div>
        </div>
        <div className="items-center space-x-1 text-sm whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {servicio?.categoria || 'Categoria'}
            </h4>
        </div>
        <h3 className="text-gray-800 text-[15px] sm:text-[16px] mb-2 hidden xl:inline">
        {servicio?.descripcion || 'Descripción del servicio'}
        </h3>
    </div>
</div>
);}
