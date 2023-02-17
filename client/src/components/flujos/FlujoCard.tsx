import {
    ChatBubbleLeftIcon, CheckIcon, TrashIcon, XMarkIcon, NoSymbolIcon, PencilSquareIcon, ArrowUpOnSquareIcon, ArrowDownOnSquareIcon
} from '@heroicons/react/24/outline';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { SolicitudComentario, SolicitudRespuesta, ClienteSolicitud, ServicioTicket } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import router from 'next/router';
import { useAuthState } from '../../context/auth';
import FlujoServicio from './FlujoServicio';
import FlujoCliente from './FlujoCliente';
import axios from 'axios';
import FlujoTimeline from './FlujoTimeline';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
    post: ClienteSolicitud | ServicioTicket;
    setSelectedSubPost: any;
    setEditSubPost: any;
    editSubPost: boolean;
}

export default function FlujoCard({ post, setSelectedSubPost, setEditSubPost, editSubPost }: Props) {
    const { user } = useAuthState();
    const [anulado, setAnulado] = useState(false);
    const [textoComentario, setTextoComentario] = useState('');
    const [mostrarFlujo, setMostrarFlujo] = useState(true)
    const [puedeAceptar, setPuedeAceptar] = useState(false);
    const [aceptaste, setAceptaste] = useState(false);
    const [aceptados, setAceptados] = useState<string[]>([]);
    const [comentarios, setComentarios] = useState<SolicitudComentario[]>([]);
    const [nuevoComentarioVisible, setNuevoComentarioVisible] = useState(false);
    const [respuestas, setRespuestas] = useState<SolicitudRespuesta[]>(post.respuestas);

    const owner = user?.username === post?.usuarioCreacion.username;
    const admin = user?.rol === 'admin';

    const cancelPostToEdit = () => {
        setRespuestas(post.respuestas);
        setEditSubPost(false);
        setSelectedSubPost(null);
    }

    const setPostToEdit = () => {
        setEditSubPost(true);
    }
    const comentarSS = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const comentarioToast = toast.loading('Agregando comentario...');
        const comentario = { 
            comentario: textoComentario,
            solicitudServicioId: post.id, 
            usuarioCreacion: user?.username || 'usuario incorrecto',
        };

        const result = await fetch('/solicitudServicio/comentario', {
            body: JSON.stringify(comentario),
            method: 'POST',
        });

        toast.success('Comentario agregado!', { id: comentarioToast, });
        setTextoComentario('');
        setNuevoComentarioVisible(false);
        actualizarComentariosSS();
    };

    const actualizarComentariosSS = async () => {
        const res = await fetch('/solicitudServicio/comentario', {
            method: 'GET',
        });
        setComentarios(await res.json());
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
            window.confirm('Estas seguro de eliminar esta solicitud de servicio.')
        ) {
            //dar de baja SS si la logica de negocio lo permite;
           try {
            const result = await axios.delete(`/solicitudServicio/${post.id}`);
            toast.success('Se elimino la SS ' + post.id);            
            setAnulado(true);            
           } catch (error) {
            toast.error(`No se pudo eliminar la SS: ${post.id}, error: ${error}`);
           }
        }
    }

    async function cancelSS() {
        if (
            window.confirm('Estas seguro de anular esta solicitud de servicio.')
        ) {
            //dar de baja SS si la logica de negocio lo permite;
           try {
            const result = await axios.patch(`/solicitudServicio/${post.id}`);
            toast.success('Se anulo la SS ' + post.id);
            setAnulado(true);            
           } catch (error) {
            toast.error(`No se pudo anular la SS: ${post.id}, error: ${error}`);
           }
        }
    }

    const usuarioCreacionInfo = (
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
        {(post.usuarioBaja || anulado) && <div className="flex-col items-start ml-4 ">
            <p className="text-sm sm:text-[15px]">
                Anulado por: @{post.usuarioBaja || user?.username}
            </p>
            <p className="font-medium text-[13px]">
                {anulado ? 'Justo ahora' : dayjs(post.fechaModificacion).fromNow()}
            </p>
        </div>}
    </div>);

    const FlujoTextos = (
    <div className="flex items-center w-full h-full overflow-hidden bg-blue-100 rounded">
        <div className="ml-2 w-[40%] flex">
            <div className='w-6' onClick={() => setMostrarFlujo(!mostrarFlujo)}>{mostrarFlujo 
                ? <ArrowUpOnSquareIcon />
                : <ArrowDownOnSquareIcon />
            }</div>
            <p className="font-bold text-[14px] sm:text-[13px] ml-5 hover:underline">
                {post.grupo && post.grupo.tipo}: {post.id}
            </p>
            <p className="text-gray-800 text-[12px] sm:text-[13px] mx-2 lg:inline">
                Origen: {post.origen}
            </p>
        </div>
        <p className='self-center w-[60%]'>
            {(anulado ? 'ANULADO: ' : '')+post.grupo?.nombre + ": " + post.descripcion}
        </p>
    </div>);


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
            onClick={()=> setNuevoComentarioVisible(!nuevoComentarioVisible)} 
            className="p-2 h-9 w-9 hoverEffect hover:text-sky-500 hover:bg-sky-100" />
        )}
        {/** Eliminar SS */}
        {!editSubPost && (owner || admin) && (
            <TrashIcon
                onClick={deleteSS}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
        )}
        {/** Eliminar SS */}
        {(!editSubPost && (owner || admin)) && (
            <NoSymbolIcon
                onClick={cancelSS}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
        )}
        {/** Eliminar SS */}
        {!editSubPost && (owner || admin) && (
            <PencilSquareIcon
                onClick={setPostToEdit}
                className="p-2 h-9 w-9 hoverEffect hover:text-blue-600 hover:bg-red-100"
            />
        )}
        {editSubPost && (
            <XMarkIcon
                onClick={cancelPostToEdit}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
        )}
    </div>);

    const seccionComentarios = (<>
        {/* Caja para comentar */}
        {nuevoComentarioVisible && (
            <form onSubmit={comentarSS} className="flex w-2/3 mt-3 space-x-3">
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
                            <p className="text-sm text-gray-500 lg:inline">{comentario.usuarioCreacion.rol}</p>
                        </div>
                    </div>
                ))}
            </div>
        )}
        </>);

    return (
    <div className={`bg-gray-100 rounded-xl my-3 ${(post.usuarioBaja || anulado) && 'bg-red-700'}`}>
        <div className="flex">
            <FlujoServicio servicio={'servicio' in post ? post.servicio : post.clienteServicio.servicio} />
            {usuarioCreacionInfo}
            {/*Cliente*/}
            <div className="w-1/4">
                <FlujoCliente cliente={'cliente' in post ? post.cliente : post.clienteServicio.cliente}/>
            </div>
        </div>
        <div className='flex flex-col items-center'>
            {FlujoTextos}
            {mostrarFlujo && <FlujoTimeline respuestas={respuestas.sort((r, s)=> r.orden - s.orden)} editar={editSubPost} setRespuesta={setSelectedSubPost} />}
        </div>
        {!anulado && icons}
        {seccionComentarios}
    </div>);
}
