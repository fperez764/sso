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
        <div className="fixed flex-col h-full mt-3 xl:mt-0 -ml-2 xl:ml-1 sm:inline hidden z-50">
            {/*ABE Logo*/}
            <div className="p-0 xl:ml-1 -pr-4 hoverEffect hover:bg-blue-100 rotate-90 xl:rotate-0">
                <Image
                    width="70"
                    height="50"
                    src="https://www.abe.bo/wp-content/uploads/2016/08/favicon.ico"
                    alt="ABE Logo"
                    onClick={() => router.push('/')}
                />
            </div>
            <div className="ml-6 xl:ml-12 cursor-pointer mt-10 w-8 h-8" onClick={()=> setVerMenu(!verMenu)}>
                {verMenu 
                ? <ChevronDoubleLeftIcon />
                : <ChevronDoubleRightIcon />}
            </div>
            {/*Menu */}
            <div className='pb-0 mt-2 mb-0 sticky'>
                <div className="mb-0 items-start inner scrollbar-hide">
                    <SidebarRow hideTitle={verMenu} Icon={BellIcon} title="Solicitudes de Servicio" onClick={()=>router.push('/solicitudesServicio')} active={true}/>
                    {/*Portafolio-Clientes-Servicios */}
                    <SidebarRow hideTitle={verMenu} Icon={UserGroupIcon} title="Clientes" onClick={()=>router.push('/clientes')} active={true}/>
                    <SidebarRow hideTitle={verMenu} Icon={WrenchIcon} title="Servicios" onClick={()=>router.push('servicios')} active={true}/>
                </div>
                <div className="mb-0 items-start inner scrollbar-hide">
                    {/*Facturación */}
                    <SidebarRow hideTitle={verMenu} Icon={SwatchIcon} title="Facturación servicios" onClick={()=>router.push('/facturacion')}/>
                    <SidebarRow hideTitle={verMenu} Icon={BeakerIcon} title="Facturacion Manual" onClick={()=>router.push('/facturacionManual')}/>
                    <SidebarRow hideTitle={verMenu} Icon={ScaleIcon} title="Reporte Facturación" onClick={()=>router.push('/reporteFacturacion')} active={true}/>
                    {/*Inventarios*/}
                    <SidebarRow hideTitle={verMenu} Icon={BuildingStorefrontIcon} title="Articulos" onClick={()=>router.push('/articulos')}/>
                    <SidebarRow hideTitle={verMenu} Icon={ArchiveBoxIcon} title="Activos" onClick={()=>router.push('/activos')}/>
                    {/*Menues Usuario*/}
                    <SidebarRow hideTitle={verMenu} Icon={EnvelopeIcon} title="Notificaciones" onClick={()=>router.push('/notificaciones')}/>
                </div>
            </div>
            {/*Informacion de usuario */}
            <div className="flex fixed bottom-5 ml-3">
                {user && <div className="bg-gray-300 rounded-full" 
                onClick={()=> setOpcionesSesion(!opcionesSesion)} >
                    <MiniAvatar usuario={user}/>
                </div>}
                {(opcionesSesion || !authenticated)&& <Button
                    collapsible={false}
                    onClick={user ? cerrarSesion : () => {router.push('/auth/login');}}
                    title={user ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                />}
            </div>
        </div>
    );
}

export default Sidebar;
