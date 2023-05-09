/** @format */

import { ArrowDownCircleIcon, CheckCircleIcon, DevicePhoneMobileIcon, ExclamationCircleIcon, SwatchIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ClienteServicio, Roles, getColorSeveridad } from '../../../types/typesSSO';
import Button from '../Button';
import NuevoTicket from '../flujos/NuevoTicketWidget';
import { useAuthState } from '../../context/auth';
import { useState } from 'react';
import ModificarModemsWidget from './ModificarModemsWidget';
import Link from 'next/link';
import ModemsWidget from './ModemsWidget';
import toastCard from '../ToastCard';

interface Props {
	clienteServicio: ClienteServicio;
}

export default function ClienteServicioWidget({ clienteServicio: cliSer }: Props) {
	const { user } = useAuthState();
	const admin = user?.rol === Roles.ADMIN;
	const puedeCambiarModem = admin || user?.area === 'COMERCIAL' || user?.area === 'OPERACIONES'; //TODO getAreas
	const puedeDarBaja = admin || user?.area === 'COMERCIAL'; //TODO getAreas
	const [mostrarModificarModems, setMostrarModificarModems] = useState(false);
	const [clienteServicio, setClienteServicio] = useState(cliSer);

	const porImplementar = async () => {
		toast.error('Por implementar');
	};

	const nuevoTicket = async () => {
		const TicketForm = <div className="flex flex-col">
			<NuevoTicket
				clienteServicio={clienteServicio}
			/>
		</div>;
		toastCard(TicketForm, '', ()=>toast.success('Actualice la lista de clientes para ver el nuevo ticket.'));
	};
	const css = `w-8 h-8 mx-2 rounded-full ${clienteServicio.tickets?.length > 0 ? 'bg-yellow-500' : clienteServicio.activo ? 'bg-green-400' : 'bg-red-400'}`;
	return (
		<div className="border-blue-300 border-y">
			<div className="flex">
				{/*Nombre*/}
				<h1 className="font-bold whitespace-nowrap">{clienteServicio.servicio.nombre}</h1>
				{/*Exist Ticket Icon*/}
				{clienteServicio.tickets?.length > 0 ? <ExclamationCircleIcon className={css} /> : clienteServicio.activo ? <CheckCircleIcon className={css} /> : <XCircleIcon className={css} />}
				{/*TicketsList*/}
				<div className="flex-col">
					<p className="text-sm">{clienteServicio.tickets?.length > 0 && 'Tickets:'}</p>
					<ul className="ml-5">
						{clienteServicio.tickets?.map((tick) => {
							return (
								<li className={`list-disc rounded-md bg-${getColorSeveridad(tick)} mt-1 p-2`}>
					    			<Link href={`/tickets/${tick.id}`} className='m-0 hover:underline'>
									<h4>{`${tick.grupo?.nombre ?? 'GrupoTipo ticket'}: ${tick.descripcion}`}</h4>
									<p className="text-xs">{`${(tick.respuestasCount ?? 'x/y') + ' respondidas'}`}</p>
									</Link>
								</li>
							);
						})}
					</ul>
				</div>
			</div>

			{/*ModemWidget*/}
			<div className="flex flex-col">
				<ModemsWidget modems={clienteServicio.modems}/>
				{mostrarModificarModems && <ModificarModemsWidget clienteServicio={clienteServicio} handleCancelar={() => setMostrarModificarModems(false)} />}
			</div>
			<div className="flex justify-center my-3">
				{puedeCambiarModem && !mostrarModificarModems && <Button Icon={DevicePhoneMobileIcon} onClick={() => setMostrarModificarModems(true)} title="Asignar/Cambiar modem" />}
				{puedeDarBaja && <Button Icon={TrashIcon} title="Dar servicio de baja" onClick={porImplementar} />}
				{user && <Button Icon={SwatchIcon} title="Crear ticket" onClick={nuevoTicket} />}
			</div>
		</div>
	);
}
