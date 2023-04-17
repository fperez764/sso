import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ABEModel, TicketGrupo, User } from '../../../types/typesSSO';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
    post: ABEModel;
    className?: string;
}


export default function FlujoCreador ({post, className}:Props) { return(
    <div className={`flex items-start space-x-3 mx-1 ${className}`}>
        {/** user info */}
        {post.usuarioCreacion && <>
            <div className=''>
                <img
                className='m-auto rounded-full h-7 w-7'
                src={`/images/areas/${post.usuarioCreacion.area}.png`}
                alt={post.usuarioCreacion.area}
                />
                <h4 className='font-bold text-[11px] text-center sm:text-[10px] hover:underline'>
                    {post.usuarioCreacion.area}
                </h4>
            </div>
            <div className='flex-col items-start'>
                <p className='text-[13px]'>
                    @{post.usuarioCreacion.username}
                </p>
                <p className='font-medium text-[12px]'>
                    {dayjs(post.fechaCreacion).fromNow()}
                </p>
            </div>
        </>}
        {post.usuarioBaja && <div className='flex-col items-start ml-4 '>
            <p className='text-sm sm:text-[15px]'>
                Anulado por: @{post.usuarioBaja}
            </p>
            <p className='font-medium text-[13px]'>
                {dayjs(post.fechaModificacion).fromNow()}
            </p>
        </div>}
    </div>)
}
