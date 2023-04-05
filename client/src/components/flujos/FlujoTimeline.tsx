import { EstadoRespuesta, FlujoRespuesta, Respuesta } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
    respuestas: Respuesta[]|FlujoRespuesta[];
    setRespuesta: any; //Autoejecuta el editar respuesta en caso de que el area de la respuesta sea ADD
}

export default function FlujoTimeline({ respuestas, setRespuesta }: Props) {
    if(!respuestas || respuestas.length === 0) return <p>Timeline no definido</p>
    const porResponder = respuestas.find((r: Respuesta) => r.estado !== EstadoRespuesta.ACEPTADO);
    const isLast = (respuesta: any) => {return respuestas.length -1 === respuestas.indexOf(respuesta);};
    const [selected, setSelected] = useState<Respuesta|FlujoRespuesta|null>(null);
    
    const getColorProxRespuesta = (respuesta: any) => {
        let curIndex = respuestas.indexOf(respuesta);
        if(respuestas.length -1 === curIndex) curIndex--;
        const nextRes = respuestas[curIndex + 1];
        if(!('estado' in nextRes)) return 'gray';
        return nextRes.estado === EstadoRespuesta.RECHAZADO 
        ? 'red' : nextRes.estado === EstadoRespuesta.ACEPTADO  
        ? 'green' : 'gray';
    };

    const handleSelect = (respuesta: Respuesta|FlujoRespuesta) => {
        setRespuesta(respuesta);
        setSelected(respuesta);
    }

  return (
    <div className="overflow-x-auto mb-2">
        <ol className="items-center flex">
        {respuestas.map(respuesta =>{
            const colorTL = 'estado' in respuesta ? (respuesta.estado === EstadoRespuesta.ACEPTADO 
            ? 'bg-green-400' : respuesta.estado === EstadoRespuesta.RECHAZADO ? 'bg-red-400' : 'bg-gray-400') : 'bg-gray-400'; 
            
            return <li key={respuesta.id} className={`relative pt-3 cursor-pointer ${selected?.id === respuesta.id ? 'bg-gray-200' : ''}`}>
                <div className="flex items-center" onClick={()=>handleSelect(respuesta)}>
                    <div className={`w-full h-1.5 ${colorTL}`}/>
                    <div className={`flex mx-2 z-10 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-0 bg-transparent shrink-0`}>
                        <img
                            className={`absolute rounded-full h-11 ${respuesta.id === porResponder?.id ? 'bg-yellow-300': colorTL}`}
                            src={`/images/areas/${respuesta.area}.png`}
                            alt={respuesta.area || 'usuario-area'}
                        />
                    </div>
                    {<div className={`w-full h-1.5 bg-${isLast(respuesta) ? 'transparent' : getColorProxRespuesta(respuesta)}-400`}>
                       {!isLast(respuesta) && <ChevronRightIcon className={`h-6 absolute w-1/2 ml-3 -mt-2 text-${getColorProxRespuesta(respuesta)}-400`}/>}
                    </div>}
                </div>
                <div className={`w-32 mt-3 border-x border-gray-200 flex-col text-center`}>
                    <p className={`${respuesta.id === porResponder?.id ? 'text-red-600':''} text-xs font-bold`}>{respuesta.area}</p>
                    <p className="h-6 overflow-hidden text-md">{respuesta.orden}: {respuesta.accion}</p>
                    {'usuarioAsignado' in respuesta && <p className="h-3 text-black overflow-hidden text-xs">{respuesta.usuarioAsignado?.username ?? ''}</p>}
                    <p className="h-4 text-black overflow-hidden text-xs">
                    {'fechaFin' in respuesta ? (respuesta.fechaFin ? dayjs(respuesta.fechaFin).format('MMMM') : '') : `Vigencia: ${respuesta.vigenciaDias} día${respuesta.vigenciaDias > 1 ? 's':''}`}
                    </p>
                </div>
            </li>}
        )}
        </ol>
    </div>
  );
}