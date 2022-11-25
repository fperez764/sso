import { SetStateAction, useState } from 'react';
import { Cliente, SolicitudServicio } from "../../../types/typesSSO";
import Input from "../Input";
import InputA from "../InputA";
import SearchBar from '../SearchBar';

interface Props{
    ss? : SolicitudServicio | null;
    handleCancel: () => void;
}

export default function NuevoSSWidget({ss, handleCancel} : Props) {
    const postName = 'Solicitud Servicio'
    const endpoint='/solicitudservicio'

	const getBody = () => {
        if(fClientes.length !== 1) return {};
        return {
                idCliente:fClientes[0].id,
                descripcion,
                prepagado,
                origen: 'Cliente SSO',
                tipoSolicitud: tipo,
                nombreGrupo,
                nombreServicio,
        };
	}

    const [errors, setErrors] = useState<any>(null);
    const [fClientes, setFClientes] = useState<Cliente[]>([]);
    const [descripcion, setDescripcion] = useState(ss ? ss.descripcion : '');
    const [prepagado, setPrepagado] = useState(ss ? ss.prepagado : '');
    const [tipo, setTipo] = useState(ss ? ss.tipo : '');
    const [nombreGrupo, setNombreGrupo] = useState(ss && ss.grupo ? ss.grupo.name : '');
    const [nombreServicio, setNombreServicio] = useState(ss ? ss.servicio.nombre : '');
    type kEvent = { target: { value: SetStateAction<string>}};

    const handleClean = () => {
        setFClientes([]);
        setDescripcion('');
        setPrepagado(true);
        setTipo('');
        setNombreGrupo('');
        setNombreServicio('');
    }

  return (
        <Input 
            handleClean={handleClean}
            handleCancel={handleCancel}
            postName = {postName}
            body={getBody()}
            endpoint={endpoint}
            setErrors={setErrors}
            editar={!!ss}
        >
            <SearchBar
                data={fClientes} 
                setData={setFClientes} 
                filterKey='nombreCompleto' 
                postName = 'Cliente'
                searchEndpoint='/cliente'
            />
            <InputA value={descripcion}  handleChange={(e: kEvent) => setDescripcion(e.target.value)} placeholder='Descripcion' error={errors?.descripcion} type='string'/>
            <label>{!!prepagado ? 'Prepagado':'Por pagar'}
                <input className='ml-2 mx-3' type="checkbox" defaultChecked={!!prepagado} onChange={()=>setPrepagado(!prepagado)}/>
            </label>
            <InputA value={tipo} handleChange={(e: kEvent) => setTipo(e.target.value)} placeholder='Tipo Solicitud' error={errors?.tipo} type='string'/>
            <InputA value={nombreGrupo} handleChange={(e: kEvent) => setNombreGrupo(e.target.value)} placeholder='Nombre Grupo' error={errors?.nombreGrupo} type='string'/>
            <InputA value={nombreServicio} handleChange={(e: kEvent) => setNombreServicio(e.target.value)} placeholder='Nombre Servicio' error={errors?.nombreServicio} type='string'/>
        </Input>
  )}