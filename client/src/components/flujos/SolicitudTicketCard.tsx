import { ArrowUpOnSquareIcon, ArrowDownOnSquareIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { Respuesta, ClienteSolicitud, ClienteServicioTicket, Roles, getColorSeveridad, EstadoRespuesta } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuthState } from '../../context/auth';
import FlujoServicio from './FlujoServicio';
import FlujoCliente from './FlujoCliente';
import FlujoTimeline from './FlujoTimeline';
import FlujoCreador from './FlujoCreador';
import Icons from '../Icons';
import { anularTicket, eliminarTicket } from '../../pages/tickets';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
	post: ClienteSolicitud | ClienteServicioTicket;
	setSelectedSubPost: any;
	selectedSubPost: Respuesta | null;
	setEditSubPost: any;
	editSubPost: boolean;
}

export default function SolicitudTicketCard({ post, setSelectedSubPost, setEditSubPost, editSubPost }: Props) {
	const { user } = useAuthState();

	const [anulado, setAnulado] = useState(false);
	const [mostrarFlujo, setMostrarFlujo] = useState(false);
	const [respuestas, setRespuestas] = useState<Respuesta[]>(post.respuestas);

	useEffect(() => {
		setRespuestas(post.respuestas);
	}, [post]);

	const owner = user?.username === post.usuarioCreacion.username;
	const admin = user?.rol === Roles.ADMIN;
	//TODO! RESUELTO SOLO DESDE FLAG
	const resuelto = !post.respuestas.find((r) => r.estado !== EstadoRespuesta.ACEPTADO); //Si todas las respuestas tienen estado ACEPTADO
	const endpoint = 'servicio' in post ? '/solicitudes' : '/tickets';

	const color = resuelto ? 'green-400' : 'severidad' in post ? getColorSeveridad(post) : 'blue-300';
	const bgColorSeveridad = `bg-${color}`;
	const borderColorSeveridad = `border-${color}`;
	const porResponder = post.porResponder;

	const asignado = user && !!post.respuestas.find((r) => r.usuarioAsignado?.username === user.username && !r.fechaRespuesta);
	const asignable = user && post.respuestas.find((r) => !r.usuarioAsignado && r.area === user.area);
	const respondido = user && !!post.respuestas.find((r) => r.usuarioAsignado?.username === user.username && !!r.fechaRespuesta);
	const resumen = asignado ? 'Por responder' : asignable ? 'Asignable' : respondido ? 'Ya respondiste' : owner ? 'Creado por ti' : '';

	const FlujoTextos = (
		<div className={`flex w-full h-full overflow-hidden ${bgColorSeveridad} rounded items-center`} onClick={() => setMostrarFlujo(!mostrarFlujo)}>
			{'severidad' in post && <h4 className="px-2 font-bold text-center border-2 border-black rounded-lg">{resuelto ? 'RESUELTO' : post.severidad}</h4>}
			<div className="flex-col py-2 ml-3 max-w-48">
				<p className="font-bold text-[13px]">{post.grupo?.tipo}</p>
				<p className="font-bold text-[13px]">No. {post.id}</p>
				<p className="text-gray-800 text-[12px] sm:text-[13px]">Origen: {post.origen} </p>
			</div>
			<p className="self-center w-[80%] px-4 overflow-auto text-lg max-h-24 text-start">{(anulado ? 'ANULADO: ' : '') + (post.grupo?.nombre || 'GRUPO POR ASIGNAR') + ': ' + post.descripcion}</p>
			<div className="self-end w-8">
				{mostrarFlujo ? <ArrowUpOnSquareIcon /> : <ArrowDownOnSquareIcon />}
			</div>
		</div>
	);

	return (
		<div className={`rounded-xl my-6 border-4 cursor-pointer ${post.usuarioBaja || anulado ? 'bg-red-700' : 'bg-gray-100'} ${borderColorSeveridad}`}>
			{/*Resumen*/}
			{user && <p className="px-2 font-bold text-center bg-yellow-400 rounded-md w-36">{resumen}</p>}
			{!resuelto && (
				<div className="flex items-center justify-around" onClick={() => setSelectedSubPost(post.porResponder || post.respuestas[0])}>
					<div className="flex flex-col w-1/2">
						<FlujoCliente cliente={'severidad' in post ? post.clienteServicio?.cliente : post.cliente} className="w-full" />
					</div>
					<FlujoServicio servicio={'servicio' in post ? post.servicio : post.clienteServicio?.servicio} />
					<FlujoCreador post={post} className="items-center" />
					{/*Cliente*/}
				</div>
			)}
			{FlujoTextos}
			{mostrarFlujo && (
				<div className="flex flex-col mt-1">
					<FlujoTimeline respuestas={respuestas.sort((r, s) => r.orden - s.orden)} setRespuesta={setSelectedSubPost} />
					{admin && (
						<Icons
							handleDelete={() => {
								eliminarTicket(post.id);
								setAnulado(true);
							}}
							handleNullify={() => {
								anularTicket(post.id);
								setAnulado(true);
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
}
