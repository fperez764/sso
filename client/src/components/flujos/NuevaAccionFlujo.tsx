import InputB from '../InputB';
import ComboBox from '../ComboBox';
import { FlujoRespuesta } from '../../../types/typesSSO';
import { useEffect, useState } from 'react';
import { CheckCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuthState } from '../../context/auth';
import { toast } from 'react-hot-toast';
import toastCard from '../ToastCard';

interface Props {
    respuesta: Partial<FlujoRespuesta>;
    handleEdit: any;
    handleDelete?: any;
}

function NuevaAccionFlujo({respuesta, handleEdit, handleDelete}: Props) {
  const { user } = useAuthState();
  const [area, setArea] = useState(respuesta.area);
  const [accion, setAccion] = useState(respuesta.accion);
  const [vigencia, setVigencia] = useState(respuesta.vigenciaDias || 1);
  const [editar, setEditar] = useState(!respuesta.accion || respuesta.accion.includes('cc'));

  useEffect(() => {
    setArea(respuesta.area);
    setAccion(respuesta.accion);
    setVigencia(respuesta.vigenciaDias || 1);
  },[respuesta]);

  const guardarAccion = () => {
    if(!accion || accion.length === 0) 
    {
      toast.error('No puedes confirmar una respuesta sin acción');
      return;}
    if(!area || area.length === 0){
      toast.error('Seleccione un area de atención para la respuesta');
      return;
    }
    const nResp = respuesta;
    nResp.accion = accion;
    nResp.area = area;
    nResp.vigenciaDias = vigencia;
    setEditar(false);
    handleEdit(nResp);
  }

  const confirmarEliminar = ( <div className='flex flex-col items-center w-full h-full overflow-hidden rounded'>
      <p className='font-bold'>No. {respuesta.orden}</p>
      <p className='font-bold'>{area}</p>
      <p className=''>{accion}</p>
      <div className='flex mt-3 space-x-2'>
      </div>
    </div>);

  return (
    <div className='flex flex-col items-center w-1/2 py-3 bg-gray-100 rounded-xl'>
      <div className='flex'>
        <p className='text-xs font-bold'>{respuesta.orden}</p>
        <img
            className='w-16 h-16 bg-blue-300 rounded-full'
            src={`/images/areas/${area || 'ADD'}.png`}
            alt={area || 'usuario-area'}
        />
        {user && <>
          {editar ? <CheckCircleIcon className='absolute w-8 h-8 ml-24 font-bold text-green-400' onClick={guardarAccion}/>
          : <PencilSquareIcon className='absolute w-8 h-8 ml-24 font-bold text-blue-400' onClick={() => setEditar(true)}/>}
          {!!handleDelete && <TrashIcon className='absolute w-8 h-8 ml-32 font-bold text-red-400' 
          onClick={() => toastCard(confirmarEliminar, 'Estas seguro que deseas eliminar esta acción?', () => handleDelete(respuesta))}/>}
        </>}
      </div>
        { editar && user 
          ? <div className='flex-col w-full mt-3 text-center'>
            <ComboBox setData={setArea} value={area} postName = 'Areas' searchEndpoint='/auth/areas' />
            <InputB placeholder='Acción' type='string' value={accion} handleChange={setAccion}/>
            <InputB placeholder='Vigencia' type='number' value={vigencia} handleChange={setVigencia}/>
          </div> 
          : <div className='flex-col w-full mt-3 text-center rounded-lg' onClick={()=>toast.error('Inicia sesión para editar o agregar nuevo flujo.')}>
            <p className='mb-2 text-lg font-bold'>{area}</p>
            <p className='pl-3 mx-3 bg-gray-300 rounded-md text-start text-md'>{accion}</p>
            <p>{`Vigencia: ${vigencia} día${vigencia > 1 ? 's':''}`}</p>
          </div>
        }
    </div>
  )
}

export default NuevaAccionFlujo
