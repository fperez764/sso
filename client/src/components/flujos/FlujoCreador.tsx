import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ABEModel, TicketGrupo, User } from '../../../types/typesSSO';
import Image from 'next/image';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
    post: ABEModel;
    className?: string;
}


export default function FlujoCreador ({ post, className }:Props) { return(
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
            <div className='flex-col items-start'>
                <p className='text-xs'>Creado por:</p>
                <p className='text-sm'>
                    @{post.usuarioCreacion.username}
                </p>
                <p className='text-xs font-medium'>
                    {dayjs(post.fechaCreacion).fromNow()}
                </p>
            </div>
        </>}
        {post.usuarioBaja && <div className='flex-col items-start ml-4 '>
            <p className='text-sm sm:text-xs'>
                Anulado por: @{post.usuarioBaja}
            </p>
            <p className='text-sm font-medium'>
                {dayjs(post.fechaModificacion).fromNow()}
            </p>
        </div>}
    </div>);
}
