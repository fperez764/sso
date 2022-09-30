import Image from 'next/image';
import {
    BeakerIcon,
    HomeIcon,
    HashtagIcon,
    BellIcon,
    EnvelopeIcon,
    UserIcon,
    AdjustmentsVerticalIcon,
    ArchiveBoxIcon,
    BuildingStorefrontIcon,
    WrenchIcon,
    WrenchScrewdriverIcon,
    UserGroupIcon,
    SwatchIcon,
    ScaleIcon,
} from '@heroicons/react/24/outline';
import SidebarRow from './SidebarRow';
import MiniAvatar from './MiniAvatar';
import Button from './Button';
import { signIn, signOut, useSession } from 'next-auth/react';

function Sidebar() {
    const { data: session } = useSession();
    return (
        <div className="fixed flex-col hidden h-full bg-white sm:flex xl:items-start xl:ml-3">
            {/*ABE Logo*/}
            <div className="p-0 ml-7 hoverEffect hover:bg-blue-100">
                <Image
                    width="100"
                    height="70"
                    src="https://www.abe.bo/wp-content/uploads/2016/08/favicon.ico"
                    alt="ABE Logo"
                />
            </div>

            {/*Menu */}
            <div className='pb-0 mt-0 mb-0'>
                <div className="mb-0 xl:items-start inner scrollbar-hide">
                    <SidebarRow Icon={BellIcon} title="Solicitudes de Servicio" active={true}/>
                    {/*Portafolio-Clientes-Servicios */}
                    <SidebarRow Icon={UserGroupIcon} title="Clientes" active={true}/>
                    <SidebarRow Icon={WrenchIcon} title="Servicios" active={false}/>
                    <SidebarRow Icon={WrenchScrewdriverIcon} title="Paquetes" active={true}/>
                </div>
                <div className="mb-0 xl:items-start inner scrollbar-hide">
                    {/*Facturación */}
                    <SidebarRow Icon={SwatchIcon} title="Facturación servicios" />
                    <SidebarRow Icon={BeakerIcon} title="Facturacion Manual" />
                    <SidebarRow Icon={ScaleIcon} title="Reporte Facturación" />
                    {/*Inventarios*/}
                    <SidebarRow Icon={BuildingStorefrontIcon} title="Articulos" />
                    <SidebarRow Icon={ArchiveBoxIcon} title="Activos" />
                    {/*Menues Usuario*/}
                    <SidebarRow Icon={EnvelopeIcon} title="Notificaciones" />
                    <SidebarRow Icon={AdjustmentsVerticalIcon} title="Ajustes" />
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
                    onClick={session ? signOut : signIn}
                    title={session ? 'Cerrar Sesión' : 'Iniciar Sesión'}
                />
            </div>
        </div>
    );
}

export default Sidebar;
