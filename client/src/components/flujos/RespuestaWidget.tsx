import { Respuesta, ClienteSolicitud, ClienteServicioTicket, EstadoRespuesta, Roles, User } from "../../../types/typesSSO"
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from "../Button";
import { ArchiveBoxXMarkIcon, CheckIcon, DocumentPlusIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { useAuthState } from "../../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import InputB from "../InputB";
import ComboBox from "../ComboBox";

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props{
    respuesta: Respuesta|null;
    post: ClienteSolicitud | ClienteServicioTicket;
    setShowEdit: any;
    showEdit: boolean;
    handleFeederRefresh: ()=>void;
  }

export default function RespuestaWidget({respuesta: sRespuesta, post, setShowEdit, showEdit, handleFeederRefresh} : Props) {

    const getColorTimeline = (estado: string) => estado === EstadoRespuesta.ACEPTADO ? 'bg-green-400' 
        : estado === EstadoRespuesta.RECHAZADO ? 'bg-red-400' : 'bg-gray-400';

    const { user } = useAuthState();
    const owner = user?.username === post?.usuarioCreacion.username;
    const admin = user?.rol === Roles.ADMIN;
    const [textoRespuesta, setTextoRespuesta] = useState('Hecho');
    const [usuarioAsignado, setUsuarioAsignado] = useState<User|null>(user);
    const [respuesta, setRespuesta] = useState(sRespuesta);
    const [porResponderId, setPorResponderId] = useState(post.porResponder?.id || post.respuestas[0].id);
    const puedeResponder = (user?.area === respuesta?.area || admin);
        
    useEffect(()=>{setRespuesta(sRespuesta);},[sRespuesta])

    if(!respuesta) return <p>'Seleccione una acción'</p>;

    const actualizarRespuesta = async () => {
        try {
            if(!respuesta) return;
            const res = await axios.get(`/tickets/respuestas/${respuesta.id}`);
            //setPorResponder?(res.data);
            toast.success('GET respuesta ' + res.data.comentarios.length);
        } catch (error: any) {toast.error(error.code + 'No se pudo actualizar la respuesta ' + JSON.stringify(error.message));}
    }; 
    

  const responderRespuesta = async () => {
    if(!respuesta) {toast.error('Respuesta is null'); return;}
    const responderToast = toast.loading('Guardando respuesta...');
    try {
        const res = await axios.post(`/tickets/respuestas/${respuesta.id}/responder`, {respuesta: textoRespuesta});
        toast.success(`Respuesta publicada ${res.data && 
            res.data.respuesta +' el ' + 
            res.data.fechaRespuesta + ' a ' + res.data.accion}.`, {
            id: responderToast,
        });
        setRespuesta(res.data);
        setPorResponderId(post.porResponder.id + 1);//post.respuestas[post.respuestas.indexOf(porResponder)+1].id
        handleFeederRefresh();
    } catch (error: any) {
        toast.error(`No se pudo responder: ${error.response.data}`, {
            id: responderToast,
        });
    }
  }

  const rechazarRespuesta = async () => {
    if(!respuesta) {toast.error('Respuesta is null'); return;}
    if(textoRespuesta === 'Hecho') {
        toast.error("Texto rechazo no puede ser 'Hecho'");
        setTextoRespuesta('');
        return;
    }
    const responderToast = toast.loading('Rechazando...');
    try {
        const res = await axios.post(`/tickets/respuestas/${respuesta.id}/rechazar`, {respuesta: textoRespuesta});
        toast.success(`Respuesta rechazada.`, {
            id: responderToast,
        });
        setRespuesta(res.data);
        setPorResponderId(post.porResponder.id-1);
        handleFeederRefresh();
    } catch (error: any) {
        toast.error(`No se pudo rechazar: ${error.response.data}`, {
            id: responderToast,
        });
    }
  }  

  const agregarRespuesta = () => {
    toast.error('Por implementar: agrega un paso en el flujo de solicitud {insertar: area, accion, vigencia, funcionario(opcional)}');
}
  const asignarRespuesta = async () => {
    if(!user) {toast.error('Inicia sesión'); return;}
    if(!usuarioAsignado) setUsuarioAsignado(user);
    if(!usuarioAsignado) {toast.error('Selecciona un usuario para asignarlo'); return;}
    const tAsignar = toast.loading('Asignando esta acción a funcionario ' + usuarioAsignado.username);
    try {
        const res = !!respuesta && await axios.post(`/tickets/respuestas/${respuesta.id}/asignar`, {usuario: usuarioAsignado.username});
        respuesta.usuarioAsignado = usuarioAsignado;
        handleFeederRefresh();
        toast.success('Acción de ticket asignada a ' + usuarioAsignado.username, {id: tAsignar});
    } catch (error: any) {
        toast.error(`Algo salio mal ${error.code}: ${error.response?.data}`, {id: tAsignar});
    }
}
  const asignarRespuesta = async () => {
    if(!user) {toast.error('Inicia sesión'); return;}
    if(!usuarioAsignado) setUsuarioAsignado(user);
    if(!usuarioAsignado) {toast.error('Selecciona un usuario para asignarlo'); return;}
    const tAsignar = toast.loading('Asignando esta acción a funcionario ' + usuarioAsignado.username);
    try {
        const res = !!respuesta && await axios.post(`/tickets/respuestas/${respuesta.id}/asignar`, {usuario: usuarioAsignado.username});
        respuesta.usuarioAsignado = usuarioAsignado;
        handleFeederRefresh();
        toast.success('Acción de ticket asignada a ' + usuarioAsignado.username, {id: tAsignar});
    } catch (error: any) {
        toast.error(`Algo salio mal ${error.code}: ${error.message}`, {id: tAsignar});
    }

}
const colorTL = respuesta.estado === EstadoRespuesta.ACEPTADO 
? 'bg-green-400' : respuesta.estado === EstadoRespuesta.RECHAZADO ? 'bg-red-400' : 'bg-gray-400'; 

  return (
    <div className="bg-gray-100 rounded-md px-1 py-2">
        {showEdit && <h1 className="content-center">MODO EDICION</h1>}
        <h2 className="text-[14px]">ID Respuesta: {respuesta.id}- Por responder: {porResponderId}</h2>
        <h2 className="font-bold">{post.grupo.tipo}</h2>
        <h3 className="font-bold">{respuesta.accion}</h3>
        <div className="flex mb-3">
            <div className={`flex ml-5 mt-5 justify-center items-center w-9 h-9 bg-blue-200 rounded-full ring-8 bg-transparent`}>
                <img
                    className={`absolute rounded-full h-16 ${respuesta.id === porResponderId && !respuesta.respuesta ? 'bg-yellow-300': getColorTimeline(respuesta.estado)}`}
                    src={`/images/areas/${respuesta.area}.png`}
                    alt={respuesta.area || 'usuario-area'}
                />
            </div>
            <div className="ml-6">
                <h3 className="overflow-hidden font-semibold">{respuesta.area}</h3>
                <h4 className="overflow-hidden">{respuesta.estado}</h4>
            </div>
            <div className="ml-3">
                <p className="">Creado por: {post.usuarioCreacion.username}</p>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-500">{respuesta.fechaCreacion !== '' ? dayjs(respuesta.fechaCreacion).format('DD/MM/YYYY') : 'Pendiente'}</time>
            </div>
        </div>
        <p className='my-4'>Descripción ticket: {post.descripcion}</p>
        {!!respuesta.respuesta && <div className='flex'>
            <p className='font-bold mx-1'>Respuesta:</p>
            <p>{respuesta.respuesta}</p>
        </div>}
        {respuesta.fechaInicio &&
        <div className="font-bold">
          <p className="">Inicio el {dayjs(respuesta.fechaInicio).format('DD-ddd HH A')} - Vence {dayjs(respuesta.fechaFin).format('DD-ddd HH A')}</p>
        </div>}
        <div className="flex-col">
           {/*Usuario Asignado*/}
           <div className="flex my-2">
                {!respuesta.usuarioAsignado
                    ? (admin || user?.area === respuesta.area) &&  <>  
                        <p>asignado: {usuarioAsignado?.username}</p>
                        {user?.rol !== Roles.FUNCIONARIO && <ComboBox value={usuarioAsignado?.username} setData={setUsuarioAsignado} filterKey='username' postName='Usuario' searchEndpoint='/auth' />}
                        {!respuesta.usuarioAsignado && <Button Icon={UserPlusIcon} title={user?.rol === Roles.FUNCIONARIO ? 'Auto-asignarse' : 'Asignar responsable'} onClick={asignarRespuesta}/>}
                    </>
                    : <p className='text-gray-500'>Usuario asignado: {respuesta.usuarioAsignado?.username}</p>}
            </div>
            {/*Responder/Rechazar*/}
            {puedeResponder && porResponderId===respuesta.id && !respuesta.respuesta && <div className="flex my-2">
                <InputB value={textoRespuesta} handleChange={setTextoRespuesta} placeholder={`Respuesta`} type='string'/>            
                <Button Icon={CheckIcon} title='Responder' titleConfirm={`Responder acción con ${textoRespuesta}:\nAl responderla confirmas que la acción fue completada por ti.`} 
                onClick={responderRespuesta} />
                {/*Rechazar: Puede rechazar si toca responder y esta asignado a el o a su area; si es admin*/}
                <Button titleConfirm='Esta seguro que desea rechazar esta solicitud?' Icon={ArchiveBoxXMarkIcon} title='Rechazar' 
                onClick={rechazarRespuesta} disabled={respuesta.orden===0}/>
            </div>}         
            {/*Agregar paso: Puede agregar paso si al usuario logueado le toca responder o es el creador del ticket */}
            {((puedeResponder&&porResponderId===respuesta.id) || owner) && <Button Icon={DocumentPlusIcon} title='Agregar nueva acción' onClick={agregarRespuesta}/>}
        </div>
   </div>
)}