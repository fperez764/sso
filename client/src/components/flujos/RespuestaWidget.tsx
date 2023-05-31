import { Respuesta, ClienteSolicitud, ClienteServicioTicket, EstadoRespuesta, Roles, Cliente, getColorSeveridad, DateFormat } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from '../Button';
import { ArchiveBoxXMarkIcon, CalendarDaysIcon, CheckCircleIcon, CheckIcon, DocumentPlusIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuthState } from '../../context/auth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import InputB from '../InputB';
import ComboBox from '../ComboBox';
import NuevaAccionFlujo from './NuevaAccionFlujo';
import FlujoCreador from './FlujoCreador';
import Image from 'next/image';
import ClienteWidget from '../cliente/ClienteWidget';
import Icons from '../Icons';
import ClienteTicketWidget from '../cliente/ClienteTicketWidget';
import Contacto from '../cliente/Contacto';
import { anularRespuesta, anularTicket, eliminarTicket, resolverTicket } from '../../pages/tickets';
import SeccionComentarios from './Comentarios';
import Link from 'next/link';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
	respuesta: Respuesta;
	post: ClienteSolicitud | ClienteServicioTicket;
	cliente: Cliente;
	setShowNew: any;
	setShowEdit: any;
	setEditPost?: any;
	showEdit: boolean;
	handleFeederRefresh: () => void;
}

export default function RespuestaWidget({ respuesta: sRespuesta, post, cliente, setShowEdit, setEditPost, showEdit, setShowNew, handleFeederRefresh }: Props) {
	const { user } = useAuthState();
	const [anulado, setAnulado] = useState(false);
	const [textoRespuesta, setTextoRespuesta] = useState('Hecho');
	const [userNameAsignado, setUsernameAsignado] = useState<string>(user?.username || '');
	const [respuesta, setRespuesta] = useState<Respuesta>(sRespuesta);
	const [nuevaRespuesta, setNuevaRespuesta] = useState({});
	const [porResponderId, setPorResponderId] = useState(post.porResponder?.id || post.respuestas[0]?.id);
	const [showConfirmSave, setShowConfirmSave] = useState(false);

	const admin = user?.rol === Roles.ADMIN;
	const ownerTicket = user?.username === post?.usuarioCreacion.username;
	const ownerRespuesta = user?.username === sRespuesta?.usuarioCreacion.username;

	const idx = sRespuesta ? post.respuestas.findIndex((r) => r.id === sRespuesta.id) : -1;
	const nextRespNoAcepatada = idx >= 0 && post.respuestas[idx + 1]?.estado !== EstadoRespuesta.ACEPTADO;
	const userAsignado = user?.username === respuesta?.usuarioAsignado?.username;
	const puedeAgregarPaso = nextRespNoAcepatada && !respuesta?.ticket?.resuelto && user && (admin || (userAsignado || ownerTicket));
	const puedeAsignar = !respuesta?.fechaRespuesta && (admin || user?.rol !== Roles.FUNCIONARIO || respuesta?.area === user?.area);
	const vencido = sRespuesta?.fechaFin && dayjs(sRespuesta.fechaFin).isBefore(new Date());
	const puedeResponder = admin || user?.area === respuesta?.area;
	
	useEffect(() => {
		sRespuesta && setRespuesta(sRespuesta);
		setTextoRespuesta('Hecho');
		setUsernameAsignado(user?.username || '');
		setPorResponderId(post.porResponder?.id || post.respuestas[0]?.id);
		setShowEdit(false);
		marcarComoLeido();
	}, [sRespuesta, post]);

	//Si la respuesta esta asignada y el ususario asignado la renderiza en este componente se marca como leida.
	const marcarComoLeido = async () => {
		if(!sRespuesta) return;
		if(sRespuesta.leido) return;
		if (user && sRespuesta?.usuarioAsignado?.username === user.username) {
			console.info(`USUARIO ASIGNADO ${user.username} LEE RESPUESTA: ${sRespuesta.id}`);
			try {
				await axios.post(`/tickets/respuestas/${sRespuesta.id}/leido`);
				setRespuesta({...respuesta, leido: true});
			} catch (error: any) {
				console.error('Marcar como leída: ' + error);
			}
			setShowEdit(false);
		}
	};

	if (!respuesta) return <p>'Seleccione una acción'</p>;

	const actualizarRespuesta = async () => {
		try {
			if (!respuesta) return;
			const res = await axios.get(`/tickets/respuestas/${respuesta.id}`);
			setRespuesta(res.data);
		} catch (error: any) {
			toast.error(error.code + 'No se pudo actualizar la respuesta ' + JSON.stringify(error.message));
		}
	};

	const responderRespuesta = async () => {
		if (!respuesta) {
			toast.error('Respuesta is null');
			return;
		}
		const responderToast = toast.loading('Guardando respuesta...');
		try {
			const res = await axios.post(`/tickets/respuestas/${respuesta.id}/responder`, { respuesta: textoRespuesta });
			toast.success(`Respuesta publicada ${res.data && res.data.respuesta + ' el ' + res.data.fechaRespuesta + ' a ' + res.data.accion}.`, {
				id: responderToast,
			});
			setRespuesta(res.data);
			setPorResponderId(post.porResponder.id + 1); //post.respuestas[post.respuestas.indexOf(porResponder)+1].id
			handleFeederRefresh();
		} catch (error: any) {
			toast.error(`No se pudo responder: ${JSON.stringify(error.response)}`, {
				id: responderToast,
			});
		}
	};

	const rechazarRespuesta = async () => {
		if (!respuesta) {
			toast.error('Respuesta is null');
			return;
		}
		if (textoRespuesta === 'Hecho') {
			toast.error('Texto rechazo no puede ser "Hecho"');
			setTextoRespuesta('');
			return;
		}
		const responderToast = toast.loading('Rechazando...');
		try {
			const res = await axios.post(`/tickets/respuestas/${respuesta.id}/rechazar`, { respuesta: textoRespuesta });
			toast.success('Respuesta rechazada.', {
				id: responderToast,
			});
			setRespuesta(res.data);
			setPorResponderId(post.porResponder.id - 1);
			handleFeederRefresh();
		} catch (error: any) {
			toast.error(`No se pudo rechazar: ${JSON.stringify(error.response)}`, {
				id: responderToast,
			});
		}
	};

	const instertarRespuesta = () => {
		const nuevaRespuestaGenerica = {
			idRespuestaAnterior: respuesta.id,
			orden: (respuesta.orden ?? 0) + 0.5,
			area: 'ADD',
			accion: 'Acción intermedia',
			estado: EstadoRespuesta.PENDIENTE,
			clienteServicioTicket: post,
		}
		setNuevaRespuesta(nuevaRespuestaGenerica);
		setShowEdit(true);
	};

	const confirmSaveNuevaResp = async () => {
		const tNAccion = toast.loading('Guardando nueva acción para flujo.');
		try {
			// Si hay un post lo edita cc crea uno nuevo.
			const res = await axios.post(`/tickets/respuestas/${post.id}`, nuevaRespuesta);
			toast.success('Nueva acción guardada.', { id: tNAccion });
			handleFeederRefresh();
			setShowEdit(false);
		} catch (error: any) {
			toast.error('No se pudo guardar la nueva acción.\n' + JSON.stringify(error.response?.data || error), {id: tNAccion});
		}
	};

	const iniciarEsperaRespuesta = async () => {
		try {
			const res = await axios.post(`/tickets/respuestas/${respuesta.id}/iniciar`);
			toast.success('Vigencia inicializada! \n' + res.data);
			handleFeederRefresh();
			setShowEdit(false);
		} catch (error: any) {
			toast.error('No se pudo guardar el flujo:\n' + JSON.stringify(error.response?.data || error));
		}
	};

	const asignarRespuesta = async () => {
		if (!user) {
			toast.error('Inicia sesión');
			return;
		}
		if (!userNameAsignado) setUsernameAsignado(user.username);
		if (!userNameAsignado) {
			toast.error('Selecciona un usuario para asignarlo');
			return;
		}
		const tAsignar = toast.loading('Asignando esta acción a funcionario ' + userNameAsignado);
		try {
			!!respuesta && (await axios.post(`/tickets/respuestas/${respuesta.id}/asignar`, { usuario: userNameAsignado }));
			handleFeederRefresh();
			actualizarRespuesta();
			toast.success('Acción de ticket asignada a ' + userNameAsignado, { id: tAsignar });
			handleFeederRefresh();
		} catch (error: any) {
			toast.error(`Algo salio mal ${JSON.stringify(error.response?.data || error)}`, { id: tAsignar });
		}
	};
	const colorTL = respuesta.estado === EstadoRespuesta.ACEPTADO ? 'bg-green-400' : respuesta.estado === EstadoRespuesta.RECHAZADO ? 'bg-red-400' : 'bg-gray-400';

	return (
		<div className={`flex flex-col px-2 py-2 space-y-2 ${post.usuarioBaja || anulado ? 'bg-red-700' : 'bg-gray-100'}rounded-md`}>
			{/*Info Ticket*/}
			<div className={`flex flex-col p-2 rounded-xl bg-gray-300`}>
				<div className="flex justify-between">
					<div className="flex flex-col">
						<Link className={`text-xl font-bold px-2 rounded-md hover:underline bg-${'severidad' in post ? getColorSeveridad(post) : 'gray-300'}`}
							href={`/tickets/${post.id}`}>
							Ticket: {post.id} {'severidad' in post ? `SEVERIDAD: ${post.severidad}` : ''}
						</Link>
						<span className="font-bold">
							Grupo: {post.grupo ? `${post.grupo?.tipo} - ${post.grupo?.nombre}` : 'POR ASIGNAR'}
						</span>
						<p className="my-2 text-xl">Descripcion: {post.descripcion}</p>
						<p className="text-gray-400">Origen: {post.origen}</p>
					</div>
					<FlujoCreador post={post} className="my-3" />
				</div>
				{/*Contacto Ticket*/}
				{'severidad' in post && (
					<div className="mb-3 ml-3">
						<p className="font-bold">Contacto Ticket:</p>
						<Contacto nombre={post.nombreContacto || cliente?.nombreCompleto} direccion={post?.direccion || cliente?.direccion} telefono={post?.telefonoContacto || cliente?.telefono} />
					</div>
				)}
				{(admin || ownerTicket || ownerRespuesta) && (
					<Icons 
						handleEdit={() => setShowNew(true)} 
						handleDelete={() => {
							if(!admin) {
								toast.error('Solo administradores pueden anular tickets.');
								return;
							}
							eliminarTicket(post.id);
							setAnulado(true);
						}}
						handleNullify={() => {
							anularTicket(post.id);
							setAnulado(true);
						}}
						handleCheck={()=>{ resolverTicket(post.id); handleFeederRefresh();}}
					/>
				)}
			</div>
			{/*Info Cliente/ClienteServicio*/}
			{'severidad' in post ? <ClienteTicketWidget post={post} /> : <ClienteWidget post={post.cliente} />}

			{showEdit ? (
				<div className="flex flex-col items-center">
					<h1 className="flex font-bold text-center bg-orange-500">EDITAR ACCIÓN</h1>
					<NuevaAccionFlujo
						respuesta={nuevaRespuesta}
						handleEdit={() => setShowConfirmSave(true)}
						handleDelete={() => {
							setShowEdit(false);
							sRespuesta && setRespuesta(sRespuesta);
						}}
					/>

					{showConfirmSave && <Button title="Guardar" titleConfirm="Se agregara al ticket una acción que necesita una respuesta." onClick={confirmSaveNuevaResp} />}
				</div>
			) : (
				<div className="flex flex-col items-center">
					{respuesta.usuarioBaja && <h2>ANULADA</h2>}
					<h2 className="w-full text-xl font-bold text-start">
						Acción {vencido ? 'VENCIDA ' : respuesta.estado}: {respuesta.accion}
					</h2>
					<p className="w-full text-sm text-start">
						ID Respuesta: {respuesta.id}- Por responder: {porResponderId}{respuesta.leido ? '- LEIDO':''}
					</p>
					<div className="flex items-center">
						<div className="flex flex-col items-center w-32 mx-3">
							<Image
								className={`rounded-full w-16 h-16 ${respuesta.id === porResponderId && !respuesta.respuesta ? 'bg-yellow-300' : colorTL}`}
								width={64}
								height={64}
								src={`/images/areas/${respuesta?.area}.png`}
								alt={respuesta?.area || 'usuario-area'}
							/>
							{'leido' in respuesta && respuesta.leido && <CheckCircleIcon className="w-8 ml-16 -mt-5 font-bold self-right text-sky-400" />}
							<h3 className="overflow-hidden font-semibold">{respuesta?.area}</h3>
						</div>
						<div className="flex flex-col items-start mx-3 my-3">
							{!!respuesta.respuesta && <p className="text-2xl font-semibold">Respuesta: {respuesta.respuesta}</p>}
							{/*Responder/Rechazar*/}
							{puedeResponder && porResponderId === respuesta.id && !respuesta.respuesta && (
								<div className="flex flex-col my-2 space-y-2">
									<InputB value={textoRespuesta} handleChange={setTextoRespuesta} placeholder="Respuesta" type="string" />
									<div className='flex space-x-2'>
										<Button	Icon={CheckIcon} title="Responder" onClick={responderRespuesta}
											titleConfirm={`Responder acción con ${textoRespuesta}:\nAl responderla confirmas que la acción fue completada por ti.`}
										/>
										<Button Icon={ArchiveBoxXMarkIcon} title="Rechazar" onClick={rechazarRespuesta} disabled={respuesta.orden === 0} 
											titleConfirm="Esta seguro que desea rechazar esta solicitud?" 
										/>
									</div>
								</div>
							)}
							<p className="ml-1">
								{respuesta.respuesta
									? `Respondida ${dayjs(respuesta.fechaRespuesta).fromNow()}`
									: respuesta.fechaFin
									? (respuesta.fechaFin > new Date()) 
										? `Fuera de vigencia! Vencío ${dayjs(respuesta.fechaFin).format(DateFormat)}`
										: `Vence ${dayjs(respuesta.fechaFin).fromNow()}` 
									: `Vigencia no inicializada: ${respuesta.vigenciaDias} día(s).`}
							</p>
						</div>
					</div>
					{/*Acciones respuesta*/}
					<div className="flex flex-col justify-center my-4 space-y-4">
						{/*Usuario Asignado */}<div className="flex flex-col items-start">
							{!!respuesta.usuarioAsignado && <p className="text-xl text-gray-500">Usuario asignado: {respuesta.usuarioAsignado?.username}</p>}
							{puedeAsignar && <div className='flex'>
								{user?.rol !== Roles.FUNCIONARIO && <ComboBox value={userNameAsignado} setData={setUsernameAsignado} filterKey="username" postName="Usuario" searchEndpoint={`/auth/users/${respuesta?.area}`} />}
								<Button onClick={asignarRespuesta} Icon={UserPlusIcon} disabled={!userNameAsignado}
								title={user?.rol === Roles.FUNCIONARIO ? 'Auto-asignarse' : `${respuesta.usuarioAsignado ? 'Rea':'A'}signar responsable`}/>
							</div>}
						</div>
						{/*Agregar paso: Puede agregar paso si el usuario logueado respondio o es el creador del ticket */}
						{puedeAgregarPaso && <Button Icon={DocumentPlusIcon} onClick={instertarRespuesta} title="Agregar acción al flujo" />}
						{(admin || (ownerRespuesta && post.respuestas[0].id === respuesta.id)) && !respuesta.fechaRespuesta && <Button Icon={CalendarDaysIcon} onClick={iniciarEsperaRespuesta} title="Inicializar vigencia" />}
					</div>
				</div>
			)}
			{!showEdit && (admin || ((ownerTicket || ownerRespuesta) && !respuesta.respuesta)) && (
				<Icons
					handleEdit={() => setShowEdit(true)}
					handleCancelEdit={() => setShowEdit(false)}
					handleNullify={() => {anularRespuesta(sRespuesta.id); handleFeederRefresh();}}
				/>
			)}
			<SeccionComentarios selectedRespuesta={respuesta} />
		</div>
	);
}
