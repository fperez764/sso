import { ClienteSolicitud, ClienteServicioTicket, Cliente, users_rol_enum, ClienteServicioTicketAccion, 
	ClienteSolicitudAccion, accion_estado_enum, users_area_enum } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from '../ui/Button';
import { ArchiveBoxXMarkIcon, CalendarDaysIcon, CheckCircleIcon, CheckIcon, DocumentPlusIcon, DocumentTextIcon, PlusCircleIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuthState } from '../../context/auth';
import { useEffect, useState } from 'react';
import InputB from '../ui/InputB';
import ComboBox from '../ui/ComboBox';
import NuevaAccionFlujo, { NuevaAccion } from './NuevaAccionFlujo';
import FlujoCreador from './FlujoCreador';
import Image from 'next/image';
import ClienteWidget from '../cliente/ClienteWidget';
import Icons from '../ui/Icons';
import ClienteTicketWidget from '../cliente/ClienteTicketWidget';
import Contacto from '../cliente/Contacto';
import { anularRespuesta, anularTicket, eliminarTicket, resolverTicket } from '../../pages/tickets';
import SeccionComentarios from './Comentarios';
import Link from 'next/link';
import { DateMonth, DayMonth, getColorSeveridad } from '../../utils/common';
import NuevoTicket from './NuevoTicketWidget';
import { asignar, getTicketAccion, iniciarEspera, insertarAccionDespuesDeAccion, marcarComoLeido, modificarAccion, rechazarAccion, responderAccion } from '@src/pages/api/tickets/acciones';
import AccionesEspeciales from '../reportes/accionesEspeciales';

dayjs.locale(es);
dayjs.extend(relativeTime);

type Accion = ClienteServicioTicketAccion | null;

interface Props {
	accion: Accion;
	post: ClienteServicioTicket;
	cliente: Cliente;
	setShowEdit: any;
	showEdit: boolean;
	handleFeederRefresh: () => void;
}

export default function AccionWidget({ accion: sAccion, post, cliente, setShowEdit, showEdit, handleFeederRefresh }: Props) {
	const { user } = useAuthState();
	const [anulado, setAnulado] = useState(false);
	const [textoRespuesta, setTextoRespuesta] = useState('Hecho');
	const [userNameAsignado, setUsernameAsignado] = useState<string>(user?.username || '');
	const [accion, setAccion] = useState<Accion>(sAccion);
	const [porResponderId, setPorResponderId] = useState(post.porResponder?.id || post.acciones[0]?.id);
	const [showNew, setShowNew] = useState(false);
	const [editTicket, setEditTicket] = useState(false);

	const admin = user?.rol === users_rol_enum.ADMIN;
	const ownerTicket = user?.username === post?.usuarioCreacion;
	const ownerAccion = user?.username === sAccion?.usuarioCreacion;
	const idx = sAccion ? post.acciones.findIndex((r) => r.id === sAccion.id) : -1;
	const ownerAntAccion = post.acciones[idx-1]?.usuarioAsignado === user?.username; 
	const nextAccNoAcepatada = idx >= 0 && post.acciones[idx + 1]?.estado !== accion_estado_enum.ACEPTADO;
	const userAsignado = user?.username === accion?.usuarioAsignado;
	const puedeAgregarPaso = !post.fechaBaja && (nextAccNoAcepatada && user && (admin || (userAsignado || ownerTicket)));
	const puedeInicializar = !post.fechaBaja && (admin || (ownerAccion && post.acciones[0].id === accion?.id)) && !accion?.fechaRespuesta && !accion?.fechaFin;
	const puedeAsignar = !post.fechaBaja && !accion?.fechaRespuesta && (admin || user?.rol !== users_rol_enum.FUNCIONARIO || accion?.area === user?.departamento);
	const vencido = sAccion?.fechaFin && dayjs(sAccion.fechaFin).isBefore(new Date());
	const puedeResponder = !post.fechaBaja && (admin || user?.departamento === accion?.area || user?.area === accion?.area);
	
	useEffect(() => {
		sAccion && setAccion(sAccion);
		setTextoRespuesta('Hecho');
		setUsernameAsignado(user?.username || '');
		setShowEdit(false);
		if(!!accion && !accion.leido && user?.username === accion?.usuarioAsignado)
			marcarComoLeido(accion.id);
	}, [sAccion]);

	useEffect(() => {
		setPorResponderId(post.porResponder?.id || post.acciones[0]?.id);
		setAccion(post.acciones.find((a) => a.id === sAccion?.id) || post.porResponder);
	}, [post]);

	if (!post) return <p>'Seleccione un ticket'</p>;

	const recargarAccion = async (idAccion: number) => {
		const uAccion = await getTicketAccion(idAccion);
		if(!!uAccion) setAccion(uAccion);
	};

	const responder = async (idAccion: number) => {
		const rAccion = await responderAccion(idAccion, textoRespuesta);
		setAccion(rAccion);
		setPorResponderId(post.porResponder.id + 1); //post.respuestas[post.respuestas.indexOf(porResponder)+1].id
		handleFeederRefresh();		
	};

	const rechazar = async (idAccion: number) => {
		const rAccion = await rechazarAccion(idAccion, textoRespuesta);
		if(!rAccion) {setTextoRespuesta(''); return;}
		setAccion(rAccion);
		setPorResponderId(post.porResponder.id - 1);
		handleFeederRefresh();
		setTextoRespuesta('');
	};

	const iniciarEsperaRespuesta = async (idAccion: number) => {
		if(!await iniciarEspera(idAccion)) return;
		handleFeederRefresh();
		recargarAccion(idAccion);
	};

	const asignarRespuesta = async (idAccion: number) => {
		if (!user) {
			toast.error('Inicia sesión');
			return;
		}
		if (!userNameAsignado) setUsernameAsignado(user.username);
		const asignado = asignar(idAccion, userNameAsignado);
		if(!asignado) return;
		handleFeederRefresh();
		recargarAccion(idAccion);
		handleFeederRefresh();
	};

	const colorTL = !accion ? '' : accion.estado === accion_estado_enum.ACEPTADO ? 'bg-green-400' : accion.estado === accion_estado_enum.RECHAZADO ? 'bg-red-400' : 'bg-gray-400';
	if(editTicket) return <NuevoTicket ticket={post} clienteServicio={post.clienteServicio} handleRefresh={handleFeederRefresh} setShowNew={()=> setEditTicket(false)}/>
	return (
		<div className={`flex flex-col px-2 py-2 space-y-2 ${post.usuarioBaja || anulado ? 'bg-red-700' : 'bg-gray-100'}rounded-md`}>
			{/*Info Ticket*/}
			<div className='flex flex-col p-2 rounded-xl bg-gray-300'>
				<div className="flex justify-between">
					<div className="flex flex-col">
						<Link className={`text-xl font-bold px-2 rounded-md hover:underline bg-${'severidad' in post ? getColorSeveridad(post) : 'gray-300'}`}
							href={`/tickets/${post.id}`}>
							{(post.fechaBaja || post.acciones.length === 0) ? 'ANULADO ' : ''}Ticket: {post.id} {'severidad' in post ? ` - SEVERIDAD: ${post.severidad}` : ''}
						</Link>
						<span className="font-bold">
							Grupo: {post.nombreFlujo}
						</span>
						<p className="mt-2 text-xl">Descripcion: {post.descripcion}</p>
						<p className="mt-2 text-sm text-gray-500">Origen: {post.origen}</p>
					</div>
					<FlujoCreador post={post} className="my-3" />
				</div>
				{/*Contacto Ticket*/}
			<>
				{'severidad' in post &&
					<div className="mt-2 px-2">
						<Contacto nombre={post.nombreContacto || cliente?.contactos[0]?.nombreCompleto} direccion={`${post?.direccion}; Coord:${post?.coordenadas}` || cliente?.contactos[0]?.direccion} telefono={post?.telefonoContacto || cliente?.contactos[0]?.telefono} />
					</div>
				}
				{/*Modems en el ticket*/}
				<div className=''>{'clienteServicioTicketModems' in post && post.clienteServicioTicketModems.length > 0
					? <div>
						<p className='font-bold'>Modems afectados:</p>
						<ol className='ml-6 list-disc'>{post.clienteServicioTicketModems.map(m => 
							<li>{m.macClienteServicioModem}</li>
						)}</ol>
					</div>
					: <p className='mt-3 ml-6 font-semibold'>No se marco un modem como afectado, asumimos que todos los modems del servicio estan afectados</p>}
				</div>

				{(admin || ownerTicket || ownerAccion) && !post.fechaBaja && (
					<Icons 
						handleEdit={() => setEditTicket(true)} 
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
			</>
			</div>
			{/*Info Cliente/ClienteServicio*/}
			{<ClienteTicketWidget clienteServicio={post.clienteServicio} cliente={cliente}/>}
			{post.acciones.length > 0 && !!accion && <div className="flex flex-col px-2 bg-gray-300 border-2 border-gray-200 rounded-md">
				{/*header*/}
				<div className={`flex items-start ${showEdit && 'flex-col'}`}>
					<div className='flex flex-col'>
					{accion.usuarioBaja && <h2>ANULADA</h2>}
					<h1 className="w-full text-xl font-bold rounded-md hover:underline">Acción: {accion.orden} {accion.leido ? '- LEIDA':''}</h1>
					<p className="w-full font-semibold rounded-md text-md">ID: {accion.id} - ID por responder: {porResponderId}</p>
					<h2 className="w-full mt-2 text-xl uppercase text-start">
						{vencido ? 'VENCIDA ' : accion.estado}: <span className='font-bold'>{accion.accion}</span>
					</h2>
					<div className="flex items-center">
						<p className="text-start">
							{accion.respuesta
								? `Respondida ${dayjs(accion.fechaRespuesta).fromNow()}`
								: accion.fechaFin
								? (accion.fechaFin > new Date()) 
									? `Fuera de vigencia! Vencío ${dayjs(accion.fechaFin).format(DateMonth)}`
									: `Vence ${dayjs(accion.fechaFin).fromNow()}, Inició ${dayjs(accion.fechaInicio).format(DayMonth)} y acaba ${dayjs(accion.fechaFin).format(DayMonth)}` 
								: `Vigencia no inicializada: ${accion.vigenciaDias} día(s).`}
						</p>
						{puedeInicializar &&
						<Button Icon={CalendarDaysIcon}  onClick={() => iniciarEsperaRespuesta(accion.id)} title="Inicializar" />
						}
					</div>
				</div>
				{showEdit 
				? <NuevaAccionFlujo
					accion={accion}
					handleSave={(partialAction: NuevaAccion) => {
						modificarAccion(accion, partialAction).then(()=>{
							handleFeederRefresh();
							setShowEdit(false);
						})
					}}
					handleCancel={() => {
						setShowEdit(false);
						sAccion && setAccion(sAccion);
					}}
				/>
				: <div className="flex flex-col items-center w-32 mx-3">
					<Image
						className={`rounded-full w-16 h-16 my-3 ${accion.id === porResponderId && !accion.respuesta ? 'bg-yellow-300' : colorTL}`}
						width={64}
						height={64}
						src={`/images/areas/${accion?.area}.png`}
						alt={accion?.area || 'usuario-area'}
					/>
					{'leido' in accion && accion.leido && <CheckCircleIcon className="w-8 ml-16 -mt-5 font-bold self-right text-sky-400" />}
					<h3 className="overflow-hidden font-semibold">{accion?.area}</h3>
				</div>}
			</div>
			{/*Responder Accion*/}
			<div className="my-3">
				{!!accion.respuesta && <p className="text-xl font-semibold bg-green-400">Respuesta: <span className='font-bold'>{accion.respuesta}</span></p>}
				{/*Responder/Rechazar*/}
				{(puedeResponder && porResponderId === accion.id && !accion.respuesta) ?
					<div className="flex flex-col">
						<InputB value={textoRespuesta} handleChange={setTextoRespuesta} placeholder="Responder (Completar acción)" type="string" />
						<div className='flex space-x-2'>
							<Button	Icon={CheckIcon} title="Responder" onClick={()=>responder(accion.id)}
								titleConfirm={`Responder acción con ${textoRespuesta}:\nAl responderla confirmas que la acción fue completada por ti.`}
							/>
							<Button Icon={ArchiveBoxXMarkIcon} title="Rechazar" onClick={()=>rechazar(accion.id)} disabled={accion.orden === 0} 
								titleConfirm="Esta seguro que desea rechazar esta solicitud?" 
							/>
						</div>
					</div>
					: <p className="text-lg font-semibold">Respuesta pendiente (ID :{post.porResponder?.id}): <span className='font-bold'>{`${(post.porResponder?.usuarioAsignado || 'Por asignar')} de ${post.porResponder?.area} debe responder`}</span></p>
				}
				{!!accion.respuesta && <AccionesEspeciales ticket={post} areaSeleccionada={accion.area}/>}
			</div>
			{/*Acciones acción*/}
			{/*Usuario Asignado */}<div className="flex flex-col items-start w-full my-3">
				{!!accion.usuarioAsignado && <p className="text-xl font-semibold text-gray-500">Usuario asignado: <span className='font-bold'>{accion.usuarioAsignado}</span></p>}
				{puedeAsignar && <div className='flex'>
					{user?.rol !== users_rol_enum.FUNCIONARIO && <ComboBox className='w-1/2' value={userNameAsignado} setData={setUsernameAsignado} filterKey="username" postName={`${accion.area}`} searchEndpoint={`/users/${accion?.area}`} />}
					<Button onClick={()=>asignarRespuesta(accion.id)} Icon={UserPlusIcon} disabled={!userNameAsignado}
					title={user?.rol === users_rol_enum.FUNCIONARIO ? 'Auto-asignarse' : `${accion.usuarioAsignado ? 'Rea':'A'}signar responsable`}/>
				</div>}
			</div>
			{showNew && <NuevaAccionFlujo
						handleSave={(partialNewAction: NuevaAccion) => {
							insertarAccionDespuesDeAccion(accion, partialNewAction)
								.then((res) => {
									if(!res) return;
									setShowNew(false);
									handleFeederRefresh();
								});
							}}
							handleCancel={() => {
								setShowNew(false);
							}}	
				/>
			}
			{!showEdit && (admin || ((ownerTicket || ownerAccion || ownerAntAccion) && !accion.respuesta)) 
			&& !post.fechaBaja && !accion.fechaBaja && (
			<Icons
				handleEdit={() => setShowEdit(true)}
				handleCancelEdit={() => setShowEdit(false)}
				handleNullify={() => {anularRespuesta(accion.id); handleFeederRefresh();}}
				handleCustomAction={() => setShowNew(true)}
				customAction='Insertar'
				name='Acción'
			/>)}
			{!showEdit && <SeccionComentarios selectedRespuesta={accion} />}
		</div>}
	</div>);
}
