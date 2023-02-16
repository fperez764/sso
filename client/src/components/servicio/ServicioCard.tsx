import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Servicio } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
    servicio: Servicio,
}

export default function ServicioCard({ servicio }: Props) {
return (
<div className={`flex p-3 border-b border-gray-400 bg-cursor-pointer ${servicio.usuarioBaja && 'bg-red-500'}`}>
    {/**Service info */}
    <div className="flex w-[95%]">
        {servicio.categoria && <img
            className="w-12 h-12 mr-2 rounded"
            src={`/images/servicio-categoria/${servicio.categoria.nombre}.png`}
            alt={servicio.categoria.nombre || 'servicio-categoria'}
        />}
        <div className="inline w-[90%]">
            <h1 className="font-bold">{servicio.nombre}:</h1>
            <h2 className="">{servicio.descripcion}</h2>
        </div>
        <div className="inline place-self-end">
            <h4 className="font-bold text-[13px] sm:text-[12px] mt-1 hover:underline">
                Creado: {dayjs(servicio.fechaModificacion).format('DD/MM/YY')}
            </h4>
            <h3 className="text-gray-800 text-[14px] sm:text-[13px] mb-2">
                @{servicio.usuarioCreacion.username}
            </h3>
        </div>
    </div>
    <div className={`w-8 h-8 mr-4 rounded-full ${servicio.activo ? 'bg-green-400':'bg-red-400'}`}>
        {servicio.activo ? <CheckCircleIcon /> : <XCircleIcon />}
    </div>
</div>
);}
