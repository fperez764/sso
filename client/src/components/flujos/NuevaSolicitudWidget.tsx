import { SetStateAction, useState } from 'react';
import { Cliente, ClienteSolicitud, ClienteServicioTicket, SolicitudGrupo } from "../../../types/typesSSO";
import Input from "../Input";
import InputB from "../InputB";
import SearchBar from '../SearchBar';
import ComboBox from '../ComboBox';

interface Props{
    ss? : ClienteSolicitud | null;
    handleCancel: () => void;
}

export default function NuevaSolicitud({ss, handleCancel} : Props) {
    const postName = 'Solicitud Servicio'
    const endpoint='/solicitudes'

	const getBody = () => {
        if(fClientes.length !== 1) return {};
        return {
                idCliente:fClientes[0].id,
                descripcion,
                prepagado,
                origen: 'Cliente SSO',
                nombreGrupo,
                nombreServicio,
        };
	}

    const [errors, setErrors] = useState<any>(null);
    const [fClientes, setFClientes] = useState<Cliente[]>([]);
    const [descripcion, setDescripcion] = useState(ss ? ss.descripcion : '');
    const [prepagado, setPrepagado] = useState(ss && 'prepagado' in ss ? ss.prepagado : false);
    const [nombreGrupo, setNombreGrupo] = useState<SolicitudGrupo|string>('');
    const [nombreServicio, setNombreServicio] = useState(ss && 'servicio' in ss ? ss.servicio.nombre : ss?.clienteServicio.servicio.nombre);
    type kEvent = { target: { value: SetStateAction<string>}};
//TODO: Replace for usereducer dev.to/builderio/a-cure-for-react-usestate-hell-1ldi

    const handleClean = () => {
        setFClientes([]);
        setDescripcion('');
        setPrepagado(true);
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
                searchEndpoint='/clientes'
            />
            <InputB value={descripcion}  handleChange={setDescripcion} placeholder='Descripcion' error={errors?.descripcion} type='string'/>
            {ss && 'prepagado' in ss && <label>{!!prepagado ? 'Prepagado':'Por pagar'}
                <input className='mx-3 ml-2' type="checkbox" defaultChecked={!!prepagado} onChange={()=>setPrepagado(!prepagado)}/>
            </label>}
            <ComboBox
                setData={setNombreGrupo} 
                filterKey='nombre' 
                postName = 'Grupo'
                searchEndpoint='/grupoSolicitudes'
            />
            <ComboBox
                setData={setNombreServicio} 
                filterKey='nombre' 
                postName = 'Servicio'
                searchEndpoint='/servicios'
            />
        </Input>
  )}