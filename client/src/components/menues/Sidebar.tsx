import Image from 'next/image';
import {
    BeakerIcon,
    BellIcon,
    EnvelopeIcon,
    ArchiveBoxIcon,
    BuildingStorefrontIcon,
    WrenchIcon,
    UserGroupIcon,
    SwatchIcon,
    ScaleIcon,
    ChevronDoubleLeftIcon, ChevronDoubleRightIcon
} from '@heroicons/react/24/outline';
import SidebarRow from './SidebarRow';
import MiniAvatar from '../MiniAvatar';
import Button from '../Button';
import { useAuthState, useAuthDispatch } from '../../context/auth';
import router from 'next/router';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

function Sidebar() {
    const { authenticated, user } = useAuthState();
    const dispatch = useAuthDispatch();
    const [verMenu, setVerMenu] = useState(false);
    const [opcionesSesion, setOpcionesSesion] = useState(false);

    const cerrarSesion = async () => {   
        try {
          const res = await axios.get('/auth/logout');
          dispatch('LOGOUT');
          window.location.reload();
          toast.success('Cerraste sesión ' + res.data);
        } catch (err: any) {
          console.log(err);  
          toast.error('Algo fallo al cerrar sesión ' + err);       
        }
      };

      return (
        <div className="fixed z-50 flex-col hidden h-full mt-3 -ml-2 xl:mt-0 xl:ml-1 sm:inline">
            {/*ABE Logo*/}
            <div className="p-0 rotate-90 xl:ml-1 -pr-4 hoverEffect hover:bg-blue-100 xl:rotate-0">
                <Image
                    width="70"
                    height="50"
                    src="https://www.abe.bo/wp-content/uploads/2016/08/favicon.ico"
                    alt="ABE Logo"
                    onClick={() => router.push('/')}
                />
            </div>
            <div className="w-8 h-8 mt-10 ml-6 cursor-pointer xl:ml-12" onClick={()=> setVerMenu(!verMenu)}>
                {verMenu 
                ? <ChevronDoubleLeftIcon />
                : <ChevronDoubleRightIcon />}
            </div>
            {/*Menu */}
            <div className='sticky pb-0 mt-2 mb-0'>
                <div className="items-start mb-0 inner scrollbar-hide">
                    <SidebarRow hideTitle={verMenu} Icon={BellIcon} title="Solicitudes de Servicio" onClick={()=>router.push('/solicitudServicio')} active={true}/>
                    {/*Portafolio-Clientes-Servicios */}
                    <SidebarRow hideTitle={verMenu} Icon={UserGroupIcon} title="Clientes" onClick={()=>router.push('/clientes')} active={true}/>
                    <SidebarRow hideTitle={verMenu} Icon={WrenchIcon} title="Servicios" onClick={()=>router.push('/servicios')} active={true}/>
                </div>
                <div className="items-start mb-0 inner scrollbar-hide">
                    {/*Facturación */}
                    <SidebarRow hideTitle={verMenu} Icon={SwatchIcon} title="Facturación servicios" onClick={()=>router.push('/facturacion/servicios')}/>
                    <SidebarRow hideTitle={verMenu} Icon={BeakerIcon} title="Facturacion Manual" onClick={()=>router.push('/facturacion/manual')}/>
                    <SidebarRow hideTitle={verMenu} Icon={ScaleIcon} title="Reporte Facturación" onClick={()=>router.push('/facturacion')} active={true}/>
                    {/*Inventarios*/}
                    <SidebarRow hideTitle={verMenu} Icon={BuildingStorefrontIcon} title="Articulos" onClick={()=>router.push('/articulos')}/>
                    <SidebarRow hideTitle={verMenu} Icon={ArchiveBoxIcon} title="Activos" onClick={()=>router.push('/activos')}/>
                    {/*Menues Usuario*/}
                    <SidebarRow hideTitle={verMenu} Icon={EnvelopeIcon} title="Notificaciones" onClick={()=>router.push('/notificaciones')}/>
                </div>
            </div>
            {/*Informacion de usuario */}
            <div className="fixed flex ml-3 bottom-5">
                {user && <div className="bg-gray-300 rounded-full" 
                onClick={()=> setOpcionesSesion(!opcionesSesion)} >
                    <MiniAvatar usuario={user}/>
                </div>}
                {(opcionesSesion || !authenticated)&& <Button
                    onClick={user ? cerrarSesion : () => {router.push('/auth/login');}}
                    title={user ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                />}
            </div>
        </div>
    );
}

export default Sidebar;
