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
        <div className="fixed flex-col hidden h-full sm:flex xl:items-start xl:ml-6">
            {/*ABE Logo*/}
            <div className="p-0 hoverEffect hover:bg-blue-100 xl:px-1">
                <Image
                    width="70"
                    height="70"
                    src="https://www.abe.bo/wp-content/uploads/2016/08/favicon.ico"
                    alt="ABE Logo"
                />
            </div>

            {/*Menu */}
            <div className="mt-4 mb-2.5 xl:items-start inner scrollbar-hide">
                <SidebarRow Icon={HomeIcon} title="Inicio" active={true} />
                <SidebarRow Icon={BellIcon} title="Solicitudes de Servicio" />
                <SidebarRow Icon={HashtagIcon} title="Mis Solicitudes" />
                {/*Portafolio-Clientes-Servicios */}
                <SidebarRow Icon={UserGroupIcon} title="Clientes" />
                <SidebarRow Icon={WrenchIcon} title="Servicios" />
                <SidebarRow Icon={WrenchScrewdriverIcon} title="Paquetes" />
                {/*Facturación */}
                <SidebarRow Icon={SwatchIcon} title="Facturación servicios" />
                <SidebarRow Icon={BeakerIcon} title="Facturacion Manual" />
                <SidebarRow Icon={ScaleIcon} title="Reporte Facturación" />
                {/*Inventarios*/}
                <SidebarRow Icon={BuildingStorefrontIcon} title="Articulos" />
                <SidebarRow Icon={ArchiveBoxIcon} title="Activos" />
                {/*Menues Usuario*/}
                <SidebarRow Icon={EnvelopeIcon} title="Notificaciones" />
                <SidebarRow Icon={UserIcon} title="Perfil" />
                <SidebarRow Icon={AdjustmentsVerticalIcon} title="Ajustes" />
            </div>
            <Button
                onClick={() => {
                    console.log('/GET nueva SS');
                }}
                collapsible={true}
                title="SS"
            />
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
