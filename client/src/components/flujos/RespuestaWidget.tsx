import { Respuesta, ClienteSolicitud, ClienteServicioTicket, EstadoRespuesta } from "../../../types/typesSSO"
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from "../Button";
import { ArchiveBoxXMarkIcon, CheckIcon, PencilIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { useAuthState } from "../../context/auth";
import { useState } from "react";
import axios from "axios";

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props{
    respuesta: Respuesta|null;
    post: ClienteSolicitud | ClienteServicioTicket;
    setShowEdit: any;
    showEdit: boolean;
    porResponder: boolean;
  }


export default function RespuestaWidget({respuesta, post, setShowEdit, showEdit} : Props) {
    const { user } = useAuthState();
    let porResponder = post.respuestas.sort((r, s)=> r.orden - s.orden).find(r => !r.respuesta);
    if(porResponder?.estado === EstadoRespuesta.RECHAZADO) porResponder = post.respuestas[post.respuestas.indexOf(porResponder)-1];
    const owner = user?.username === post?.usuarioCreacion.username;
    const admin = user?.rol === 'admin';
    const puedeResponder = (porResponder?.id === respuesta?.id) && (owner || admin);
    const [textoRespuesta, setTextoRespuesta] = useState('Hecho');

    if(!respuesta) respuesta = post.respuestas[0];
    if(!respuesta) return <p>'Post sin respuestas'</p>;
    const colorTimeline = respuesta.estado ===
          'APROBADO' ? 'green' : respuesta.estado ===
          'RECHAZADO' ? 'red' : 'gray';

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
    } catch (error: any) {
        toast.error(`No se pudo responder: ${error.message}`, {
            id: responderToast,
        });
    }
  }

  const rechazarRespuesta = async () => {
    if(!respuesta) {toast.error('Respuesta is null'); return;}
    const responderToast = toast.loading('Recahzando...');
    try {
        const res = await axios.post(`/tickets/respuestas/${respuesta.id}/rechazar`, {respuesta: textoRespuesta});
        toast.success(`Respuesta rechazada: ${JSON.stringify(res)}.`, {
            id: responderToast,
        });
        //Agregar comentario
        
    } catch (error: any) {
        toast.error(`No se pudo responder: ${error.message}`, {
            id: responderToast,
        });
    }
  }  
  const agregarRespuesta = () => {
    toast.error('Por implementar: agrega un paso en el flujo de solicitud {insertar: area, accion, vigencia, funcionario(opcional)}');
    //Si el usuario logueado es el creado del SS, permite ingresar el paso en cualquier parte del flujo
    //CC: solo puede agregar como siguiente paso
}

  return (
    respuesta && <div className="">
        {showEdit && <h1 className="content-center">MODO EDICION</h1>}
        <h2 className="">ID Respuesta: {respuesta.id} - Por responder: {porResponder?.id}</h2>
        <h2 className="font-bold">{respuesta.orden} {post.grupo.tipo} - {respuesta.accion}</h2>
        <div className="flex mb-3">
            <div className={`flex ml-5 mt-5 justify-center items-center w-9 h-9 bg-blue-200 rounded-full ring-8 bg-transparent ring-${colorTimeline}-300`}>
                <img
                    className="absolute rounded-full h-14"
                    src={`/images/areas/${respuesta.area}.png`}
                    alt={respuesta.area || 'usuario-area'}
                />
            </div>
            <div className="ml-6">
                <h3 className="overflow-hidden font-semibold">{respuesta.area}</h3>
                <h4 className="overflow-hidden">{respuesta.estado}</h4>
            </div>
            <div className="ml-3">
                <p className="">@{post.usuarioCreacion.username}</p>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-500">{respuesta.fechaCreacion !== '' ? dayjs(respuesta.fechaCreacion).format('DD/MM/YYYY') : 'Pendiente'}</time>
            </div>
        </div>
        <p className='my-4'>Descripción: {post.descripcion}</p>
        {!!respuesta.respuesta && <div className='flex'>
            <p className='font-bold'>Respuesta: </p>
            <p>{respuesta.respuesta}</p>
        </div>}
        {respuesta.fechaInicio &&
        <div className="font-bold">
          <p className="">Inicio el {dayjs(respuesta.fechaInicio).format('DD-ddd HH A')} - Vence {dayjs(respuesta.fechaFin).format('DD-ddd HH A')}</p>
        </div>}
        {//Asumimos que si es la respueta que toca responder:
        // Todas las anteriores tienen: estados aceptados; respuestas y fechaRespuesta
        // Todas las siguientes tienen estado: pendiente o rechazado, no tienen respuestas ni fecharespuesta
        puedeResponder && <div className="flex"> 
            {/*Responder: Puede responder si toca responder y si esta asignado a el o a su area; si es admin*/}
            <Button Icon={CheckIcon} title='Responder' titleConfirm="Responder solicitud" 
            onClick={responderRespuesta}/>
            {/*Rechazar: Puede rechazar si toca responder y esta asignado a el o a su area; si es admin*/}
            <Button titleConfirm='Esta seguro que desea rechazar esta solicitud?' Icon={ArchiveBoxXMarkIcon} title='Rechazar' 
            onClick={rechazarRespuesta}/>
            {/*Agregar paso: Puede agregar paso si toca responder, */}
            <Button Icon={UserPlusIcon} title='Nuevo paso' onClick={agregarRespuesta}/>
        </div>}
   </div>
  )}