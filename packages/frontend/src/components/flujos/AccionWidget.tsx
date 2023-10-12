'use client';
import { ClienteServicioTicket, Cliente, users_rol_enum, ClienteServicioTicketAccion, 
	accion_estado_enum, FlujoTicketAcciones } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from '../ui/Button';
import { CalendarDaysIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuthState } from '../../context/auth';
import NuevaAccionFlujo, { NuevaAccion } from './NuevaAccionFlujo';
import FlujoCreador from './FlujoCreador';
import Image from 'next/image';
import Icons from '../ui/Icons';
import ClienteTicketWidget from '../cliente/ClienteTicketWidget';
import Contacto from '../cliente/Contacto';
import SeccionComentarios from './Comentarios';
import Link from 'next/link';
import { DateMonth, DayMonth, getColorSeveridad } from '../../utils/common';
import NuevoTicket from './NuevoTicketWidget';
import { getTicketAccion, iniciarEspera, insertarAccionDespuesDeAccion, 
	marcarComoLeido, modificarAccion, sugerirAccion } from '@src/app/api/tickets/acciones';
import AccionesEspeciales from '../tickets/AccionesEspeciales';
import { anularRespuesta, anularTicket, eliminarTicket, resolverTicket } from '@src/app/tickets/page';
import { useEffect, useState } from 'react';
import UsuarioAsignado from '../tickets/UsuarioAsignado';

dayjs.locale(es);
dayjs.extend(relativeTime);

type Accion = ClienteServicioTicketAccion | null;

interface Props {
   accion: Accion;
   ticket: ClienteServicioTicket;
   cliente: Cliente;
   setShowEdit: any;
   showEdit: boolean;
   handleFeederRefresh: () => void;
}

export default function AccionWidget({ accion: sAccion, ticket, cliente, setShowEdit, showEdit, handleFeederRefresh }: Props) {
   const { user } = useAuthState();
   const [anulado, setAnulado] = useState(false);
   const [accion, setAccion] = useState<Accion>(sAccion);
   const [idPorResponder, setPorResponderId] = useState(ticket.porResponder?.id);
   const [showNew, setShowNew] = useState(false);
   const [editTicket, setEditTicket] = useState(false);
   const [sugerenciaSigteAccion, setSugerencia] = useState<FlujoTicketAcciones | null>(null);

   const admin = user?.rol === users_rol_enum.ADMIN;
   const ownerTicket = user?.username === ticket?.usuarioCreacion;
   const ownerAccion = user?.username === sAccion?.usuarioCreacion;
   const idx = sAccion ? ticket.acciones.findIndex((r) => r.id === sAccion.id) : -1;
   const ownerAntAccion = ticket.acciones[idx-1]?.usuarioAsignado === user?.username; 
   const puedeInicializar = !ticket.fechaBaja && (admin || (ownerAccion && ticket.acciones[0].id === accion?.id)) && !accion?.fechaRespuesta && !accion?.fechaFin;
   const vencido = sAccion?.fechaFin && dayjs(sAccion.fechaFin).isBefore(new Date());
   
   useEffect(() => {
	   sAccion && recargarAccion(sAccion.id);
	   setShowEdit(false);
	   if(!!accion && !accion.leido && user?.username === accion?.usuarioAsignado)
		   marcarComoLeido(accion.id);
   }, [sAccion]);

   useEffect(() => {
	   setPorResponderId(ticket.porResponder?.id);
	   setAccion(ticket.acciones.find((a) => a.id === sAccion?.id) || ticket.porResponder);
   }, [ticket]);

   if (!ticket) return <p>'Seleccione un ticket'</p>;

   const recargarAccion = async (idAccion: number) => {
	   const uAccion = await getTicketAccion(idAccion);
	   if(!!uAccion) setAccion(uAccion);
   };

   const iniciarEsperaRespuesta = async (idAccion: number) => {
	   if(!await iniciarEspera(idAccion)) return;
	   handleFeederRefresh();
	   recargarAccion(idAccion);
   };

   const getSugerenciaSigteAccion = async () => {
	   console.log('buscara sugerencia para ' + ticket?.nombreFlujo + accion?.orden);
	   if(!ticket.nombreFlujo) {toast.error('No se pudo identificar el flujo'); return;}
	   const acSugerencia = await sugerirAccion(ticket.nombreFlujo, accion?.orden || 0);
	   console.log('Sugerencia: ' + JSON.stringify(acSugerencia));
	   setSugerencia(acSugerencia);
   };

   const colorTL = !accion ? '' : accion.estado === accion_estado_enum.ACEPTADO ? 'bg-green-400' : accion.estado === accion_estado_enum.RECHAZADO ? 'bg-red-400' : 'bg-gray-400';
   if(editTicket) return <NuevoTicket ticket={ticket} clienteServicio={ticket.clienteServicio} handleRefresh={handleFeederRefresh} setShowNew={()=> setEditTicket(false)}/>

return (<div className={`flex flex-col px-2 py-2 space-y-2 ${(!!ticket.fechaBaja || anulado) ? 'bg-red-700' : 'bg-gray-100'} rounded-md`}>
	<ClienteTicketWidget clienteServicio={ticket.clienteServicio} cliente={cliente}/>
	{/*Info Ticket*/}
	{ticket.resuelto && <h2 className='p-2 text-lg font-bold text-center bg-green-500 rounded-md cursor-pointer hover:text-white' 
          onClick={() => { resolverTicket(ticket.id).then(() =>{ handleFeederRefresh(); if(accion) recargarAccion(accion.id);})}}>
          {!ticket.tipo ? 'CLASIFICAR TICKET': 'RE-CLASIFICAR TICKET: ' + ticket.tipo}
    </h2>}
	<div className='flex flex-col p-2 bg-gray-300 rounded-xl'>
		<div className="flex justify-between">
			<div className="flex flex-col">
				<Link className={`text-xl font-bold px-2 rounded-md hover:underline bg-${getColorSeveridad(ticket)}`}
					href={`/tickets/${ticket.id}`}>
					{(ticket.fechaBaja || ticket.acciones.length === 0) ? 'ANULADO ' : ''}Ticket: {ticket.id} - SEVERIDAD: {ticket.severidad}
				</Link>
				<span className="font-bold">
					Grupo: {ticket.nombreFlujo}
				</span>
				<p className="mt-2 text-xl">Descripcion: {ticket.descripcion}</p>
				<p className="mt-2 text-sm text-gray-500">Origen: {ticket.origen}</p>
			</div>
			<FlujoCreador post={ticket} className="my-3" />
		</div>
		<div className="px-2 mt-2">
			<Contacto nombre={ticket.nombreContacto || cliente?.contactos[0]?.nombreCompleto} direccion={`${ticket?.direccion}; Coord:${ticket?.coordenadas}` || cliente?.contactos[0]?.direccion} telefono={ticket?.telefonoContacto || cliente?.contactos[0]?.telefono} />
		</div>
		{/*Modems en el ticket*/}
		<div className=''>
			{'modems' in ticket && ticket.modems.length > 0
			? <div>
				<p className='font-bold'>Modems afectados:</p>
				<ol className='ml-6 list-disc'>{ticket.modems.map(m => 
					<li>{m.macModem}</li>
				)}</ol>
			</div>
			: <p className='mt-3 ml-6 font-semibold'>No se marco un modem como afectado, asumimos que todos los modems del servicio estan afectados</p>}
		</div>
		{(admin || ownerTicket || ownerAccion) && !ticket.fechaBaja && !ticket.resuelto && (
		<Icons name='Ticket'
			handleEdit={() => setEditTicket(true)} 
			handleDelete={() => {
				if(!admin) {
					toast.error('Solo administradores pueden anular tickets.');
					return;
				}
				eliminarTicket(ticket.id);
				setAnulado(true);
			}}
			handleNullify={() => {
				anularTicket(ticket.id);
				setAnulado(true);
			}}
			handleCheck={()=>{ resolverTicket(ticket.id); setAccion(null); handleFeederRefresh();}}
		/>
		)}
	</div>
	{/*Info Accion: ID, porResponder, Vigencia; Inicializar*/}
	{ticket.acciones.length > 0 && !!accion && <div className="flex flex-col px-2 bg-gray-300 border-2 border-gray-200 rounded-md">
	{/*header Accion*/}
	<div className={`flex items-start space-x-12 ${showEdit && 'flex-col'}`}>
			<div className='flex flex-col'>
			{accion.usuarioBaja && <h2>ANULADA</h2>}
			<h1 className="w-full text-xl font-bold rounded-md hover:underline">Acción: {accion.orden} {accion.leido ? '- LEIDA':''}</h1>
			<p className="w-full font-semibold rounded-md text-md">ID: {`${accion.id}${idPorResponder ? `- ID por responder: ${idPorResponder}`:''}`}</p>
			<h2 className="w-full mt-2 text-xl uppercase text-start">
				{vencido ? 'VENCIDA ' : accion.estado}: <span className='font-bold'>{accion.accion}</span>
			</h2>
			{accion.vigenciaDias > 0 && <div className="flex items-center">
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
			</div>}
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
			edit={true}
		/>
		: <div className="flex flex-col items-center w-32 mx-3">
			<Image
				className={`rounded-full w-16 h-16 my-3 ${accion.id === idPorResponder && !accion.respuesta ? 'bg-yellow-300' : colorTL}`}
				width={64}
				height={64}
				src={`/images/areas/${accion?.area}.png`}
				alt={accion?.area || 'usuario-area'}
			/>
			{'leido' in accion && accion.leido && <CheckCircleIcon className="w-8 ml-16 -mt-5 font-bold self-right text-sky-400" />}
			<h3 className="overflow-hidden font-semibold">{accion?.area}</h3>
		</div>}
	</div>
	{/*Responder/Respuesta Accion + Especiales*/}
	<div className="my-3 space-y-3">
	  {!!accion.respuesta && <p className="text-xl font-semibold bg-green-400">Respuesta: <span className='font-bold'>{accion.respuesta}</span></p>}
	  <AccionesEspeciales ticket={ticket} accion={accion} handleFeederRefresh={() => {handleFeederRefresh(); setAccion(null);}} 
	  setShowNew={() => getSugerenciaSigteAccion().then(() => setShowNew(true))}/>
	</div>
	
	<UsuarioAsignado accion={accion} handleFeederRefresh={handleFeederRefresh}/>
	
	{/*Insertar accion despues de accion*/}
	{showNew && <NuevaAccionFlujo
	  accion={sugerenciaSigteAccion}
	  handleSave={(partialNewAction: NuevaAccion) => {
	  	insertarAccionDespuesDeAccion(accion, partialNewAction)
			.then((res) => {
				if(!res) return;
				setShowNew(false);
				setAccion(null);
				handleFeederRefresh();
			});
	  }}
	  handleCancel={() => {
		setShowNew(false);
	  }}	
      edit={true}
	/>}

	{!showEdit && (admin || ((ownerTicket || ownerAccion || ownerAntAccion) && !accion.respuesta)) 
	&& !ticket.fechaBaja && !accion.fechaBaja && !showNew && !ticket.resuelto && (
	<Icons
		handleEdit={() => setShowEdit(true)}
		handleCancelEdit={() => setShowEdit(false)}
		handleNullify={() => {anularRespuesta(accion.id); setAccion(null); handleFeederRefresh();}}
		handleCustomAction={() => getSugerenciaSigteAccion().then(() => setShowNew(true))}
		customAction='Insertar'
		name='Acción'
	/>)}
	{!showEdit && <SeccionComentarios selectedRespuesta={accion} />}
	</div>}
</div>);}
