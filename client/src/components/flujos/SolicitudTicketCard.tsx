import {
    TrashIcon, XMarkIcon, NoSymbolIcon, PencilSquareIcon, ArrowUpOnSquareIcon, ArrowDownOnSquareIcon
} from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Respuesta, ClienteSolicitud, ClienteServicioTicket, Roles, getColorSeveridad, EstadoRespuesta } from '../../../types/typesSSO';
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

export default function SolicitudTicketCard({ post, setSelectedSubPost, setEditSubPost, editSubPost }: Props) {
    const { user } = useAuthState();

    const [anulado, setAnulado] = useState(false);
    const [mostrarFlujo, setMostrarFlujo] = useState(false);
    const [respuestas, setRespuestas] = useState<Respuesta[]>(post.respuestas);

    useEffect(()=>{
        setRespuestas(post.respuestas);
    },[post])

    const owner = user?.username === post?.usuarioCreacion.username;
    const admin = user?.rol === Roles.ADMIN;
    const resuelto = !post.respuestas.find(r=>r.estado !== EstadoRespuesta.ACEPTADO); //Si todas las respuestas tienen estado ACEPTADO
    const endpoint = 'servicio' in post ? '/solicitudes' : '/tickets';

    const color = resuelto ? 'green-400' : ('severidad' in post ? getColorSeveridad(post) : 'blue-300');
    const bgColorSeveridad = `bg-${color}`;
    const borderColorSeveridad = `border-${color}`;
    const porResponder = post.porResponder;

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
            //dar de baja solicitud/ticket si la logica de negocio lo permite;
           try {
            const result = await axios.delete(`${endpoint}/${post.id}`);
            toast.success('Se elimino la solicitud/ticket ' + post.id);            
            setAnulado(true);            
           } catch (error) {
            toast.error(`No se pudo eliminar la solicitud/ticket: ${post.id}, error: ${error}`);
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
        {'severidad' in post && <h4 className='font-bold text-center border-2 border-black rounded-lg px-2'>{resuelto ? 'RESUELTO': post.severidad}</h4>}
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

    return (
    <div className={`rounded-xl my-3 border-4 ${(post.usuarioBaja || anulado) ? 'bg-red-700' : 'bg-gray-100'} ${borderColorSeveridad}`}>
        {!resuelto && <div className="flex items-center" onClick={() => setSelectedSubPost(porResponder || post.respuestas[post.respuestas.length-1])}>
            <FlujoCliente cliente={clienteActualizado} className='w-1/3'/>
            <FlujoServicio servicio={'servicio' in post ? post.servicio : post.clienteServicio.servicio} />
            <FlujoCreador post={post} className='ml-16'/>
            {/*Cliente*/}
        </div>}
        {FlujoTextos}
        {mostrarFlujo && <div className='flex flex-col'>
             <FlujoTimeline respuestas={respuestas.sort((r, s)=> r.orden - s.orden)} setRespuesta={setSelectedSubPost}/>
            {!anulado && !resuelto && icons}
        </div>}
    </div>);
}
