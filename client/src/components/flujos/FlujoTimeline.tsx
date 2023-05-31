/** @format */

import { EstadoRespuesta, FlujoRespuesta, Respuesta } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { CheckCircleIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Image from 'next/image';
import { useAuthState } from '../../context/auth';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
	respuestas: Respuesta[] | FlujoRespuesta[];
	setRespuesta: any; //Autoejecuta el editar respuesta en caso de que el area de la respuesta sea ADD
}

export default function FlujoTimeline({ respuestas, setRespuesta }: Props) {
	const { user } = useAuthState();
	if (!respuestas || respuestas.length === 0) return <p>Timeline no definido</p>;
	//const porResponder = respuestas.find((r: Respuesta) => r.estado !== EstadoRespuesta.ACEPTADO);
	const isLast = (respuesta: any) => {
		return respuestas.length - 1 === respuestas.indexOf(respuesta);
	};
	const [selected, setSelected] = useState<Respuesta | FlujoRespuesta | null>(null);

	const getColorProxRespuesta = (respuesta: any) => {
		let curIndex = respuestas.indexOf(respuesta);
		if (respuestas.length - 1 === curIndex) curIndex--;
		const nextRes = respuestas[curIndex + 1];
		if (!('estado' in nextRes)) return 'gray';
		return nextRes.estado === EstadoRespuesta.RECHAZADO ? 'red' : nextRes.estado === EstadoRespuesta.ACEPTADO ? 'green' : 'gray';
	};

	const handleSelect = (respuesta: Respuesta | FlujoRespuesta) => {
		setRespuesta(respuesta);
		setSelected(respuesta);
	};

	return (
		<div className="mb-2 overflow-x-auto">
			<ol className="flex items-center">
				{respuestas.map((respuesta) => {
					const colorTL =
						'estado' in respuesta ? (respuesta.estado === EstadoRespuesta.ACEPTADO ? 'bg-green-400' : respuesta.estado === EstadoRespuesta.RECHAZADO ? 'bg-red-400' : 'bg-gray-400') : 'bg-gray-400';

					return (
						<li
							key={respuesta.id}
							onClick={() => handleSelect(respuesta)}
							className={`relative pt-3 cursor-pointer rounded-md ${selected?.id === respuesta.id ? 'bg-gray-300' : ''}  
                ${user && respuesta.usuarioAsignado?.username === user?.username ? 'border-4 border-yellow-300' : ''}`}
						>
							<div className="flex items-center">
								<div className={`w-full h-1.5 ${colorTL}`} />
								<div className="z-10 flex items-center justify-center w-6 h-6 mx-2 bg-transparent bg-blue-200 rounded-full ring-0 shrink-0">
									<Image
										className={`absolute rounded-full h-11 w-11 ${colorTL}`} //${respuesta.id === porResponder?.id ? 'bg-yellow-300': colorTL}`}
										width={64}
										height={64}
										src={`/images/areas/${respuesta?.area}.png`}
										alt={respuesta?.area || 'usuario-area'}
									/>
									{'leido' in respuesta && respuesta.leido && <CheckCircleIcon className="absolute w-8 mb-4 ml-16 font-bold text-sky-400" />}
								</div>
								{
									<div className={`w-full h-1.5 bg-${isLast(respuesta) ? 'transparent' : getColorProxRespuesta(respuesta)}-400`}>
										{!isLast(respuesta) && <ChevronRightIcon className={`h-6 absolute w-1/2 ml-3 -mt-2 text-${getColorProxRespuesta(respuesta)}-400`} />}
									</div>
								}
							</div>
							<div className="flex-col w-32 mt-3 text-center border-gray-200 border-x">
								<p className="text-xs font-bold">{respuesta?.area}</p>
								<p className="h-6 overflow-hidden text-md">
									{respuesta.orden}: {respuesta.accion}
								</p>
								{'usuarioAsignado' in respuesta && <p className="h-3 overflow-hidden text-xs text-black">{respuesta.usuarioAsignado?.username ?? ''}</p>}
								<p className="h-4 overflow-hidden text-xs text-black">
									{'fechaFin' in respuesta
										? respuesta.fechaRespuesta
											? `Resp. ${dayjs(respuesta.fechaRespuesta).fromNow()}`
											: respuesta.fechaFin
											? `Vence ${dayjs(respuesta.fechaFin).fromNow()}`
											: ''
										: `Vigencia: ${respuesta.vigenciaDias} día${(respuesta.vigenciaDias || 1) > 1 ? 's' : ''}`}
								</p>
							</div>
						</li>
					);
				})}
			</ol>
		</div>
	);
}
