import { SolicitudRespuesta } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
    editar: boolean;
    respuestas: SolicitudRespuesta[] | TicketRespuesta[];
    setRespuesta: any; //Autoejecuta el editar respuesta en caso de que el area de la respuesta sea ADD
}

export default function FlujoTimeline({ respuestas, setRespuesta, editar }: Props) {

    const isLast = (respuesta: SolicitudRespuesta) => {return respuestas.length -1 === respuestas.indexOf(respuesta);};
    const getColorTimeline = (aceptado: string) => {
        switch (aceptado) {
            case 'APROBADO':
                return 'green';
            case 'RECHAZADO':
                return 'red';        
            default:
                return 'gray';
        }
    };
    const getColorProxRespuesta = (respuesta: SolicitudRespuesta) => {
        const curIndex = respuestas.indexOf(respuesta);
        const estado = respuestas.length -1 === curIndex ? 'pendiente' : respuestas[curIndex + 1].estado;
        return getColorTimeline(estado);
    };
    const instertarRespuesta = (respuestaAnt: SolicitudRespuesta) => {
        const t = toast.loading('Insertar respuesta despues de ' + respuestaAnt.accion);
        const nuevaResp = {
            orden: respuestaAnt.orden + .1,
            area: 'ADD',
            accion: '',
        }
        setRespuesta(nuevaResp);
        toast.success(JSON.stringify(nuevaResp), {id: t});
    }

  return (
    <div className="w-[95%] mt-4 ml-3 overflow-x-scroll lg:inline">
        <ol className="items-center ml-6 sm:flex">
        {respuestas.map(respuesta =>
            <li key={respuesta.id} className="relative mt-2 mb-6 sm:mb-0">
                <div className="flex items-center">
                    <div className={`flex mx-2 cursor-pointer z-10 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-0 sm:ring-8 bg-transparent shrink-0 ring-${getColorTimeline(respuesta.estado)}-300`} onClick={() => setRespuesta(respuesta)}>
                        <img
                            className="absolute rounded-full cursor-pointer h-11"
                            src={`/images/areas/${respuesta.area}.png`}
                            alt={respuesta.area || 'usuario-area'}
                        />
                        {editar && <PencilSquareIcon className='absolute h-4 mb-10 ml-10 z-11 hoverEffect'/>}
                    </div>
                    {!isLast(respuesta) && <div className={`w-full h-1 bg-${getColorProxRespuesta(respuesta)}-400`}/>}
                    {editar && <>
                        <PlusCircleIcon className='rounded-full cursor-pointer' onClick={()=>instertarRespuesta(respuesta)}/>
                        <div className={`w-full h-1 bg-${getColorProxRespuesta(respuesta)}-400`}/>
                    </>}
                </div>
                <div className="w-32 mt-3 -ml-2 sm:pr-8">
                    <h3 className="text-xs font-semibold ">{respuesta.area.replace("_", " ")}</h3>
                    <h4 className="h-12 overflow-hidden text-xs">{respuesta.accion}</h4>
                    {respuesta.fechaInicio ? <time className="block mb-2 text-sm font-normal leading-none text-gray-500">{ dayjs(respuesta.fechaInicio).format('DD/MM/YYYY')}</time>: null}
                </div>
            </li>
        )}
        </ol>
    </div>
  );
}