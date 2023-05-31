/** @format */

import Image from 'next/image';
import {
	BellIcon,
	UserGroupIcon,
	SwatchIcon,
	TicketIcon,
	CheckCircleIcon,
} from '@heroicons/react/24/outline';
import SidebarRow from './SidebarRow';
import Avatar from '../Avatar';
import Button from '../Button';
import { useAuthState, useAuthDispatch } from '../../context/auth';
import router from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

function Sidebar() {

	const { user } = useAuthState();
	const dispatch = useAuthDispatch();
	const [verMenu, setVerMenu] = useState(false);
	const [opcionesSesion, setOpcionesSesion] = useState(false);
	
	useEffect(()=>{
		updateUser();
	},[])

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

	const updateUser = async () => {
		if(!user) return;
		try {
			const res = await axios.get('/auth/updateMe');	
			dispatch('UPDATE', res.data);
			return res.data;
		} catch (error) {
			console.error('updatedMe: ' + error);
		} 
	}
	

	return (
		<div className="fixed z-50 flex-col h-full mt-3 -ml-2 xl:mt-0 xl:ml-1" onClick={updateUser}>
			{/*ABE Logo*/}
			<div className="hidden p-0 rotate-90 xl:ml-1 -pr-4 hoverEffect hover:bg-blue-100 xl:rotate-0 md:inline">
				<p className='-mt-3 text-xs font-bold text-start t-0'>Tickets V.{process.env.NEXT_PUBLIC_VERSION}</p>
				<Image width="70" height="50" src="/images/ABE.ico" alt="ABE Logo" onClick={() => router.push('/')} />
			</div>
			{/*Menu */}
			<div className={`sticky pb-0 mt-2 mb-0`}
				onMouseEnter={() => setVerMenu(true)}
				onMouseLeave={()=> setVerMenu(false)}
			>
				<div className="items-start mb-0 inner scrollbar-hide">
					{user && <SidebarRow hideTitle={verMenu} Icon={BellIcon} title="Tickets asignados" redirectTo="/tickets?seccion=asignados" badge={user.respuestasAsignadas?.filter((r) => !r.fechaRespuesta).length || 0} />}
					{user && <SidebarRow hideTitle={verMenu} Icon={TicketIcon} title="Tus tickets" redirectTo="/tickets?seccion=tuyos" badge={user.tickets?.filter((t) => !!t.porResponder).length || 0} />}
					{user && <SidebarRow hideTitle={verMenu} Icon={CheckCircleIcon}	title="Tickets que respondiste" redirectTo="/tickets?seccion=respondidos"
							badge={user.respuestasAsignadas?.filter((r) => r.fechaRespuesta && !!r.ticket?.porResponder).length || 0} />}
					<SidebarRow hideTitle={verMenu} Icon={UserGroupIcon} title="Clientes" redirectTo="/clientes" />
					{/*<SidebarRow hideTitle={verMenu} Icon={WrenchIcon} title='Servicios' redirectTo='/servicios'/>*/}
					<SidebarRow hideTitle={verMenu} Icon={SwatchIcon} title="Todos los tickets" redirectTo="/tickets" />
					{/*<SidebarRow hideTitle={verMenu} Icon={BanknotesIcon} title='Solicitudes' redirectTo='/solicitudes'/>*/}
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
