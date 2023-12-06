"use client";
import Image from 'next/image';
import { BellIcon, UserGroupIcon, SwatchIcon, TicketIcon, CheckCircleIcon, BanknotesIcon, WrenchIcon, BuildingLibraryIcon, CogIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline';
import SidebarRow from './SidebarRow';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { useAuthState, useAuthDispatch } from '../../context/auth';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { users_rol_enum } from '../../../types/typesSSO';

function Sidebar() {
	const { user } = useAuthState();
	const router = useRouter();
	const director = user?.rol === users_rol_enum.ADMIN;
	const comercial = user?.rol === users_rol_enum.ADMIN;

	const admin = user?.rol === users_rol_enum.ADMIN;
	const dispatch = useAuthDispatch();
	const [verMenu, setVerMenu] = useState(false);
	const [showMore, setShowMore] = useState(false);

	useEffect(() => {
		updateUser();
	}, []);

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

	const updateUser = useCallback(() => async () => {
		if (!user) return;
		try {
			const res = await axios.get('/auth/me');
			dispatch('UPDATE', res.data);
			return res.data;
		} catch (error) {
			console.error('updatedMe: ' + error);
		}
	}, []);

	if(!user) return <div className="flex flex-col items-center justify-center h-[60vh] w-full z-0">
		<Image width="100" height="100" src="/images/ABE.ico" alt="ABE Logo"/>
			<p className="mb-12 text-xs font-bold text-center">
				{process.env.NEXT_PUBLIC_TITLE} V.{process.env.NEXT_PUBLIC_VERSION}
			</p>
		<Button title={user ? 'Cerrar Sesión' : 'Iniciar Sesión'}
		onClick={ user ? cerrarSesion : () => router.push('/auth/login')}
		/>
	</div>


	return (
		<div className="fixed z-50 flex-col h-full md:-mt-3 xl:ml-1">
			{/*ABE Logo*/}
			<div className="hidden p-0 rotate-90 xl:ml-1 -pr-4 hoverEffect hover:bg-blue-100 xl:rotate-0 md:inline">
				<Image width="70" height="70" src="/images/ABE.ico" alt="ABE Logo" onClick={() => router.push('/')} />
				<p className="-mt-3 text-xs font-bold text-center t-0">
					{process.env.NEXT_PUBLIC_TITLE} V.{process.env.NEXT_PUBLIC_VERSION}
				</p>
			</div>
			{/*Menu */}
			{user && (
				<div className={`sticky pb-0 mt-2 mb-0`} onMouseEnter={() => setVerMenu(true)} onMouseLeave={() => setVerMenu(false)}>
					{/*Todos menos directores*/}
					{director && false && (
						<div className="items-start mt-5 mb-0 inner scrollbar-hide">
							<SidebarRow hideTitle={verMenu} Icon={BanknotesIcon} title="Tus Solicitudes" redirectTo="/solicitudes" />
							<SidebarRow hideTitle={verMenu} Icon={BanknotesIcon} title="Todas las Solicitudes" redirectTo="/solicitudes" />
						</div>
					)}
					{/*Todos los usuarios*/}
					<div className="items-start mt-5 mb-0 inner scrollbar-hide">
						<SidebarRow hideTitle={verMenu} Icon={BellIcon} title="Tickets asignados/bles" redirectTo="/tickets?seccion=asignados" />
						<SidebarRow hideTitle={verMenu} Icon={TicketIcon} title="Tickets creados" redirectTo="/tickets?seccion=tuyos" />
						<SidebarRow hideTitle={verMenu} Icon={CheckCircleIcon}	title="Tickets que respondiste" redirectTo="/tickets?seccion=respondidos" />
						<SidebarRow hideTitle={verMenu} Icon={UserGroupIcon} title="Clientes" redirectTo="/clientes" />
						<SidebarRow hideTitle={verMenu} Icon={ArrowUturnLeftIcon} title="Tickets Rechazados" redirectTo="/tickets?seccion=rechazados" />
						<SidebarRow hideTitle={verMenu} Icon={SwatchIcon} title="Todos los tickets" redirectTo="/tickets" />
					</div>
					{/*Solo admins de clientes-servicios*/}
					{comercial && (
						<div className="items-start mt-5 mb-0 inner scrollbar-hide">
							<SidebarRow hideTitle={verMenu} Icon={WrenchIcon} title="Servicios" redirectTo="/servicios" />
						</div>
					)}
					{/*Solo admins de clientes-servicios*/}
					{admin &&(
						<div className="items-start mt-5 mb-0 inner scrollbar-hide">
							<SidebarRow hideTitle={verMenu} Icon={CogIcon} title="Configuración" redirectTo="/configuracion" />
						</div>
					)}
				</div>
			)}
			{/*Informacion de usuario */}
			<div className="fixed z-50 flex bottom-5" onClick={() => setShowMore(!showMore)}>
				{user && <div className="bg-gray-300 rounded-full">
					<Avatar />
				</div>}
				{showMore && <Button
				title={user ? 'Cerrar Sesión' : 'Iniciar Sesión'}
				onClick={user ? () => dispatch('LOGOUT') : () => router.push('/auth/login')}
        />}
			</div>
		</div>
	);
}
export default Sidebar;
