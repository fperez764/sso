import { SolicitudRespuesta, ClienteSolicitud } from "../../../types/typesSSO"
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import Button from "../Button";
import { ArchiveBoxXMarkIcon, CheckIcon, PencilIcon, UserPlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import { useAuthState } from "../../context/auth";

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props{
    respuesta: SolicitudRespuesta|null;
    ss: ClienteSolicitud;
    setShowEdit: any;
    showEdit: boolean;
  }


export default function RespuestaWidget({respuesta, ss, setShowEdit, showEdit} : Props) {
    const { user } = useAuthState();
    const owner = user?.username === ss?.usuarioCreacion.username;
    const admin = user?.rol === 'admin';
    const puedeResponder = owner || admin;

    if(!respuesta) respuesta = ss.respuestas[0];
    const getColorTimeline = (aceptado: string) => {
      switch (aceptado) {
          case 'APROBADO':
              return 'green';
          case 'RECHAZADO':
              return 'red';        
          default:
              return 'gray';
      }
  };

  const responderRespuesta = () => {toast.error('Por implementar: Marcar respuestas como aceptada {insertar respuesta}');}
  const rechazarRespuesta = () => {toast.error('Por implementar: Marcar respuesta como rechazada {insertar respuesta}');}
  const agregarRespuesta = () => {
    toast.error('Por implementar: agrega un paso en el flujo de solicitud {insertar: area, accion, vigencia, funcionario(opcional)}');
    //Si el usuario logueado es el creado del SS, permite ingresar el paso en cualquier parte del flujo
    //CC: solo puede agregar como siguiente paso
}

  return (
    respuesta && <div className="">
        {showEdit && <h1 className="conten">MODO EDICION</h1>}
        <h2 className="">ID Respuesta: {respuesta.id}</h2>
        <h2 className="font-bold">{respuesta.orden} {ss.tipo} - {respuesta.accion}</h2>
        <div className="flex mb-3">
            <div className={`flex ml-5 mt-5 justify-center items-center w-9 h-9 bg-blue-200 rounded-full ring-8 bg-transparent ring-${getColorTimeline(respuesta.estado)}-300`}>
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
                <p className="">@{ss.usuarioCreacion.username}</p>
                <time className="block mb-2 text-sm font-normal leading-none text-gray-500">{respuesta.fechaCreacion !== '' ? dayjs(respuesta.fechaCreacion).format('DD/MM/YYYY') : 'Pendiente'}</time>
            </div>
        </div>
        <p className=''>Descripción: {ss.descripcion}</p>
        {respuesta.respuesta ? <p className="">Respuesta: {respuesta.respuesta}</p>:null}
        {respuesta.fechaInicio &&
        <div className="font-bold">
          <p className="">{respuesta.fechaInicio.toString()}</p>
          <p className="">{respuesta.fechaFin.toString()}</p>
          <p className="">{respuesta.fechaRespuesta.toString()}</p>
        </div>}
        <div className="flex">
            <Button disabled={!puedeResponder} Icon={CheckIcon} title='Responder' titleConfirm="Responder solicitud" 
            onClick={responderRespuesta}/>
            <Button titleConfirm='Esta seguro que desea rechazar esta solicitud?' Icon={ArchiveBoxXMarkIcon} title='Rechazar' 
            disabled={!puedeResponder}
            onClick={rechazarRespuesta}/>
            <Button Icon={UserPlusIcon} title='Nuevo paso' 
            disabled={!puedeResponder}
            onClick={agregarRespuesta}/>
        </div>
   </div>
  )}