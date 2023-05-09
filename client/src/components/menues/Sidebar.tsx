/** @format */

import Image from 'next/image';
import {
	BellIcon,
	WrenchIcon,
	UserGroupIcon,
	SwatchIcon,
	ScaleIcon,
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
	BanknotesIcon,
	ExclamationTriangleIcon,
	TicketIcon,
	CheckCircleIcon,
} from '@heroicons/react/24/outline';
import SidebarRow from './SidebarRow';
import Avatar from '../Avatar';
import Button from '../Button';
import { useAuthState, useAuthDispatch } from '../../context/auth';
import router from 'next/router';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

function Sidebar() {

	const { user } = useAuthState();
	const dispatch = useAuthDispatch();
	const [verMenu, setVerMenu] = useState(false);
	const [opcionesSesion, setOpcionesSesion] = useState(false);

	const cerrarSesion = async () => {
		try {
			await axios.get('/auth/logout');
			dispatch('LOGOUT');
			router.push('/auth/login');
			toast.success('Cerraste sesión.');
		} catch (err: any) {
			console.error(err);
			toast.error('Algo fallo al cerrar sesión ' + err);
		}
	};

	return (
		<div className="fixed z-50 flex-col h-full mt-3 -ml-2 xl:mt-0 xl:ml-1">
			{/*ABE Logo*/}
			<div className="hidden p-0 rotate-90 xl:ml-1 -pr-4 hoverEffect hover:bg-blue-100 xl:rotate-0 md:inline">
				<Image width="70" height="50" src="/images/ABE.ico" alt="ABE Logo" onClick={() => router.push('/')} />
			</div>
			{/*Menu */}
			<div className={`sticky pb-0 mt-2 mb-0`}
				onMouseEnter={() => setVerMenu(true)}
				onMouseLeave={()=> setVerMenu(false)}
			>
				<div className="items-start mb-0 inner scrollbar-hide">
					{user && <SidebarRow hideTitle={verMenu} Icon={BellIcon} title="Tickets asignados" redirectTo="/tickets?seccion=asignados" badge={user.respuestasAsignadas.filter((r) => !r.fechaRespuesta).length} />}
					{/*user && <SidebarRow hideTitle={verMenu} Icon={ExclamationTriangleIcon} title='Tickets asignables' redirectTo='/tickets' badge={2}/>*/}
					{user && <SidebarRow hideTitle={verMenu} Icon={TicketIcon} title="Tus tickets en proceso" redirectTo="/tickets?seccion=tuyos" badge={user.tickets.filter((t) => !!t.porResponder).length} />}
					{user && <SidebarRow hideTitle={verMenu} Icon={CheckCircleIcon}	title="Tickets respondidos en proceso" redirectTo="/tickets?seccion=respondidos"
							badge={user.respuestasAsignadas.filter((r) => r.fechaRespuesta && !!r.ticket?.porResponder).length} />}
					<SidebarRow hideTitle={verMenu} Icon={UserGroupIcon} title="Clientes" redirectTo="/clientes" />
					{/*<SidebarRow hideTitle={verMenu} Icon={WrenchIcon} title='Servicios' redirectTo='/servicios'/>*/}
					<SidebarRow hideTitle={verMenu} Icon={SwatchIcon} title="Todos los tickets" redirectTo="/tickets" />
					{/*<SidebarRow hideTitle={verMenu} Icon={BanknotesIcon} title='Solicitudes' redirectTo='/solicitudes'/>*/}
				</div>
				<div className="items-start mb-0 inner scrollbar-hide">
					{/*Facturación 
                    <SidebarRow hideTitle={verMenu} Icon={BeakerIcon} title='Facturacion Manual' onClick={'/facturas'}/>}
                    <SidebarRow hideTitle={verMenu} Icon={ScaleIcon} title='Reporte Facturación' redirectTo='/facturas'}/>
                    {/*Inventarios}
                    <SidebarRow hideTitle={verMenu} Icon={BuildingStorefrontIcon} title='Modems' onClick={'/articulos'}/>
                    <SidebarRow hideTitle={verMenu} Icon={ArchiveBoxIcon} title='Equipos' onClick={'/activos'}/>
                    {/*Menues Usuario
                    <SidebarRow hideTitle={verMenu} Icon={EnvelopeIcon} title='Notificaciones' onClick={'/notificaciones'}/>*/}
				</div>
			</div>
			{/*Informacion de usuario */}
			<div className="fixed z-50 flex bottom-5">
				{user && (
					<div className="bg-gray-300 rounded-full" onClick={() => setOpcionesSesion(!opcionesSesion)}>
						<Avatar usuario={user} />
					</div>
				)}
				{(opcionesSesion || !user) && (
					<Button
						onClick={
							user
								? cerrarSesion
								: () => {
										router.push('/auth/login');
								  }
						}
						title={user ? 'Cerrar Sesión' : 'Iniciar Sesión'}
					/>
				)}
			</div>
		</div>
	);
}
export default Sidebar;
