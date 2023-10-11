import { ArrowDownCircleIcon, CheckCircleIcon, DevicePhoneMobileIcon, DocumentPlusIcon, ExclamationCircleIcon, SwatchIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { ClienteServicio, users_dep_enum, users_rol_enum } from '../../../types/typesSSO';
import Button from '../ui/Button';
import NuevoTicket from '../flujos/NuevoTicketWidget';
import { useAuthState } from '../../context/auth';
import { useEffect, useState } from 'react';
import ModificarModemsWidget from './ModificarModemsWidget';
import Link from 'next/link';
import ModemsWidget from './ModemsWidget';
import { getColorSeveridad } from '@src/utils/common';
import axios from 'axios';
import Clientes from '@src/app/clientes/page';
import ToastCard from '../ui/ToastCard';

interface Props {
	clienteServicio: ClienteServicio;
}

export default function ClienteServicioWidget({ clienteServicio: cliSer }: Props) {
	const { user } = useAuthState();
	const admin = user?.rol === users_rol_enum.ADMIN;
	const puedeCambiarModem = admin || user?.departamento === users_dep_enum.COMERCIAL || user?.departamento === users_dep_enum.OPERACIONES; //TODO getAreas
	const puedeDarBaja = admin || user?.departamento === users_dep_enum.COMERCIAL; //TODO getAreas
	const [mostrarModificarModems, setMostrarModificarModems] = useState(false);
	const [clienteServicio, setClienteServicio] = useState<ClienteServicio>(cliSer);

	useEffect(()=>{
		setClienteServicio(cliSer);
	},[cliSer])

	const darServicioBaja = async () => {
		const servicioBajaToast = toast.loading('Dando de baja el servicio...');
		try {
			const res = await axios.delete(`/clienteServicios/${clienteServicio.id}`);
			toast.success('Servicio dado de baja.', {id: servicioBajaToast});
		} catch (error) {
			toast.error('No se pudo dar de baja el servicio, contacte al administrador.', {id: servicioBajaToast});
		}
	};

	const nuevoTicket = async () => {
		const TicketForm = <div className="flex flex-col">
			<NuevoTicket
				clienteServicio={clienteServicio}
			/>
		</div>;
		ToastCard(TicketForm, ()=>toast.success('Actualice la lista de clientes para ver el nuevo ticket.'));
	};
	const css = `w-8 h-8 mx-2 rounded-full ${clienteServicio.tickets?.length > 0 ? 'bg-yellow-500' : clienteServicio.activo ? 'bg-green-400' : 'bg-red-400'}`;
	return (
		<div className={`border-blue-300 px-2 border-y ${!!clienteServicio.fechaBaja && 'bg-red-600'}`}>
			<h1 className="font-bold whitespace-nowrap">ID: {clienteServicio.id} - {clienteServicio.nombreServicio}</h1>
			{clienteServicio.fechaBaja ? <p>SERVICIO CON BAJA</p> : <>
			<div className="flex items-center">
				{/*Nombre*/}
				{/*Exist Ticket Icon*/}
				{clienteServicio.tickets?.length > 0 ? <ExclamationCircleIcon className={css} /> : clienteServicio.activo ? <CheckCircleIcon className={css} /> : <XCircleIcon className={css} />}
				<p className="text-md">{clienteServicio.tickets?.length > 0 && 'Tickets:'}</p>
				{/*TicketsList*/}
				<div className="flex-col w-full">
					<ul className="ml-5 overflow-auto max-h-32">
						{clienteServicio.tickets?.sort((a, b) => b.id - a.id).map((tick) => {
							return (
								<li className={`rounded-md bg-${getColorSeveridad(tick)} mt-1 p-2`}>
					    			<Link href={`/tickets/${tick.id}`} className='flex items-center m-0 space-x-2 hover:underline'>
									<h4>{`ID ${tick.id}: ${tick.fechaBaja ? 'ANULADO ': ''}${tick.nombreFlujo ?? 'GrupoTipo ticket'} - ${tick.descripcion}`}</h4>
									{!!tick.respuestasCount && <p className="hidden text-xs md:inline">{`${(tick.respuestasCount ?? 'x/y') + ' respondidas'}`}</p>}
									{!!tick.areaPorResponder && <p className="hidden text-xs md:inline">{tick.areaPorResponder}</p>}
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
			{/*Eventos de activacion/suspension/baja*/}
			{clienteServicio.eventos?.length > 0 && <div>
				<h3>Eventos de servicio:</h3>
				{clienteServicio.eventos.map(ev => <p>{ev.evento}</p>)}
			</div>}
			<div className="flex justify-center my-3">
				{puedeCambiarModem && !mostrarModificarModems && <Button Icon={DevicePhoneMobileIcon} onClick={() => setMostrarModificarModems(true)} title="Asignar/Cambiar modem" />}
				{puedeDarBaja && <Button Icon={TrashIcon} title="Dar servicio de baja" onClick={darServicioBaja} />}
				{user && <Button Icon={SwatchIcon} title="Crear ticket" onClick={nuevoTicket} />}
			</div>
			</>}
		</div>
	);
}
