import { CogIcon } from '@heroicons/react/24/outline';
import { User } from '../../types/typesSSO';
import router from 'next/router';
import { useState } from 'react';
import Image from 'next/image';
interface Props {
    usuario: User;
    options?: boolean;
    simple?: boolean;
}

function Avatar({ usuario, options: simple }: Props) {
    const [showMore, setShowMore] = useState(false);
    return (
        <div className="flex justify-center mt-auto text-gray-700 xl:justify-start hoverEffect">
            <Image
                className="items-center w-10 h-10 mt-1 ml-2 rounded-full xl:mr-2"
                src={`/images/areas/${usuario.area}.png`}
                alt='Area'
                width={64}
                height={64}
                onMouseEnter={() => setShowMore(true)}
                onMouseLeave={()=> setShowMore(false)}
                />
                {showMore && <p className="absolute bg-gray-200 mt-12 ml-1 rounded text-[10px]">{usuario.rol}</p>}
            <div className="mt-2 mr-4 text-xs xl:text-sm">
                <h4 className="font-bold">{usuario.username}</h4>
                <p className="text-xs text-center text-gray-500 xl:text-sm">{usuario.area}</p>
            </div>
            {simple && <CogIcon className="hidden h-5 xl:ml-8 xl:inline" onClick={()=> router.push('/ajustes')}/>}
        </div>
    );
}

export default Avatar;
