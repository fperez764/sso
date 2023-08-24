import { SetStateAction, useState } from 'react';
import { Cliente, ClienteSolicitud, ClienteServicioTicket, FlujoSolicitud } from '../../../types/typesSSO';
import Input from '../Input';
import InputB from '../InputB';
import SearchBar from '../SearchBar';
import ComboBox from '../ComboBox';

interface Props{
    ss? : ClienteSolicitud | null;
}

export default function NuevaSolicitud({ ss } : Props) {
    const postName = 'Solicitud Servicio';
    const endpoint='/solicitudes';

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
	};

    const [errors, setErrors] = useState<any>(null);
    const [fClientes, setFClientes] = useState<Cliente[]>([]);
    const [descripcion, setDescripcion] = useState(ss?.descripcion || '');
    const [prepagado, setPrepagado] = useState(ss?.prepagado);
    const [nombreGrupo, setNombreGrupo] = useState<FlujoSolicitud|string>('');
    const [nombreServicio, setNombreServicio] = useState(ss?.servicio?.nombre || '');

    const handleClean = () => {
        setFClientes([]);
        setDescripcion('');
        setPrepagado(true);
        setNombreGrupo('');
        setNombreServicio('');
    };

  return (
        <Input 
            handleClean={handleClean}
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
            <InputB value={descripcion}  handleChange={setDescripcion} placeholder='Descripcion' errors={errors} type='string'/>
            {ss && 'prepagado' in ss && <label>{!!prepagado ? 'Prepagado':'Por pagar'}
                <input className='mx-3 ml-2' type='checkbox' defaultChecked={!!prepagado} onChange={()=>setPrepagado(!prepagado)}/>
            </label>}
            <ComboBox
                setData={setNombreGrupo} 
                filterKey='nombre' 
                postName = 'Flujos'
                searchEndpoint='/flujosSolicitudes'
            />
            <ComboBox
                setData={setNombreServicio} 
                filterKey='nombre' 
                postName = 'Servicio'
                searchEndpoint='/servicios'
            />
        </Input>
  );
};