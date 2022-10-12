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
} from '@heroicons/react/24/outline';
import SidebarRow from './SidebarRow';
import MiniAvatar from '../MiniAvatar';
import Button from '../Button';
import { useSession } from 'next-auth/react';
import router from 'next/router';
import axios from 'axios';

function Sidebar() {
    const { data: session } = useSession();
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
            <div className="p-0 ml-7 hoverEffect hover:bg-blue-100">
                <Image
                    width="100"
                    height="70"
                    src="https://www.abe.bo/wp-content/uploads/2016/08/favicon.ico"
                    alt="ABE Logo"
                    onClick={() => router.push('/')}
                />
            </div>

            {/*Menu */}
            <div className='pb-0 mt-0 mb-0'>
                <div className="mb-0 xl:items-start inner scrollbar-hide">
                    <SidebarRow Icon={BellIcon} title="Solicitudes de Servicio" onClick={()=>router.push('/solicitudesServicio')} active={true}/>
                    {/*Portafolio-Clientes-Servicios */}
                    <SidebarRow Icon={UserGroupIcon} title="Clientes" onClick={()=>router.push('/clientes')} active={true}/>
                    <SidebarRow Icon={WrenchIcon} title="Servicios" onClick={()=>router.push('servicios')} active={true}/>
                </div>
                <div className="mb-0 xl:items-start inner scrollbar-hide">
                    {/*Facturación */}
                    <SidebarRow Icon={SwatchIcon} title="Facturación servicios" onClick={()=>router.push('/facturacion')}/>
                    <SidebarRow Icon={BeakerIcon} title="Facturacion Manual" onClick={()=>router.push('/facturacionManual')}/>
                    <SidebarRow Icon={ScaleIcon} title="Reporte Facturación" onClick={()=>router.push('/reporteFacturacion')} active={true}/>
                    {/*Inventarios*/}
                    <SidebarRow Icon={BuildingStorefrontIcon} title="Articulos" onClick={()=>router.push('/articulos')}/>
                    <SidebarRow Icon={ArchiveBoxIcon} title="Activos" onClick={()=>router.push('/activos')}/>
                    {/*Menues Usuario*/}
                    <SidebarRow Icon={EnvelopeIcon} title="Notificaciones" onClick={()=>router.push('/notificaciones')}/>
                </div>
            </div>
            {/*Informacion de usuario */}
            <div className="fixed bottom-5">
                {session ? (
                    <MiniAvatar
                        usuario={session.user?.name}
                        permisos={session.user?.role}
                        options={true}
                    />
                ) : (
                    ''
                )}

                <Button
                    collapsible={false}
                    onClick={session ? cerrarSesion : () => {router.push('/auth/signin');}}
                    title={session ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                />
            </div>
        </div>
    );
}

export default Sidebar;
