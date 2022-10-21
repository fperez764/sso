import { SolicitudRespuesta } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale(es);
dayjs.extend(relativeTime);

export enum AreasAceptacion {
    INSTALADOR = 'INS',
    COMERCIAL = 'COM',
    DOCUMENTOS_COMERCIAL = 'DCOM',
    DOCUMENTOS_INSTALADOR = 'DINS',
    MODEM_ALMACEN = 'ALM',
    MODEM_INSTALADOR = 'MINS',
    INSTALADO = 'INSDO',
    ACTIVADO = 'ACT',
    DOCUMENTOS_ENTREGADOS = 'DNTR',
}

interface Props {
    respuestas: SolicitudRespuesta[];
}

type area = keyof typeof AreasAceptacion;
const areasKeys = Object.keys(AreasAceptacion) as Array<area>;
export default function SSItemTimeline({ respuestas }: Props) {
    const isLast = (respuesta: SolicitudRespuesta) => {return respuestas.length -1 === respuestas.indexOf(respuesta);};
    const getColorTimeline = (aceptado: string) => {
        console.log(aceptado);
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
  return (
    <div className="overflow-x-auto mt-4">
        <ol className="items-center ml-2 sm:flex">
            {respuestas.map(respuesta =>
            <li className="relative mb-6 mt-2 sm:mb-0">
                <div className="flex items-center">
                    <div className={`flex mx-2 cursor-pointer z-10 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-0 sm:ring-8 bg-transparent shrink-0 ring-${getColorTimeline(respuesta.estado)}-400`}>
                        <img
                            className="rounded-full h-11 absolute"
                            src={`/images/areas/${respuesta.area}.png`}
                            alt={respuesta.area || 'usuario-area'}
                        />
                    </div>
                    {!isLast(respuesta) && <div className={`hidden sm:flex w-full h-1 bg-${getColorProxRespuesta(respuesta)}-400`}/>}
                </div>
                <div className="mt-3 -ml-2 w-32 sm:pr-8">
                    <h3 className="text-sm font-semibold overflow-hidden">{respuesta.area}</h3>
                    <h4 className="text-sm overflow-clip">{respuesta.accion.toLowerCase()}</h4>
                    <time className="block mb-2 text-sm font-normal leading-none text-gray-500">{respuesta.fechaCreacion !== '' ? dayjs(respuesta.fechaCreacion).format('DD/MM/YYYY') : 'Pendiente'}</time>
                </div>
            </li>
        )}
        </ol>
    </div>
  );
}