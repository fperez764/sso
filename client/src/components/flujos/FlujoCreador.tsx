import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ABEModel } from '../../../types/typesSSO';
import Image from 'next/image';
import { useState } from 'react';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
    post: ABEModel;
    className?: string;
}


export default function FlujoCreador ({ post, className }:Props) { 
    const [verFechaCompleta, setVerFechaCompleta] = useState(false);
    return(
    <div className={`flex items-start justify-center space-x-3 hover:bg-gray-200 ${className}`}>
        {/** user info */}
        {post.usuarioCreacion && <>
            <div className='hidden md:inline'>
                <Image
                className='w-12 h-12 m-auto rounded-lg'
                width={64}
                height={64}
                src={`/images/areas/${post.usuarioCreacion.area}.png`}
                alt={post.usuarioCreacion.area}
                />
                <h4 className='text-xs font-bold text-center md:text-sm hover:underline'>
                    {post.usuarioCreacion.area}
                </h4>
            </div>
            <div className='flex-col items-start'
                    onMouseEnter={() => setVerFechaCompleta(true)}
                    onMouseLeave={()=> setVerFechaCompleta(false)}
            >
                <p className='text-xs'>Creado por:</p>
                <p className='text-sm'>
                    @{post.usuarioCreacion.username}
                </p>
                <p className='text-xs font-medium'>
                    {verFechaCompleta ? dayjs(post.fechaModificacion).format('MMM-DD HH:mm') : dayjs(post.fechaModificacion).fromNow()}
                </p>
            </div>
        </>}
        {post.usuarioBaja && <div className='flex-col items-start ml-4 '
            onMouseEnter={() => setVerFechaCompleta(true)}
            onMouseLeave={()=> setVerFechaCompleta(false)}
        >
            <p className='text-sm sm:text-xs'>
                Anulado por: @{post.usuarioBaja}
            </p>
            <p className='text-sm font-medium'>
                {verFechaCompleta ? dayjs(post.fechaModificacion).format('YYYY-MM-DDTHH:mm:ss') : dayjs(post.fechaModificacion).fromNow()}
            </p>
        </div>}
    </div>);
}
