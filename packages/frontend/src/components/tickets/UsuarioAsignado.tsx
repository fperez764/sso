import { useAuthState } from '@src/context/auth';
import { ClienteServicioTicketAccion, users_rol_enum } from '@types/typesSSO';
import React, { useState } from 'react'
import ComboBox from '../ui/ComboBox';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { asignar } from '@src/app/api/tickets/acciones';
import { UserPlusIcon } from '@heroicons/react/24/outline';

interface Props {
    accion: ClienteServicioTicketAccion;
    handleFeederRefresh: () => void;
 }
 
const UsuarioAsignado = ({accion, handleFeederRefresh}: Props) => {
  const { user } = useAuthState();
  const puedeAsignar = !accion?.fechaRespuesta && (user?.rol !== users_rol_enum.FUNCIONARIO);
  const [userNameAsignado, setUsernameAsignado] = useState<string|null>(accion.usuarioAsignado);
    
   const asignarRespuesta = async (idAccion: number) => {
    if (!user) {
        toast.error('Inicia sesión');
        return;
    }
    if (!userNameAsignado) setUsernameAsignado(user.username);
    const asignado = asignar(idAccion, userNameAsignado);
    if(!asignado) return;
    handleFeederRefresh();
    handleFeederRefresh();
};

  return (<div className="flex flex-col items-start w-full my-3">
	{!!accion.usuarioAsignado && <p className="text-xl font-semibold text-gray-500">Usuario asignado: <span className='font-bold'>{accion.usuarioAsignado}</span></p>}
	{puedeAsignar && <div className='flex'>
		<ComboBox className='w-64' value={userNameAsignado} setData={setUsernameAsignado} filterKey="username" 
      postName={`${accion.area}`} searchEndpoint={`/users/${accion?.area}`}/>
		<Button onClick={()=>asignarRespuesta(accion.id)} Icon={UserPlusIcon} disabled={!userNameAsignado}
		title={user?.rol === users_rol_enum.FUNCIONARIO ? 'Auto-asignarse' : `${accion.usuarioAsignado ? 'Rea':'A'}signar responsable`}/>
	</div>}
  </div>)
}

export default UsuarioAsignado
