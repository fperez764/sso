import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Image from 'next/image';
import { useAuthState } from '../../context/auth';
import { ClienteServicioTicketAccion, FlujoTicketAcciones, accion_estado_enum } from '@types/typesSSO';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
	acciones: ClienteServicioTicketAccion[] | FlujoTicketAcciones[];
	setAccion: any; //Autoejecuta el editar respuesta en caso de que el area de la respuesta sea ADD
}

export default function FlujoTimeline({ acciones, setAccion }: Props) {
	const { user } = useAuthState();
	if (!acciones || acciones.length === 0) return <p>Timeline no definido</p>;
	//const porResponder = respuestas.find((r: Respuesta) => r.estado !== EstadoRespuesta.ACEPTADO);
	const isLast = (respuesta: any) => {
		return acciones.length - 1 === acciones.indexOf(respuesta);
	};
	const [selected, setSelected] = useState<ClienteServicioTicketAccion | FlujoTicketAcciones | null>(null);

	const getColorProxRespuesta = (accion: ClienteServicioTicketAccion) => {
		const accionesActivas = acciones.filter(a => !a.fechaBaja);
		let curIndex = accionesActivas.indexOf(accion);
		if (accionesActivas.length - 1 === curIndex) return 'bg-transparent';
		const nextRes = accionesActivas[curIndex + 1];
		if (!('estado' in nextRes)) return 'bg-blue-400';
		return nextRes.estado === accion_estado_enum.RECHAZADO ? 'bg-red-400' : nextRes.estado === accion_estado_enum.ACEPTADO ? 'bg-green-400' : 'bg-gray-400';
	};

	const handleSelect = (respuesta: ClienteServicioTicketAccion | FlujoTicketAcciones) => {
		setAccion(respuesta);
		setSelected(respuesta);
	};

	return (
		<div className="mb-2 overflow-x-auto">
			<ol className="flex items-center">
				{acciones.filter(r => !r.fechaBaja).map((accion) => {
					const colorTL =
						'estado' in accion ? (accion.estado === accion_estado_enum.ACEPTADO 
							? 'bg-green-400' : accion.estado === accion_estado_enum.RECHAZADO 
							? 'bg-red-400' : 'bg-gray-400') : 'bg-gray-400';
					return (<li
						key={accion.id}
						onClick={() => handleSelect(accion)}
						className={`relative pt-3 cursor-pointer rounded-md ${selected?.id === accion.id ? 'bg-gray-300' : ''}  
                		${user && accion.usuarioAsignado === user?.username ? 'border-4 border-yellow-300' : ''}`}
					>
						<div className="flex items-center">
							<div className={`w-full h-1.5 ${colorTL}`} />
							<div className="z-10 flex items-center justify-center w-6 h-6 mx-2 bg-transparent bg-blue-200 rounded-full ring-0 shrink-0">
								<Image
									className={`absolute rounded-full h-11 w-11 ${colorTL}`} 
									width={64}
									height={64}
									src={`/images/areas/${accion?.area}.png`}
									alt={accion?.area || 'usuario-area'}
								/>
								{'leido' in accion && accion.leido && <CheckCircleIcon className="absolute w-8 mb-4 ml-16 font-bold text-sky-400" />}
							</div>
							{
								<div className={`w-full h-1.5 ${isLast(accion) ? 'bg-transparent' : getColorProxRespuesta(accion)}`}>
									{!isLast(accion) && <ChevronRightIcon className={`h-6 absolute w-1/2 ml-3 -mt-2 text-${getColorProxRespuesta(accion)}-400`} />}
								</div>
							}
						</div>
						<div className="flex-col w-32 mt-3 text-center border-gray-200 border-x">
							<p className="text-xs font-bold">{accion?.area}</p>
							<p className="h-6 overflow-hidden text-md">
								{accion.orden}: {accion.accion}
							</p>
							{'leido' in accion ? <>
							<div className="flex flex-col items-center h-8 overflow-hidden text-xs text-black">
								<p className="self-start font-semibold">{(accion.usuarioAsignado ?? 'Pendiente') + ':'}</p>
								{accion.fechaRespuesta ? <p>Resp:{`${accion.respuesta}. ${dayjs(accion.fechaRespuesta).fromNow()}`}</p>
								: accion.vigenciaDias > 0 ?
								<p>Sin vigencia</p>
								: accion.fechaFin
									? <p>{`Vence ${dayjs(accion.fechaFin).fromNow()}`}</p>
									: <p>{`Vigencia: ${accion.vigenciaDias} día${(accion.vigenciaDias || 1) > 1 ? 's' : ''}`}</p>}
							</div>
							</> : 
							<p>Vigencia: {`${accion.vigenciaDias} día${(accion.vigenciaDias || 0) > 1 ? 's' : ''}`}</p>}
						</div>
					</li>);
				})}
			</ol>
		</div>
	);
}
