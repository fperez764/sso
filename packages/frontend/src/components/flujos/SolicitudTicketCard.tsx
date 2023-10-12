import { ArrowUpOnSquareIcon, ArrowDownOnSquareIcon, DocumentCheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import { ClienteServicioTicket, ClienteServicioTicketAccion, users_rol_enum, users_area_enum } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuthState } from '../../context/auth';
import FlujoServicio from './FlujoServicio';
import FlujoCliente from './FlujoCliente';
import FlujoTimeline from './FlujoTimeline';
import FlujoCreador from './FlujoCreador';
import Icons from '../ui/Icons';
import Link from 'next/link';
import { getColorSeveridad } from '@src/utils/common';
import { anularTicket, deleteTicket } from '@src/app/api/tickets/tickets';
import Button from '../ui/Button';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
	post: ClienteServicioTicket;
	setSelectedSubPost: any;
	selectedSubPost: ClienteServicioTicketAccion | null;
	setEditSubPost: any;
	editSubPost: boolean;
}

export default function SolicitudTicketCard({ post, setSelectedSubPost, setEditSubPost, editSubPost }: Props) {
	const { user } = useAuthState();

	const [anulado, setAnulado] = useState(post.acciones?.length === 0 || !!post.fechaBaja);
	const [mostrarFlujo, setMostrarFlujo] = useState(false);
	const [acciones, setAcciones] = useState<ClienteServicioTicketAccion[]>(post.acciones);

	useEffect(() => {
		setAcciones(post.acciones);
	}, [post]);

	const owner = user?.username === post.usuarioCreacion;
	const admin = user?.rol === users_rol_enum.ADMIN;

	const color = post.resuelto ? 'green-400' : anulado ? 'slate-500' : getColorSeveridad(post);
	const bgColorSeveridad = `bg-${color}`;
	const borderColorSeveridad = `border-${color}`;

	const asignado = user && !!post.acciones?.find((r) => r.usuarioAsignado === user.username && !r.fechaRespuesta);
	const asignable = user && post.acciones?.find((r) => !r.usuarioAsignado && r?.area === user?.departamento);
	const respondido = user && !!post.acciones?.find((r) => r.usuarioAsignado === user.username && !!r.fechaRespuesta);
	const resumen = asignado ? 'Por responder' : asignable ? 'Asignable' : respondido ? 'Ya respondiste' : owner ? 'Creado por ti' : '';

	const FlujoTextos = (
		<div className='flex items-center w-full h-full overflow-hidden rounded bg-slate-300' onClick={() => setMostrarFlujo(!mostrarFlujo)}>
			<Link className="flex flex-col items-center hover:underline" href={`/tickets/${post.id}`}>
				<p className="font-bold text-[13px] w-16">Ticket: {post.id}</p>
				<h4 className={`px-2 font-bold text-center border-2 border-black rounded-lg ${bgColorSeveridad}`}>{(post.resuelto ? `${post.tipo || ''} RESUELTO ` : anulado ? 'ANULADO ' : '') + post.severidad}</h4>
			</Link>
			<div className="flex-col py-2 ml-3 max-w-48">
				<p className="font-bold text-[13px]">{post.flujoTicket?.tipo}</p>
				<p className="text-gray-800 text-[12px] sm:text-[13px]">Origen: {post.origen} </p>
			</div>
			<p className="self-center w-[80%] px-4 overflow-auto text-lg max-h-24 text-start">{(post.nombreFlujo || 'GRUPO POR ASIGNAR') + ': ' + post.descripcion}</p>
			<div className="flex flex-col space-y-1">
			{!!post.ordenMantenimiento && <Link href={`tickets/${post.id}/odm`} target='_blank'>
  			  <Button title='ODM' Icon={DocumentCheckIcon} onClick={()=> {setSelectedSubPost(post.acciones.find((a) => a.area === users_area_enum.INSTALACIONES));}} />
			</Link>}
			{!!post.acciones.find(a=>a.actaEntrega) && <Link href={`/tickets/acciones/${post.acciones.find(a=>a.actaEntrega)?.id}/ade/`} target='_blank'>
				<Button title={'ADE' + post.acciones.find(a=>a.actaEntrega)?.id} Icon={DocumentDuplicateIcon} /></Link>}
			</div>
			{!!post.porResponder && <div className='hidden lg:inline'>
				<p ><span className='text-xs'>Por Responder:</span> {`${post.porResponder?.area}:${post.porResponder?.usuarioAsignado || ''}`}</p>
			</div>}
			<div className="self-end w-8">
				{mostrarFlujo ? <ArrowUpOnSquareIcon /> : <ArrowDownOnSquareIcon />}
			</div>
		</div>
	);

	return (
		<div className={`rounded-xl my-6 border-4 cursor-pointer ${post.usuarioBaja || anulado ? 'bg-slate-500' : 'bg-gray-100'} ${borderColorSeveridad}`}>
			{/*Resumen*/}
			{user && <p className="px-2 font-bold text-center bg-yellow-400 rounded-md w-36">{resumen}</p>}
			{FlujoTextos}
			<div className="flex items-center justify-around" onClick={() => setSelectedSubPost(post.porResponder || post.acciones[0])}>
				<div className="flex flex-col w-1/2">
					<FlujoCliente cliente={post.clienteServicio?.cliente} className="w-full" />
				</div>
				<FlujoServicio servicio={post.clienteServicio?.servicio} />
				<FlujoCreador post={post} className="items-center" />
				{/*Cliente*/}
			</div>
			{mostrarFlujo && (
				<div className="flex flex-col mt-1">
					<FlujoTimeline acciones={acciones.sort((r, s) => r.orden - s.orden)} setAccion={setSelectedSubPost} />
					{admin && (
						<Icons
							handleDelete={() => {
								deleteTicket(post.id.toString());
								setAnulado(true);
							}}
							handleNullify={() => {
								anularTicket(post.id.toString());
								setAnulado(true);
							}}
						/>
					)}
				</div>
			)}
		</div>
	);
}
