import dayjs from "dayjs";
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ClienteServicioTicket, ClienteSolicitud } from "../../../types/typesSSO";

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
    post: ClienteSolicitud | ClienteServicioTicket;
}


export default function FlujoCreador ({post}:Props) { return(
    <div className="flex flex-col items-start mx-1">
        {/**Post user info */}
        <div className="">
            <img
            className="m-auto rounded-full h-7 w-7"
            src={`/images/areas/${post.usuarioCreacion.area}.png`}
            alt={post.usuarioCreacion.area}
            />
            <h4 className="font-bold text-[11px] text-center sm:text-[10px] hover:underline">
                {post.usuarioCreacion.area}
            </h4>
        </div>
        <div className="flex-col items-start">
            <p className="text-[13px]">
                @{post.usuarioCreacion.username}
            </p>
            <p className="font-medium text-[12px]">
                {dayjs(post.fechaCreacion).fromNow()}
            </p>
        </div>
        {(post.usuarioBaja) && <div className="flex-col items-start ml-4 ">
            <p className="text-sm sm:text-[15px]">
                Anulado por: @{post.usuarioBaja}
            </p>
            <p className="font-medium text-[13px]">
                {dayjs(post.fechaModificacion).fromNow()}
            </p>
        </div>}
    </div>)
}
