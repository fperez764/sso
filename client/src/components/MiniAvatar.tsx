import { SVGProps } from 'react';
import { CogIcon, PuzzlePieceIcon, SunIcon } from '@heroicons/react/24/outline';
import { User } from '../../types/typesSSO';
import router from 'next/router';
interface Props {
    usuario: User;
    options?: boolean;
}

/**
 * TODO: Se reutilizara tanto para funcionarios como para clientes al igual que la pagina de perfil
 * @param param0
 * @returns
 */
function MiniAvatar({ usuario, options: simple }: Props) {
    return (
        <div className="hoverEffect text-gray-700 flex justify-center xl:justify-start mt-auto">
            <img
                className="h-10 w-10 rounded-full xl:mr-2"
                src={`/images/areas/${usuario.area}.png`}
                alt='Area'
                />
            <div className="leading-5 hidden xl:inline">
                <h4 className="font-bold">{usuario.username}</h4>
                <p className="text-gray-500">{usuario.rol}</p>
            </div>
            {simple && <CogIcon className="h-5 xl:ml-8 hidden xl:inline" onClick={()=> router.push('/ajustes')}/>}
        </div>
    );
}

export default MiniAvatar;
