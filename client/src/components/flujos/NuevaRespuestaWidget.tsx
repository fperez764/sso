import { SetStateAction, useEffect, useState } from 'react';
import { Areas, Respuesta, ClienteSolicitud, ClienteServicioTicket } from "../../../types/typesSSO";
import ComboBox from '../ComboBox';
import Input from "../Input";
import InputB from "../InputB";

interface Props{
    resp? : Respuesta|null;
    ss: ClienteSolicitud|ClienteServicioTicket;
    handleCancel: ()=>void;
    handleFeederRefresh: ()=>void;
}

export default function NuevaRespuestaWidget({resp, ss, handleCancel, handleFeederRefresh} : Props) {
    const [accion, setAccion] = useState(resp?.accion || undefined);
    const [area, setArea] = useState(resp?.area || undefined);
    const [errors, setErrors] = useState<any>({});
    type kEvent = { target: { value: SetStateAction<string>}};

    const handleLimpiarForm = () => {
      setAccion('');
      setArea('');
      setErrors({});
    }

    useEffect(() => {
        setArea(resp?.area);
        setAccion(resp?.accion);
      }, [resp]);

	const getBody = () => {
        return resp ? {
            estado: 'PENDIENTE',
            respuesta: '',
            accion,
            area,
            clienteSolicitud: ss,  
            orden: resp.orden,
            } : null;
	}

  return (
    resp
    ? <Input 
      handleCancel={handleCancel} 
      handleClean={handleLimpiarForm}  
      postName='Respuesta' 
      getBody={() => getBody} 
      endpoint={`/${ss.id}/respuestas`} 
      setErrors={setErrors}
      editar={!!resp}
    >
      <InputB value={accion}  handleChange={setAccion} placeholder={`Acción ${resp.orden}`} error={errors?.accion} type='string'/>
      <ComboBox setData={setArea} value={area ?? ''} options={Object.values(Areas)} postName='Areas'/>
    </Input>
    : null

  );
}