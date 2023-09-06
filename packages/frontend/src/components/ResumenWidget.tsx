import React, { useEffect, useState } from 'react';
import { useAuthDispatch, useAuthState } from '../context/auth';
import { ClienteServicioTicket, ClienteServicioTicketAccion } from '../../types/typesSSO';
import { ArrowPathIcon, CheckCircleIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import Link from 'next/link';
import axios from 'axios';

dayjs.locale(es);
dayjs.extend(relativeTime);

function ResumenWidget() {
	const { user } = useAuthState();
	const [tusTickets, setTusTickets] = useState<ClienteServicioTicket[]>([]);
	const [respAsignadas, setRespAsignadas] = useState<ClienteServicioTicketAccion[]>([]);
	const [showMoreT, setShowMoreT] = useState(false);
	const [showMoreR, setShowMoreR] = useState(false);
	const dispatch = useAuthDispatch();

	useEffect(() => {
		actualizarResumen();
	}, []);

	const actualizarResumen = async () => {
		if(!user) return;
		const res = await axios.get('/auth/me');	
		dispatch('UPDATE', res.data);
		const updatedUser = res.data.user;
		if(!updatedUser) return;
		setRespAsignadas(updatedUser.respuestasAsignadas || []);
		setTusTickets(updatedUser.tickets || []);
	}

	const resumenAsignadas = (
	<div className="m-2 border-2 border-blue-300 rounded-lg">
		<div className="flex justify-between h-12" onClick={() => setShowMoreR(!showMoreR)}>
			<div className="flex items-center ml-2 space-x-2">
				<h3 className="text-md whitespace-nowrap">Acciones de tickets pendientes</h3>
				<h3 className="w-6 h-6 text-lg font-bold text-center text-white bg-red-400 rounded-lg">{respAsignadas.filter(r=>!r.fechaRespuesta).length}</h3>
			</div>
			{showMoreR ? <ChevronUpIcon /> : <ChevronDownIcon />}
		</div>
		{showMoreR && (
			<ol className="w-full bg-gray-200">
				{respAsignadas.filter(r=>!r.fechaRespuesta).map((r) => (
					<li key={r.id} className="pl-3 border-2 border-blue-400 rounded-lg cursor-pointer">
						<Link href={`/tickets/${r.idTicket}`} className='uppercase'>
						<p className="font-bold hover:underline">{`Ticket: ${r.idTicket} - ${r.clienteServicioTicket?.descripcion}`}</p>
						<h4>Resp asignadas no respondidas: {r.accion} - {dayjs(r.fechaFin).fromNow()}</h4>
						<div className="flex items-center justify-end my-1">
							<p className='text-lg font-bold'> {r.leido ? 'LEÍDO': 'NO LEÍDO'}</p>
							{r.leido && <CheckCircleIcon className="w-8 font-bold text-sky-400" />}
						</div>
						</Link>
					</li>
				))}
			</ol>
		)}
	</div>);

const resumenTusTickets = (
	<div className="m-2 border-2 border-blue-300 rounded-lg">
		<div className="flex justify-between h-12" onClick={() => setShowMoreT(!showMoreT)}>
			<div className="flex items-center ml-2 space-x-2">
				<h3 className="text-md">Tickets que creaste en proceso</h3>
				<h3 className="w-6 h-6 text-lg font-bold text-center text-white bg-red-400 rounded-lg">{tusTickets.filter(t => !!t.porResponder).length}</h3>
			</div>
			{showMoreT ? <ChevronUpIcon /> : <ChevronDownIcon />}
		</div>
		{showMoreT && (
			<ol className="w-full p-2 bg-gray-200">
				{tusTickets.filter(t=>!!t.porResponder).map((t) => (
					<li className="pl-2 mt-2 border-2 border-blue-400 rounded-lg cursor-pointer">
						<Link href={`/tickets/${t.id}`} className='uppercase'>
						<p className="hover:underline"><b>{`Ticket: ${t.id}/${t.nombreFlujo}:`}</b> {t.descripcion}</p>
						</Link>
						{!!t.nombreContacto && <p>Cliente: {t.nombreContacto}</p>}
						<h4>Progreso acciones {t.respuestasCount}</h4>
					</li>
				))}
			</ol>
		)}
	</div>);


	return (
		<div className="flex flex-col bg-gray-100 rounded-lg">
			<div className="flex items-center justify-between mx-1">
				<h2 className="m-3 text-xl font-bold">Resumen:</h2>
				<ArrowPathIcon className='w-8 h-8' onClick={actualizarResumen}/>
			</div>
			{resumenAsignadas}
			{resumenTusTickets}
		</div>
	);
}

export const MemoResumen = React.memo(ResumenWidget);
