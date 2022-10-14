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
import { useSession } from 'next-auth/react';
import router from 'next/router';
import axios from 'axios';
import { useState } from 'react';

function Sidebar() {
    const { data: session } = useSession();
    const [verMenu, setVerMenu] = useState(false);
    const [opcionesSesion, setOpcionesSesion] = useState(false);
    const cerrarSesion = async () => {   
        try {
          await axios.get('/auth/logout');
          router.push('/');
        } catch (err: any) {
          console.log(err);         
        }
      };
    return (
        <div className="fixed flex-col hidden h-full bg-white sm:flex xl:items-start xl:ml-3">
            {/*ABE Logo*/}
            <div className="p-0 hoverEffect hover:bg-blue-100">
                <Image
                    width="70"
                    height="50"
                    src="https://www.abe.bo/wp-content/uploads/2016/08/favicon.ico"
                    alt="ABE Logo"
                    onClick={() => router.push('/')}
                />
            </div>
            {verMenu 
            ? <ChevronDoubleLeftIcon className="ml-4 cursor-pointer w-8 h-8" onClick={()=> setVerMenu(!verMenu)}/>
            : <ChevronDoubleRightIcon className="ml-4 cursor-pointer w-8 h-8" onClick={()=> setVerMenu(!verMenu)}/>}
            {/*Menu */}
            <div className='pb-0 mt-5 mb-0'>
                <div className="mb-0 xl:items-start inner scrollbar-hide">
                    <SidebarRow hideTitle={verMenu} Icon={BellIcon} title="Solicitudes de Servicio" onClick={()=>router.push('/solicitudesServicio')} active={true}/>
                    {/*Portafolio-Clientes-Servicios */}
                    <SidebarRow hideTitle={verMenu} Icon={UserGroupIcon} title="Clientes" onClick={()=>router.push('/clientes')} active={true}/>
                    <SidebarRow hideTitle={verMenu} Icon={WrenchIcon} title="Servicios" onClick={()=>router.push('servicios')} active={true}/>
                </div>
                <div className="mb-0 xl:items-start inner scrollbar-hide">
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
            <div className="flex fixed bottom-5">
                {session && 
                    <div className="bg-gray-300 rounded-full" onClick={()=> setOpcionesSesion(!opcionesSesion)} ><MiniAvatar
                        usuario={session.user?.name}
                        permisos={session.user?.role}
                    /></div>}

                {opcionesSesion && <Button
                    collapsible={false}
                    onClick={session ? cerrarSesion : () => {router.push('/auth/signin');}}
                    title={session ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                />}
            </div>
        </div>
    );
}

export default Sidebar;
