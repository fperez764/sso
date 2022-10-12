import { SVGProps } from 'react';
import { CogIcon, PuzzlePieceIcon, SunIcon } from '@heroicons/react/24/outline';
interface Props {
    usuario: string | null;
    permisos: string | null;
    options?: boolean;
}

/**
 * TODO: Se reutilizara tanto para funcionarios como para clientes al igual que la pagina de perfil
 * @param param0
 * @returns
 */
function MiniAvatar({ usuario, permisos, options: simple }: Props) {
    const Icon = permisos === 'SuperAdmin' ? SunIcon : PuzzlePieceIcon;
    return (
        <div className="hoverEffect text-gray-700 flex justify-center xl:justify-start mt-auto">
            <Icon className="h-10 w-10 rounded-full xl:mr-2" />
            <div className="leading-5 hidden xl:inline">
                <h4 className="font-bold">{usuario}</h4>
                <p className="text-gray-500">{permisos}</p>
            </div>
            {simple && <CogIcon className="h-5 xl:ml-8 hidden xl:inline" onClick={()=> router.push("/ajustes")}/>}
        </div>
    );
}

export default MiniAvatar;
