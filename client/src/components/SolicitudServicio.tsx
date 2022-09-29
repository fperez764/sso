import {
    ArrowDownOnSquareStackIcon,
    ChartBarIcon,
    ChatBubbleLeftIcon,
    HeartIcon,
    ShareIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconS } from '@heroicons/react/24/solid';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import solicitudServicio from '../pages/api/solicitudServicio';

interface Props {
    key: string;
    post: {
        name?: string;
        username?: string;
        userImg?: string;
        img?: string;
        text?: string;
        timestamp?: string;
        usuarioCreacion?: string;
        id: number
    };
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
function SolicitudServicio({ post }: Props) {
    const { data: session } = useSession();
    const [aceptaste, setAceptaste] = useState(false);
    const [aceptados, setAceptados] = useState<string[]>([]);
    const [comentarios, setComentarios] = useState<ComentarioSS[]>([]);
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

    type ComentarioSS = {
        id?: number
        comentario: string,
        solicitudServicioId: number, 
        usuarioCreacion: string,
    }
    const comentarSS = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const comentarioToast = toast.loading('Agregando comentario...');
        const comentario: ComentarioSS = { 
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
        const comentarios: ComentarioSS[] = await fetch('api/solicitudServicio/comentario', {
            method: 'GET',
        });
        setComentarios(comentarios);
    }; 



    return (
        <div className="flex p-3 border-b border-gray-200 cursor-pointer">
            {/*User Image*/}
            <img
                className="mr-4 rounded-full h-11 w-11"
                src={post.userImg}
                alt="user-img"
            />
            {/*Derecha*/}
            <div className="">
                {/*Header*/}
                <div className="flex items-center justify-between">
                    {/**Post user info */}
                    <div className="flex items-center space-x-1 whitespace-nowrap">
                        <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                            {post.name}
                        </h4>
                        <span className="text-sm sm:text-[15px]">
                            @{post.username}
                        </span>
                        <span className="text-sm sm:text[15px] hover:underline">
                            {post.timestamp}
                        </span>
                    </div>
                    {/**Twodtos icon */}
                    <ArrowDownOnSquareStackIcon className="w-10 h-10 p-2 hoverEffect hover:bg-sky-100 hover:text-sky-500" />
                </div>
                {/*Post text*/}
                <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
                    {post.text}
                </p>
                {/*Post Image*/}
                <img className="mr-2 rounded-2xl" src={post.img} alt="" />
                {/*Icons*/}
                <div className="flex justify-between p-2 text-gray-500">
                    {/** Comentar SS */}
                    {session && (
                        <ChatBubbleLeftIcon 
                        onClick={()=> setNuevoComentarioVisible(true)} 
                        className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100" />
                    )}
                    {/** Eliminar SS */}
                    {session?.user.name == post?.usuarioCreacion && (
                        <TrashIcon
                            onClick={deleteSS}
                            className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
                        />
                    )}
                    {/** Aceptar SS */}
                    {puedeAceptar && (
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
        </div>
    );
}

export default SolicitudServicio;
