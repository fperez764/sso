import { SetStateAction, useEffect, useState } from 'react';
import { Areas, SolicitudRespuesta, ClienteSolicitud } from "../../../types/typesSSO";
import ComboBox from '../ComboBox';
import Input from "../Input";
import InputA from "../InputA";

interface Props{
    resp? : SolicitudRespuesta|null;
    ss: ClienteSolicitud;
    handleCancel: ()=>void;
}

export default function NuevaRespuestaWidget({resp, ss, handleCancel} : Props) {
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
      <InputA value={accion}  handleChange={(e: kEvent) => setAccion(e.target.value)} placeholder={`Acción ${resp.orden}`} error={errors?.accion} type='string'/>
      <ComboBox setData={setArea} value={area ?? ''} options={Object.values(Areas)} postName='Areas'/>
    </Input>
    : null

  );
}