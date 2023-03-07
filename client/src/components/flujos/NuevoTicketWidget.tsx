import { SetStateAction, useState } from 'react';
import { Cliente, ClienteSolicitud, ClienteServicioTicket, SolicitudGrupo, ClienteServicio } from "../../../types/typesSSO";
import Input from "../Input";
import InputA from "../InputA";
import SearchBar from '../SearchBar';
import ComboBox from '../ComboBox';
import ClienteCard from '../cliente/ClienteCard';

interface Props{
    ss? : ClienteServicioTicket | null;
    handleCancel: () => void;
    clienteServicio: ClienteServicio| null;
}

export default function NuevaSolicitud({ss, clienteServicio, handleCancel} : Props) {
    const postName = 'Ticket'
    const endpoint='/tickets'

	const getBody = () => {
        if(!clienteServicio && fClientes.length !== 1) return {};
        const body = {
                idClienteServicio: clienteServicio ? clienteServicio.id : fClienteServicios[0].id,
                descripcion,
                origen: 'Cliente SSO',
                nombreGrupo,
        };
        console.log(body);
        return body;
	}

    const [errors, setErrors] = useState<any>(null);
    const [fClientes, setFClientes] = useState<Cliente[]>([]);
    const [fClienteServicios, setClienteServicios] = useState<ClienteServicio[]>([]);
    const [descripcion, setDescripcion] = useState(ss ? ss.descripcion : '');
    const [prepagado, setPrepagado] = useState(ss && 'prepagado' in ss ? ss.prepagado : false);
    const [nombreGrupo, setNombreGrupo] = useState<SolicitudGrupo|string>('');
    type kEvent = { target: { value: SetStateAction<string>}};
//TODO: Replace for usereducer dev.to/builderio/a-cure-for-react-usestate-hell-1ldi

    const handleClean = () => {
        setFClientes([]);
        setDescripcion('');
        setPrepagado(true);
        setNombreGrupo('');
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
            {clienteServicio 
            ? <div>
                {clienteServicio.cliente.nombreCompleto}
                <ClienteCard cliente={clienteServicio.cliente}/> 
                <p>{clienteServicio.servicio.nombre}: {clienteServicio.servicio.id}</p>
            </div>
            : <SearchBar
                data={fClientes} 
                setData={setFClientes} 
                filterKey='nombreCompleto' 
                postName = 'Cliente'
                searchEndpoint='/clientes'
            />}
            <InputA value={descripcion}  handleChange={(e: kEvent) => setDescripcion(e.target.value)} placeholder='Descripcion' error={errors?.descripcion} type='string'/>
            {ss && 'prepagado' in ss && <label>{!!prepagado ? 'Prepagado':'Por pagar'}
                <input className='mx-3 ml-2' type="checkbox" defaultChecked={!!prepagado} onChange={()=>setPrepagado(!prepagado)}/>
            </label>}
            <ComboBox
                setData={setNombreGrupo} 
                filterKey='nombre' 
                postName = 'Grupo'
                searchEndpoint='/grupoTickets'
            />
        </Input>
  )}