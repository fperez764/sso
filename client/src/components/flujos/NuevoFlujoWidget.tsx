import { SetStateAction, useState } from 'react';
import { Cliente, ClienteSolicitud, ServicioTicket } from "../../../types/typesSSO";
import Input from "../Input";
import InputA from "../InputA";
import SearchBar from '../SearchBar';

interface Props{
    ss? : ClienteSolicitud | ServicioTicket | null;
    handleCancel: () => void;
}

export default function NuevoFlujo({ss, handleCancel} : Props) {
    const postName = 'Solicitud Servicio'
    const endpoint='/solicitudservicios'

	const getBody = () => {
        if(fClientes.length !== 1) return {};
        return {
                idCliente:fClientes[0].id,
                descripcion,
                prepagado,
                origen: 'Cliente SSO',
                tipo,
                nombreGrupo,
                nombreServicio,
        };
	}

    const [errors, setErrors] = useState<any>(null);
    const [fClientes, setFClientes] = useState<Cliente[]>([]);
    const [descripcion, setDescripcion] = useState(ss ? ss.descripcion : '');
    const [prepagado, setPrepagado] = useState(ss && 'prepagado' in ss ? ss.prepagado : false);
    const [tipo, setTipo] = useState(ss ? ss.tipo : '');
    const [nombreGrupo, setNombreGrupo] = useState(ss && ss.grupo ? ss.grupo.nombre : '');
    const [nombreServicio, setNombreServicio] = useState(ss && 'servicio' in ss ? ss.servicio.nombre : ss?.clienteServicio.servicio.nombre);
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
            getBody={getBody}
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
            {ss && 'prepagado' in ss && <label>{!!prepagado ? 'Prepagado':'Por pagar'}
                <input className='mx-3 ml-2' type="checkbox" defaultChecked={!!prepagado} onChange={()=>setPrepagado(!prepagado)}/>
            </label>}
            <InputA value={tipo} handleChange={(e: kEvent) => setTipo(e.target.value)} placeholder='Tipo Solicitud' error={errors?.tipo} type='string'/>
            <InputA value={nombreGrupo} handleChange={(e: kEvent) => setNombreGrupo(e.target.value)} placeholder='Nombre Grupo' error={errors?.nombreGrupo} type='string'/>
            <InputA value={nombreServicio} handleChange={(e: kEvent) => setNombreServicio(e.target.value)} placeholder='Nombre Servicio' error={errors?.nombreServicio} type='string'/>
        </Input>
  )}