import { SetStateAction, useState } from 'react';
import { Cliente } from "../../../types/typesSSO";
import ComboBox from "../ComboBox";
import Input from "../Input";
import InputA from "../InputA";

interface Props{
    cliente? : Cliente|null;
    handleCancel: () => void;
}
export default function NuevoClienteWidget({cliente, handleCancel} : Props) {
    const [errors, setErrors] = useState<any>({});

    const getBody = () => {return ({
        nombreCompleto,
        nroDocumento,
        nroDocumentoFacturacion,
        tipoDocumento,
        telefono,
        email,
        razonSocial,
        direccion
      });
    }

    const handleLimpiarForm = () => {
        setNombreCompleto('');
        setNroDocumento('');
        setTipoDocumento('');
        setRazonSocial('');
        setNroFacturacion('');
        setEmail('');
        setDireccion('');
    }

    const [nombreCompleto, setNombreCompleto] = useState(cliente?.nombreCompleto || '');
    const [nroDocumento, setNroDocumento] = useState(cliente?.nroDocumento || '');
    const [tipoDocumento, setTipoDocumento] = useState<string>(cliente?.tipoDocumentoFacturacion || 'NIT');
    const [razonSocial, setRazonSocial] = useState(cliente?.razonSocial || '');
    const [nroDocumentoFacturacion, setNroFacturacion] = useState(cliente?.nroDocumentoFacturacion || '');
    const [email, setEmail] = useState(cliente?.email || '');
    const [telefono, setTelefono] = useState(cliente?.telefono || '');
    const [direccion, setDireccion] = useState(cliente?.direccion || '');
    type kEvent = { target: { value: SetStateAction<string>}};
    const postName = 'Cliente';
    const postEndpoint = '/clientes';
    
  return (
        <Input 
            handleClean={handleLimpiarForm}  
            handleCancel={handleCancel}
            postName={postName}
            editar={!!cliente}
            getBody={getBody} 
            endpoint={postEndpoint}
            setErrors={setErrors}
        >
            <InputA value={nombreCompleto} handleChange={(e: kEvent) => setNombreCompleto(e.target.value)} placeholder='Nombre Completo' error={errors?.nombreCompleto} type='string'/>
            <InputA value={nroDocumento} handleChange={(e: kEvent) => setNroDocumento(e.target.value)} placeholder='Nro. Documento' error={errors?.nroDocumento} type='number'/>
            <InputA value={razonSocial}  handleChange={(e: kEvent) => setRazonSocial(e.target.value)} placeholder='Razon Social' error={errors?.razonSocial} type='string'/>
            <InputA value={nroDocumentoFacturacion} handleChange={(e: kEvent) => setNroFacturacion(e.target.value)} placeholder='Facturar a:' error={errors?.nroDocumentoFacturacion} type='number'/>
            <ComboBox setValue={setTipoDocumento} value={tipoDocumento} options={['CI','NIT','CEX','OTRO']} placeholder='Tipo documento'/>
            <InputA value={email} handleChange={(e: kEvent) => setEmail(e.target.value)} placeholder='Correo' error={errors?.email} type='email'/>
            <InputA value={telefono} handleChange={(e: kEvent) => setTelefono(e.target.value)} placeholder='Telefono' error={errors?.telefono} type='number'/>
            <InputA value={direccion} handleChange={(e: kEvent) => setDireccion(e.target.value)} placeholder='Dirección' error={errors?.direccion} type='string'/>
        </Input>
  )}