import { Respuesta, ClienteSolicitud, ClienteServicioTicket, EstadoRespuesta, Roles, User, FlujoRespuesta, Cliente, getColorSeveridad } from '../../../types/typesSSO'
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from '../Button';
import { ArchiveBoxXMarkIcon, CheckIcon, DocumentPlusIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { useAuthState } from '../../context/auth';
import { useEffect, useState } from 'react';
import axios from 'axios';
import InputB from '../InputB';
import ComboBox from '../ComboBox';
import NuevaAccionFlujo from './NuevaAccionFlujo';
import FlujoCreador from './FlujoCreador';
import Image from 'next/image';
import ClienteWidget from '../cliente/ClienteWidget';
import Icons from '../Icons';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props{
    respuesta: Respuesta|null;
    post: ClienteSolicitud | ClienteServicioTicket;
    cliente: Cliente;
    setShowNew: any;
    setShowEdit: any;
    setEditPost?: any;
    showEdit: boolean;
    handleFeederRefresh: ()=>void;
  }

export default function RespuestaWidget({respuesta: sRespuesta, post, cliente, setShowEdit, setEditPost, showEdit, setShowNew, handleFeederRefresh} : Props) {
        
    const { user } = useAuthState();
    const ownerPost = user?.username === post?.usuarioCreacion.username;
    const owner = user?.username === sRespuesta?.usuarioCreacion.username;
    const admin = user?.rol === Roles.ADMIN;
    const idx = sRespuesta ? post.respuestas.findIndex(r => r.orden === sRespuesta.orden) : -1;
    const nextRespNoAcepatada = idx === -1 ? false : post.respuestas.length - 1 > idx ? post.respuestas[idx+1].estado !== EstadoRespuesta.ACEPTADO : true;
    const [textoRespuesta, setTextoRespuesta] = useState('Hecho');
    const [userNameAsignado, setUsernameAsignado] = useState<string>(user?.username || '');
    const [respuesta, setRespuesta] = useState<any>(sRespuesta);
    const puedeAgregarPaso = ((user?.username === respuesta?.usuarioAsignado?.username || ownerPost) && nextRespNoAcepatada); 
    const [porResponderId, setPorResponderId] = useState(post.porResponder?.id || post.respuestas[0]?.id);
    const puedeResponder = (user?.area === respuesta?.area || admin);
    const [showConfirmSave, setShowConfirmSave] = useState(false);
    const vencido = sRespuesta?.fechaFin && dayjs(sRespuesta.fechaFin).isBefore(new Date());
    const [asignado, setAsignado] = useState(!!sRespuesta?.usuarioAsignado);

    useEffect(()=>{
        setRespuesta(sRespuesta);
        setShowEdit(false);
    },[sRespuesta])

    if(!respuesta) return <p>'Seleccione una acción'</p>;

    const actualizarRespuesta = async () => {
        try {
            if(!respuesta) return;
            const res = await axios.get(`/tickets/respuestas/${respuesta.id}`);
            setRespuesta(res.data);
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
        toast.error(`No se pudo responder: ${JSON.stringify(error.response)}`, {
            id: responderToast,
        });
    }
  }

  const rechazarRespuesta = async () => {
    if(!respuesta) {toast.error('Respuesta is null'); return;}
    if(textoRespuesta === 'Hecho') {
        toast.error('Texto rechazo no puede ser "Hecho"');
        setTextoRespuesta('');
        return;
    }
    const responderToast = toast.loading('Rechazando...');
    try {
        const res = await axios.post(`/tickets/respuestas/${respuesta.id}/rechazar`, {respuesta: textoRespuesta});
        toast.success('Respuesta rechazada.', {
            id: responderToast,
        });
        setRespuesta(res.data);
        setPorResponderId(post.porResponder.id-1);
        handleFeederRefresh();
    } catch (error: any) {
        toast.error(`No se pudo rechazar: ${JSON.stringify(error.response)}`, {
            id: responderToast,
        });
    }
  }  

  const instertarRespuesta = () => {
    const nuevaResp = {
        orden: (respuesta.orden ?? 0) + .5,
        area: 'ADD',
        accion: 'Acción intermedia',
        clienteServicioTicket: post,
    }
    setRespuesta(nuevaResp);
    setShowEdit(true);
  }

  const confirmSave = async () => {    
    console.log('GUARDAR RESP INTERMEDIA');
    try {
      // Si hay un post lo edita cc crea uno nuevo.
      const res = await axios.post(`/tickets/respuestas/${post.id}`, respuesta);
      toast.success('Nuevo grupo-flujo guardado! ' + res.data);
      handleFeederRefresh();
      setShowEdit(false);
      } catch (error: any) {
      toast.error('No se pudo guardar el flujo:\n' + JSON.stringify(error.response?.data || error));
    }
  }


  const asignarRespuesta = async () => {
    if(!user) {toast.error('Inicia sesión'); return;}
    if(!userNameAsignado) setUsernameAsignado(user.username);
    if(!userNameAsignado) {toast.error('Selecciona un usuario para asignarlo'); return;}
    const tAsignar = toast.loading('Asignando esta acción a funcionario ' + userNameAsignado);
    try {
        const res = !!respuesta && await axios.post(`/tickets/respuestas/${respuesta.id}/asignar`, {usuario: userNameAsignado});
        handleFeederRefresh();
        actualizarRespuesta();
        toast.success('Acción de ticket asignada a ' + userNameAsignado, { id: tAsignar });
        setAsignado(true);
        handleFeederRefresh();
    } catch (error: any) {
        toast.error(`Algo salio mal ${error.code}: ${error.message}`, { id: tAsignar });
    }
}
    const colorTL = respuesta.estado === EstadoRespuesta.ACEPTADO ? 'bg-green-400' 
    : respuesta.estado === EstadoRespuesta.RECHAZADO ? 'bg-red-400' : 'bg-gray-400'; 

  return (
    <div className='flex flex-col px-2 py-2 space-y-2 bg-gray-100 rounded-md'>
        {/*Info Grupo/Ticket*/}
        <div className={`flex flex-col p-2 rounded-xl bg-${'severidad' in post ? getColorSeveridad(post) : 'gray-300'}`}>
            <h2 className='text-xl font-bold'>Ticket: {post.id} {'severidad' in post ? `SEVERIDAD: ${post.severidad}` : ''}</h2>
            <span className='font-bold'>Grupo: {post.grupo.tipo} - {post.grupo.nombre}</span>        
            <p className='text-xl'>{post.descripcion}</p>
            {(ownerPost || admin) && showEdit 
            ? <Button title='Cancelar' onClick={()=>setShowNew(false)} /> 
            : <Button title='Editar Ticket' onClick={()=>setShowNew(true)} />}
            <FlujoCreador post={post} className='absolute self-end mt-3'/>
        </div>
        <ClienteWidget post={cliente} />				
      {showEdit ? <div>
            <h1 className='flex font-bold text-center bg-orange-500'>EDITAR ACCIÓN</h1>
            <NuevaAccionFlujo respuesta={respuesta} handleEdit={()=>setShowConfirmSave(true)} />
            <Button title='Cancelar' onClick={()=>{setShowEdit(false); setRespuesta(sRespuesta)}}/>
            {showConfirmSave && <Button title='Guardar' titleConfirm='Se agregara al ticket una acción que necesita una respuesta.' onClick={confirmSave}/>}
        </div> 
        : <div>
            <h2 className='text-xl font-bold'>{vencido ? 'VENCIDO ' : respuesta.estado}: {respuesta.accion}</h2>
            <p className='text-[14px]'>ID Respuesta: {respuesta.id}- Por responder: {porResponderId}</p>
            {(ownerPost || owner) && !respuesta.respuesta && <Icons handleEdit={()=>setShowEdit(true)} handleDelete={()=>toast.error('Eliminar respuesta.')}/>}
            <div className='flex items-center'>
                <div className="flex flex-col items-center mx-3">
                    <Image className={`rounded-full w-16 h-16 ${respuesta.id === porResponderId && !respuesta.respuesta 
                                ? 'bg-yellow-300'
                                : colorTL}`}
                        width={64} height={64}            
                        src={`/images/areas/${respuesta.area}.png`}
                        alt={respuesta.area || 'usuario-area'}
                    />
                    <h3 className='overflow-hidden font-semibold'>{respuesta.area}</h3>
                </div>
                <div className='flex flex-col items-start mx-3 my-3'>
                    {!!respuesta.respuesta && <p className='text-2xl font-semibold'>Respuesta: {respuesta.respuesta}</p>}
                    {/*Responder/Rechazar*/}
                    {puedeResponder && porResponderId===respuesta.id && !respuesta.respuesta && <div className='flex'>
                        <InputB value={textoRespuesta} handleChange={setTextoRespuesta} placeholder='Respuesta' type='string'/>            
                        <Button Icon={CheckIcon} title='Responder' 
                        titleConfirm={`Responder acción con ${textoRespuesta}:\nAl responderla confirmas que la acción fue completada por ti.`} 
                        onClick={responderRespuesta} />
                        {/*Rechazar: Puede rechazar si toca responder y esta asignado a el o a su area; si es admin*/}
                        <Button titleConfirm='Esta seguro que desea rechazar esta solicitud?' Icon={ArchiveBoxXMarkIcon} title='Rechazar' 
                        onClick={rechazarRespuesta} disabled={respuesta.orden===0}/>
                    </div>}         
                    <p className='ml-1'>{respuesta.respuesta 
                        ? `Respondida ${dayjs(respuesta.fechaRespuesta).fromNow()}` 
                        : respuesta.fechaInicio 
                            ? `Vence ${dayjs(respuesta.fechaFin).fromNow()}`
                            : 'Vigencia no inicializada'}</p>
                </div>
            </div>
        <div className='flex-col'>
           {/*Usuario Asignado TODO: refactor condicionales */}
           <div className={`flex my-2 ${!userNameAsignado && 'text-red-500'}`}>
                {((!respuesta.usuarioAsignado || showEdit) && !asignado)
                    ? (admin || user?.area === respuesta.area) &&  <>  
                        {user?.rol !== Roles.FUNCIONARIO && <ComboBox value={userNameAsignado} setData={setUsernameAsignado} 
                        filterKey='username' postName='Usuario' searchEndpoint={`/auth/${respuesta.area}`} />}
                        <Button onClick={asignarRespuesta} Icon={UserPlusIcon} 
                        title={user?.rol === Roles.FUNCIONARIO ? 'Auto-asignarse' : 'Asignar responsable'} />
                    </>
                    : <p className='text-gray-500'>Usuario asignado: {respuesta.usuarioAsignado?.username || userNameAsignado}</p>}
            </div>
            {/*Agregar paso: Puede agregar paso si el usuario logueado respondio o es el creador del ticket */}
            {puedeAgregarPaso && <Button Icon={DocumentPlusIcon} 
            title={`Agregar acción entre ${respuesta.orden} y ${(respuesta.orden ?? 0) + 1}`} onClick={instertarRespuesta}/>}
        </div>
      </div>}
   </div>
)}