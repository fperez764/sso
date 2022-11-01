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
import { SolicitudComentario, SolicitudServicio } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import router from 'next/router';
import { useAuthState } from '../../context/auth';
import SSServicio from './SSServicio';
import SSCliente from './SSCliente';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
    post: SolicitudServicio;
}

export default function SSItem({ post }: Props) {
    const { authenticated, user } = useAuthState();
    const [textoComentario, setTextoComentario] = useState('');
    const [textoAceptar, setTextoAceptar] = useState('');
    const [puedeAceptar, setPuedeAceptar] = useState(false);
    const [aceptaste, setAceptaste] = useState(false);
    const [aceptados, setAceptados] = useState<string[]>([]);
    const [comentarios, setComentarios] = useState<SolicitudComentario[]>([]);
    const [nuevoComentarioVisible, setNuevoComentarioVisible] = useState(false);
    const owner = user === post?.usuarioCreacion;
    const admin = user?.rol === 'admin';
    const comentarSS = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const comentarioToast = toast.loading('Agregando comentario...');
        const comentario = { 
            comentario: textoComentario,
            solicitudServicioId: post.id, 
            usuarioCreacion: user?.username || 'usuario incorrecto',
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
        if (!user){ 
            router.push('/auth/login') ;
            return;
        }
        if (aceptaste) {
            setAceptaste(false);
            setAceptados([...aceptados, user.username]);
        } else {
            setAceptaste(true);
            setAceptados([...aceptados, user.username]);
        }
    }

    async function deleteSS() {
        if (
            window.confirm('Estas seguro de anular esta solicitud de servicio.')
        ) {
            //dar de baja SS si la logica de negocio lo permite;
        }
    }

    const header = (
    <div className="flex">
        {/**Post user info */}
        <div className="">
            <img
            className="m-auto rounded-full h-9 w-9"
            src={`/images/areas/${post.usuarioCreacion.area}.png`}
            alt={post.usuarioCreacion.area}
            />
            <h4 className="font-bold text-[11px] text-center sm:text-[10px] hover:underline">
                {post.usuarioCreacion.area}
            </h4>
        </div>
        <div className="flex-col items-start ml-4 ">
            <p className="text-sm sm:text-[15px]">
                @{post.usuarioCreacion.username}
            </p>
            <p className="font-medium text-[13px]">
                {dayjs(post.fechaCreacion).fromNow()}
            </p>
        </div>
    </div>);

    const postTexts = (
        <div className="items-center justify-between overflow-hidden">
                <p className="font-bold text-[14px] sm:text-[13px] hover:underline">
                    {post.tipo}: {post.id}
                </p>
                <p className="text-gray-800 text-[13px] sm:text-[14px] hidden lg:inline">
                    {post.origen}
                </p>
                {post.grupo && <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
                    {post.grupo.name}
                </p>}
        </div>
    );

    const icons = (<div className="flex justify-around p-0 text-gray-500">
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
        </div>)}
        {/** Comentar SS */}
        {user && (
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
    </div>);

    const seccionComentarios = (<>
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
                            <p className="mr-1 font-bold">{comentario.usuarioCreacion.username}</p>
                            <p className="hidden text-sm text-gray-500 lg:inline">{comentario.usuarioCreacion.rol}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
        </>);

    return (
    <div className="">
        <div className="flex">
            {post.servicio && <SSServicio servicio={post.servicio} />}
            <div className="inline w-1/2 pl-2 ml-2 space-y-1">
                {header}
                {postTexts}
            </div>
            {/*Cliente*/}
            {post.cliente && <SSCliente cliente={post.cliente}/>}
        </div>
        <p className='text-center bg-blue-200'>{post.descripcion}</p>
        {icons}
        {seccionComentarios}
    </div>);
}
