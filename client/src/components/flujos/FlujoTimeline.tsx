import { EstadoRespuesta, Respuesta, getPorResponder } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
    editar: boolean;
    respuestas: Respuesta[];
    setRespuesta: any; //Autoejecuta el editar respuesta en caso de que el area de la respuesta sea ADD
}

export default function FlujoTimeline({ respuestas, setRespuesta, editar }: Props) {
    const porResponder = respuestas.find(r => r.estado !== EstadoRespuesta.ACEPTADO);
    const isLast = (respuesta: Respuesta) => {return respuestas.length -1 === respuestas.indexOf(respuesta);};
    
    
    const getColorProxRespuesta = (respuesta: Respuesta) => {
        const curIndex = respuestas.indexOf(respuesta);
        return respuestas.length -1 === curIndex 
            ? 'gray': respuestas[curIndex + 1].estado === EstadoRespuesta.RECHAZADO 
            ? 'red' : respuestas[curIndex + 1].estado === EstadoRespuesta.ACEPTADO
            ? 'green' : 'gray' ;
    };
    const instertarRespuesta = (respuestaAnt: Respuesta) => {
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
        {respuestas.map(respuesta =>{

            const colorTL = respuesta.estado === EstadoRespuesta.ACEPTADO 
            ? 'bg-green-400' : respuesta.estado === EstadoRespuesta.RECHAZADO ? 'bg-red-400' : 'bg-gray-400'; 
            
            return <li key={respuesta.id} className={`relative mt-2 mb-6 sm:mb-0`}>
                <div className="flex items-center">
                    <div className={`flex mx-2 cursor-pointer z-10 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-0 sm:ring-8 bg-transparent shrink-0`} 
                    onClick={() => setRespuesta(respuesta)}>
                        <img
                            className={`absolute rounded-full cursor-pointer h-11 ${respuesta.id === porResponder?.id ? 'bg-yellow-300': colorTL}`}
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
                <div className={`w-32 mt-3 -ml-2 sm:pr-8`}>
                    <h3 className={` ${respuesta.id === porResponder?.id ? 'text-red-600':''} text-xs -ml-2 w-20 font-semibold`}>{respuesta.area.replace("_", "_")}</h3>
                    <p className="h-3 overflow-hidden text-xs">{respuesta.estado}</p>
                    <p className="h-3 text-black overflow-hidden text-xs">{respuesta.fechaFin ? dayjs(respuesta.fechaFin).format('MMMM') : ''}</p>
                    <p className="h-3 text-black overflow-hidden text-xs">{respuesta.usuarioAsignado?.username ?? ''}</p>
                </div>
            </li>}
        )}
        </ol>
    </div>
  );
}