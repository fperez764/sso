import {
    CheckCircleIcon,
    PlusIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import { SolicitudServicio } from '../../types/types';
import SolicitudTimeline from './SolicitudTimeline';
import SSItem from './SSItem';

interface Props {
    key: string;
    post: SolicitudServicio;
}

/**
 * TODO: Componente para una solicitud de servicio, mostrando {id, fecha creacion, usuario creacion, sistema, prepagado y descripcion}
 * ? TODO: Se pintara en un recuadro verde (si todos sus estados son aceptados), rojo si algun estado es rechazado -> Revisar logica de rechazo
 * ? TODO: Tendra como un timeline mostrando los estados aceptado:rechazado:observacion con un popup del comentario, usuario, fecha de cada estado
 * ? comercial-instalador-documentosIns-docsComercial-modemAlmacen-modemInstalador-instalado-activado-docEntregado
 * ? mostrara un miniEstado del servicio (activado? tickets?)
 * ? mostrara un enlace al cliente
 * @param param0
 * @returns
 */
function SSCard({ post, key }: Props) {
    const { data: session } = useSession();

    return (
        <div className="p-3 border-b border-blue-300">
            <div className="flex cursor-pointer">
                <SSItem post={post} key={key}/>
                {/*Servicio*/}
                <div className='p-3 border-b border-red-400 cursor-pointer'>
                    {/*Header*/}
                    <div className={'items-center '}>
                        {/**Service info */}
                        <div className="flex justify-between">
                            <img
                                className="w-12 h-12 mr-4 rounded"
                                src={'/servicio-categoria/INTERNET.gif'}
                                alt={post.servicio?.categoria || 'servicio-categoria'}
                            />
                            <div className={`w-8 h-8 mr-4 rounded ${post.servicio?.activo ? 'bg-green-400':'bg-red-400'}`}>
                            {post.servicio?.activo ? <CheckCircleIcon /> : <XCircleIcon />}
                            </div>
                        </div>
                        <div className="items-center space-x-1 text-sm whitespace-nowrap">
                            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                                {post.servicio?.categoria || 'Categoria'}
                            </h4>
                        </div>
                        <h3 className="flex text-gray-800 text-[15px] sm:text-[16px] mb-2 hidden xl:inline">
                        {post.servicio?.descripcion || 'Descripción del servicio'}
                        </h3>
                    </div>
                </div>
                {/*Cliente*/}
                <div className="hidden p-3 border-b border-green-400 cursor-pointer xl:inline">
                    {/*Header*/}
                    <div className="flex justify-between">
                        {/**Cliente info */}
                        <div className="items-center space-x-1 whitespace-nowrap">
                            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                                {post.cliente?.nombres || 'Nombres Apellidos'}
                            </h4>
                            <span className="text-sm sm:text-[15px]">
                                {post.cliente ? `${post.cliente?.nroDocumento}:${post.cliente?.tipoDocumento}` : 'Documento Identidad : Tipo Documento'}
                            </span>
                            <h3 className="text-sm sm:text[18px] hover:underline font-bold">
                                {post.cliente?.tipoCliente || 'Tipo Cliente'}
                            </h3>
                        </div>
                        {/**Accion Cliente*/}
                        {!post.cliente && <PlusIcon className="w-10 h-10 p-2 hoverEffect hover:bg-sky-100 hover:text-sky-500" />}
                    </div>
                </div>
            </div>
            <SolicitudTimeline/> 
        </div>
    );
}

export default SSCard;
