import InputB from "../InputB";
import ComboBox from "../ComboBox";
import { FlujoRespuesta } from "../../../types/typesSSO";
import { useEffect, useState } from "react";
import { CheckCircleIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useAuthState } from "../../context/auth";
import { toast } from "react-hot-toast";
import toastCard from "../ToastCard";

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
    let nResp = respuesta;
    nResp.accion = accion;
    nResp.area = area;
    nResp.vigenciaDias = vigencia;
    setEditar(false);
    handleEdit(nResp);
  }

  const confirmarEliminar = ( <div className={`flex flex-col w-full h-full overflow-hidden rounded items-center`}>
      <p className="font-bold">No. {respuesta.orden}</p>
      <p className="font-bold">{area}</p>
      <p className="">{accion}</p>
      <div className='flex space-x-2 mt-3'>
      </div>
    </div>);

  return (
    <div className={`flex flex-col items-center w-1/2 bg-gray-100 py-3 rounded-xl`}>
      <div className="flex">
        <p className="text-xs font-bold">{respuesta.orden}</p>
        <img
            className='rounded-full h-16 w-16 bg-blue-300'
            src={`/images/areas/${area || 'ADD'}.png`}
            alt={area || 'usuario-area'}
        />
        {user && <>
          {editar ? <CheckCircleIcon className='w-8 h-8 absolute ml-24 text-green-400 font-bold' onClick={guardarAccion}/>
          : <PencilSquareIcon className='w-8 h-8 absolute ml-24 text-blue-400 font-bold' onClick={() => setEditar(true)}/>}
          {!!handleDelete && <TrashIcon className='w-8 h-8 absolute ml-32 text-red-400 font-bold' 
          onClick={() => toastCard(confirmarEliminar, 'Estas seguro que deseas eliminar esta acción?', () => handleDelete(respuesta))}/>}
        </>}
      </div>
        { editar && user 
          ? <div className={`w-full mt-3 flex-col text-center`}>
            <ComboBox setData={setArea} value={area} postName = 'Areas' searchEndpoint='/auth/areas' />
            <InputB placeholder='Acción' type='string' value={accion} handleChange={setAccion}/>
            <InputB placeholder='Vigencia' type='number' value={vigencia} handleChange={setVigencia}/>
          </div> 
          : <div className={`w-full mt-3 flex-col text-center rounded-lg`} onClick={()=>toast.error('Inicia sesión para editar o agregar nuevo flujo.')}>
            <p className='text-lg font-bold mb-2'>{area}</p>
            <p className="bg-gray-300 text-start mx-3 pl-3 rounded-md text-md">{accion}</p>
            <p>{`Vigencia: ${vigencia} día${vigencia > 1 ? 's':''}`}</p>
          </div>
        }
    </div>
  )
}

export default NuevaAccionFlujo
