import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Servicio } from '../../../types/typesSSO';

interface Props {
    servicio: Servicio,
}

export default function SSServicio({ servicio }: Props) {
return (
<div className='flex p-3 border-b border-gray-400 bg-cursor-pointer'>
    {/**Service info */}
    <div className="w-[95%]">
        {servicio.categoria && <img
            className="w-12 h-12 mr-4 rounded"
            src={`/images/servicio-categoria/${servicio.categoria.nombre}.png`}
            alt={servicio.categoria.nombre || 'servicio-categoria'}
        />}
        <h1 className="font-bold">{servicio.nombre}:</h1>
        <h2 className="mx-1">{servicio.descripcion}</h2>
        <h4 className="font-bold text-[13px] sm:text-[12px] mt-1 hover:underline">
            Creado: {servicio.fechaModificacion.toString()}
        </h4>
        <h3 className="text-gray-800 text-[14px] sm:text-[13px] mb-2">
            @{servicio.usuarioCreacion.username}
        </h3>
    </div>
    <div className={`w-8 h-8 mr-4 rounded-full bg-${servicio.activo ? 'green':'red'}-400`}>
        {servicio.activo ? <CheckCircleIcon /> : <XCircleIcon />}
    </div>
</div>
);}
