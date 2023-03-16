import {
    TrashIcon, XMarkIcon, NoSymbolIcon, PencilSquareIcon, ArrowUpOnSquareIcon, ArrowDownOnSquareIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Respuesta, ClienteSolicitud, ClienteServicioTicket, Roles, getPorResponder, getColorSeveridad } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuthState } from '../../context/auth';
import FlujoServicio from './FlujoServicio';
import FlujoCliente from './FlujoCliente';
import axios from 'axios';
import FlujoTimeline from './FlujoTimeline';
import FlujoCreador from './FlujoCreador';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
    post: ClienteSolicitud | ClienteServicioTicket;
    setSelectedSubPost: any;
    selectedSubPost: Respuesta | null;
    setEditSubPost: any;
    editSubPost: boolean;
}

export default function FlujoCard({ post, setSelectedSubPost, setEditSubPost, editSubPost }: Props) {
    const { user } = useAuthState();

    const [anulado, setAnulado] = useState(false);
    const [mostrarFlujo, setMostrarFlujo] = useState(false);
    const [respuestas, setRespuestas] = useState<Respuesta[]>(post.respuestas);

    const owner = user?.username === post?.usuarioCreacion.username;
    const admin = user?.rol === Roles.ADMIN;
    const endpoint = 'servicio' in post ? '/solicitudes' : '/tickets';

    const bgColorSeveridad = `bg-${'severidad' in post ? getColorSeveridad(post.severidad) : 'blue-300'}`;
    const borderColorSeveridad = `border-${'severidad' in post ? getColorSeveridad(post.severidad) : 'blue-300'}`;

    //Actualiza el clienteCard si es que el ticket tiene nueva informacion de contacto
    let clienteActualizado = 'severidad' in post ? post.clienteServicio.cliente : post.cliente;
    clienteActualizado.direccion = 'direccion' in post && post.direccion ? post.direccion : clienteActualizado.direccion;
    clienteActualizado.nombreCompleto = 'nombreContacto' in post && post.nombreContacto ? post.nombreContacto : clienteActualizado.nombreCompleto;
    clienteActualizado.telefono = 'telefonoContacto' in post && post.telefonoContacto ? post.telefonoContacto : clienteActualizado.telefono;

    const cancelPostToEdit = () => {
        setRespuestas(post.respuestas);
        setEditSubPost(false);
        setSelectedSubPost(null);
    }

    const setPostToEdit = () => {
        setEditSubPost(true);
    }

    async function deletePost() {
        if (
            window.confirm('Estas seguro de eliminar esta solicitud de servicio.')
        ) {
            //dar de baja SS si la logica de negocio lo permite;
           try {
            const result = await axios.delete(`${endpoint}/${post.id}`);
            toast.success('Se elimino la SS ' + post.id);            
            setAnulado(true);            
           } catch (error) {
            toast.error(`No se pudo eliminar la SS: ${post.id}, error: ${error}`);
           }
        }
    }

    async function anularPost() {
        if (
            window.confirm('Estas seguro de anular esta solicitud de servicio.')
        ) {
            //dar de baja Post si la logica de negocio lo permite;
           try {
            const result = await axios.patch(`${endpoint}/${post.id}`);
            const message = 'severidad' in post ? 'la solicitud ' : 'el ticket ';
            toast.success(`Se anulo ${message} ${post.id}`);
            setAnulado(true);            
           } catch (error) {
            toast.error(`No se pudo anular: ${post.id}, error: ${error}`);
           }
        }
    }       

    const FlujoTextos = (
    <div className={`flex w-full h-full overflow-hidden ${bgColorSeveridad} rounded items-center`}>
        {'severidad' in post && <h4 className='font-bold w-16 h-8 text-center border-2 border-black rounded-lg'>{post.severidad}</h4>}
        <div className="flex-col w-48 ml-3 h-16">
            <p className="font-bold text-[13px]">
                {post.grupo?.tipo}</p>
            <p className="font-bold text-[13px]">No. {post.id}</p>
            <p className="text-gray-800 text-[12px] sm:text-[13px]">
                Origen: {post.origen} </p>
        </div>
        <p className='self-center text-start w-2/3 ml-3 text-lg'>
            {(anulado ? 'ANULADO: ' : '')+post.grupo?.nombre + ": " + post.descripcion}
        </p>
        <div className='w-8 self-end' onClick={() => setMostrarFlujo(!mostrarFlujo)}>
            {mostrarFlujo ? <ArrowUpOnSquareIcon /> : <ArrowDownOnSquareIcon />}
        </div>

    </div>);


    const icons = (<div className="flex justify-around p-0 text-gray-500">
        {/** Eliminar post */}
        {!editSubPost && (owner || admin) && (
            <TrashIcon
                onClick={deletePost}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
        )}
        {/** Anular post */}
        {(!editSubPost && (owner || admin)) && (
            <NoSymbolIcon
                onClick={anularPost}
                className="p-2 h-9 w-9 hoverEffect hover:text-red-600 hover:bg-red-100"
            />
        )}
        {/** Editar post */}
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

    const porResponder = getPorResponder(respuestas);
    return (
    <div className={`rounded-xl my-3 border-4 ${(post.usuarioBaja || anulado) ? 'bg-red-700' : 'bg-gray-100'} ${borderColorSeveridad}`}>
        <div className="flex justify-around" onClick={() => setSelectedSubPost(porResponder || post.respuestas[post.respuestas.length-1])}>
            <FlujoServicio servicio={'servicio' in post ? post.servicio : post.clienteServicio.servicio} />
            <FlujoCreador post={post}/>
            {/*Cliente*/}
            <div className={`flex w-2/4 ${'severidad' in post && clienteActualizado !== post.clienteServicio.cliente && 'bg-red-300'}`}>
                <FlujoCliente cliente={clienteActualizado}/>
            </div>
        </div>
        <div className='flex flex-col items-center'>
            {FlujoTextos}
            {mostrarFlujo && <FlujoTimeline respuestas={respuestas.sort((r, s)=> r.orden - s.orden)} 
            editar={editSubPost} setRespuesta={setSelectedSubPost}/>}
        </div>
        {!anulado && icons}
    </div>);
}
