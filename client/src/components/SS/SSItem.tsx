import Link from 'next/link';
import {
    ChartBarIcon,
    ChatBubbleLeftIcon,
    CogIcon,
    CheckIcon,
    ShareIcon,
    TrashIcon, XMarkIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { SolicitudComentarios, SolicitudServicio } from '../../../types/types';
import { useSession, signIn } from 'next-auth/react';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
    post: SolicitudServicio;
}

export default function SSItem({ post }: Props) {
    const { data: session } = useSession();
    const [textoComentario, setTextoComentario] = useState('');
    const [textoAceptar, setTextoAceptar] = useState('');
    const [puedeAceptar, setPuedeAceptar] = useState(false);
    const [aceptaste, setAceptaste] = useState(false);
    const [aceptados, setAceptados] = useState<string[]>([]);
    const [comentarios, setComentarios] = useState<SolicitudComentarios[]>([]);
    const [nuevoComentarioVisible, setNuevoComentarioVisible] = useState(false);
    const owner = session?.user.name == post?.usuarioCreacion;
    const admin = session?.user.role === 'SuperAdmin';
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


    return (
    <div className="bg-blue-100 w-1/2">
        {/*Header*/}
        <div className="flex items-center justify-between">
            {/**Post user info */}
            <div className="flex self-start items-center space-x-1 whitespace-nowrap">
                <img
                className="mr-4 rounded-full h-11 w-11"
                src={`/images/areas/${post.usuarioCreacion?.area}.png`}
                alt={JSON.stringify(post.user)}
                />
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                    {post.user?.area}
                </h4>
                <span className="text-sm sm:text-[15px]">
                    @{JSON.stringify(post.usuarioCreacion)}
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
        <div className="flex items-center justify-between">
            <div className="space-x-1 whitespace-nowrap">
                <p className="font-bold text-[15px] sm:text-[16px] hover:underline">
                    {post.tipo}({post.origen}):
                </p>
                <p className="text-gray-800 text-[15px] sm:text-[16px]">
                    {post.descripcion}
                </p>
            </div>
            <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
                Grupo: {JSON.stringify(post.grupo)}
            </p>
        </div>
        {/*Post Image*/}
        <img className="mr-2 rounded-2xl" src={'post.servicio.descripcion'} alt="Adjuntos" />
        {/*Icons*/}
        <div className="flex justify-between p-2 text-gray-500">
            {/** Aceptar SS */}
            {(puedeAceptar || admin) && (
            <div className="flex items-center">
                {aceptaste ? (
                    <XMarkIcon
                        onClick={changeAcceptSS}
                        className="p-2 text-red-600 h-9 w-9 hoverEffect hover:bg-red-100"
                    />
                ) : (
                    <CheckIcon
                        onClick={changeAcceptSS}
                        className="p-2 h-9 w-9 hoverEffect hover:text-green-600 hover:bg-green-100"
                    />
                )}
                {aceptados.length > 0 && (
                    <span className={`${aceptaste && 'text-red-600'}`}>
                        {aceptados.length}
                    </span>
                )}
            </div>
            )}
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
    </div>);
}
