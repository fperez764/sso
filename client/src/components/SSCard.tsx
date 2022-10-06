import {
    ChartBarIcon,
    ChatBubbleLeftIcon,
    CheckCircleIcon,
    CogIcon,
    HeartIcon,
    PlusIcon,
    ShareIcon,
    TrashIcon,
    XCircleIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconS } from '@heroicons/react/24/solid';
import { signIn, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { SolicitudComentarios, SolicitudServicio } from '../../types/types';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import SolicitudTimeline from './SolicitudTimeline';
import TimelineNice from './TimeLineNice';
import Link from 'next/link';

dayjs.locale(es);
dayjs.extend(relativeTime);

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
function SSCard({ post }: Props) {
    const { data: session } = useSession();
    const owner = session?.user.name == post?.usuarioCreacion;
    const admin = session?.user.role === 'SuperAdmin';
    const [aceptaste, setAceptaste] = useState(false);
    const [aceptados, setAceptados] = useState<string[]>([]);
    const [comentarios, setComentarios] = useState<SolicitudComentarios[]>([]);
    const [nuevoComentarioVisible, setNuevoComentarioVisible] = useState(false);
    const [textoComentario, setTextoComentario] = useState('');
    const [puedeAceptar, setPuedeAceptar] = useState(false);

    // useEffect(() => {
    //     const unsubscribe = key; //Obtener objeto de solicitud de servicio con sus aceptaciones
    // }, [aceptados]);

    // useEffect(() => {
    //     setAceptaste( //Revisa si entre los aceptados esta tu username
    //         aceptados.findIndex(
    //             (aceptacion) => aceptacion.id === session?.user.id
    //         ) !== -1
    //     );
    // }, [aceptados]);

    //session?.user.role.includes('Admin') && setPuedeAceptar(true);
    //session?.user.role.includes('SSadmin?') && setTienePermisos(true);

    async function changeAcceptSS() {
        if (!session){ 
            signIn(); 
            return;
        }
        if (aceptaste) {
            setAceptaste(false);
            setAceptados([...aceptados, session.user.name]);
        } else {
            setAceptaste(true);
            setAceptados([...aceptados, session.user.name]);
        }
    }

    async function deleteSS() {
        if (
            window.confirm('Estas seguro de anular esta solicitud de servicio.')
        ) {
            //dar de baja SS si la logica de negocio lo permite;
        }
    }

    const comentarSS = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const comentarioToast = toast.loading('Agregando comentario...');
        const comentario = { 
            comentario: textoComentario,
            solicitudServicioId: post.id, 
            usuarioCreacion: session?.user?.name || 'usuario incorrecto',
        };

        const result = await fetch('api/solicitudServicio/comentario', {
            body: JSON.stringify(comentario),
            method: 'POST',
        });

        toast.success('Comentario agregado!', { id: comentarioToast, });
        setTextoComentario('');
        setNuevoComentarioVisible(false);
        actualizarComentariosSS();
    };

    const actualizarComentariosSS = async () => {
        const res = await fetch('api/solicitudServicio/comentario', {
            method: 'GET',
        });
        setComentarios(res.data);
    }; 



    return (
        <div className="p-3 border-b border-blue-300">
            <div className="flex cursor-pointer">
                {/*Solicitud Servicio*/}
                <div className="bg-blue-100">
                    {/*Header*/}
                    <div className="flex items-center justify-between">
                        {/**Post user info */}
                        <img
                            className="mr-4 rounded-full h-11 w-11"
                            src={`/roles/${post.user.area}.png`}
                            alt={post.user.area || 'usuario-area'}
                        />
                        <div className="flex items-center space-x-1 whitespace-nowrap">
                            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                                {post.user.area}
                            </h4>
                            <span className="text-sm sm:text-[15px]">
                                @{post.usuarioCreacion}
                            </span>
                            <span className="text-sm sm:text[15px] hover:underline">
                                {dayjs(post.fechaCreacion).fromNow()}
                            </span>
                            <Link href={post.url}>
                                <a className="mx-1 hover:underline"/>
                            </Link>
                        </div>
                        {/**Accion SS*/}
                        <CogIcon className="w-10 h-10 p-2 hoverEffect hover:bg-sky-100 hover:text-sky-500" />
                    </div>
                    {/*Post text*/}
                    <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
                        {post.descripcion}
                    </p>
                    {/*Post Image*/}
                    <img className="mr-2 rounded-2xl" src={'post.servicio.descripcion'} alt="" />
                    {/*Icons*/}
                    <div className="flex justify-between p-2 text-gray-500">
                        {/** Comentar SS */}
                        {session && (
                            <ChatBubbleLeftIcon 
                            onClick={()=> setNuevoComentarioVisible(true)} 
                            className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100" />
                        )}
                        {/** Eliminar SS */}
                        {(owner || admin) && (
                            <TrashIcon
                                onClick={deleteSS}
                                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
                            />
                        )}
                        {/** Aceptar SS */}
                        {(puedeAceptar || admin) && (
                        <div className="flex items-center">
                            {aceptaste ? (
                                <HeartIconS
                                    onClick={changeAcceptSS}
                                    className="p-2 text-red-600 h-9 w-9 hoverEffect hover:bg-red-100"
                                />
                            ) : (
                                <HeartIcon
                                    onClick={changeAcceptSS}
                                    className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
                                />
                            )}
                            {aceptados.length > 0 && (
                                <span className={`${aceptaste && 'text-red-600'}`}>
                                    {aceptados.length}
                                </span>
                            )}
                        </div>
                        )}
                        {/**Derivar a otra area ->*/}
                        <ShareIcon className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100" />
                        <ChartBarIcon className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100" />
                    </div>

                    {/* Caja para comentar */}
                    {nuevoComentarioVisible && (
                        <form onSubmit={comentarSS} className="flex mt-3 space-x-3">
                            <input 
                            value={textoComentario}
                            onChange={e => setTextoComentario(e.target.value)}
                            className="flex-1 p-2 bg-gray-100 outline-none reounded-lg" 
                            type="text" placeholder="Escribe un comentario..."/>
                            <button 
                                disabled={!textoComentario}
                                type='submit'
                                className="text-abe disabled:text-gray-200"
                            >Comentar</button>
                        </form>
                    )}
                    {/* Lista de comentarios */}
                    {comentarios?.length > 0 && (
                        <div>
                            {comentarios.map((comentario) => (
                                <div key={comentario.id} className="relative flex space-x-2"> 
                                    <hr className="absolute h-8 left-5 top-10 border-x border-abe/30"/>
                                    {/*<img className="object-cover mt-2 rounded-full h-7 w-7" alt="" src={comentario.usuarioCreacion}/>*/}
                                    <div className="flex items-center space-x-1">
                                        <p className="mr-1 font-bold">{comentario.usuarioCreacion}</p>
                                        <p className="hidden text-sm text-gray-500 lg:inline">{comentario.usuarioCreacion}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
