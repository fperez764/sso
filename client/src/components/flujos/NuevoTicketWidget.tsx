import { SetStateAction, useEffect, useState } from 'react';
import { Cliente, ClienteServicioTicket, ClienteServicio, SeveridadTicket, TicketGrupo } from "../../../types/typesSSO";
import Input from "../Input";
import SearchBar from '../SearchBar';
import ComboBox from '../ComboBox';
import ClienteCard from '../cliente/ClienteCard';
import InputB from '../InputB';
import { toast } from 'react-hot-toast';

interface Props{
    ticket? : ClienteServicioTicket | null;
    handleCancel: () => void;
    clienteServicio: ClienteServicio| null;
    handleRefresh: () => void;
}

export default function NuevoTicket({ticket, clienteServicio, handleCancel, handleRefresh} : Props) {
    const postName = 'Ticket'
    const endpoint='/tickets'

	const getBody = () => {
        const body = {
            idClienteServicio: clienteServicio ? clienteServicio.id : cliSerSeleccionado?.id,
            descripcion: descripcion,
            origen: 'Cliente SSO',
            nombreGrupo,
            telefonoContacto: telefono,
            nombreContacto: nombre,
            direccion,
            severidad
        };
        console.log(body);
        return body;
	}

    const [errors, setErrors] = useState<any>(null);
    const [fClientes, setFClientes] = useState<Cliente[]>([]);
    const [cliSerSeleccionado, setClienteServicio] = useState<ClienteServicio | null>();
    const [nombre, setNombre] = useState(clienteServicio?.cliente.nombreCompleto || '');
    const [telefono, setTelefono] = useState(clienteServicio?.cliente.telefono || '');
    const [direccion, setDireccion]= useState(clienteServicio?.cliente.direccion || '');
    const [descripcion, setDescripcion] = useState(ticket ? ticket.descripcion : '');
    const [nombreGrupo, setNombreGrupo] = useState<TicketGrupo|string>('');
    const [severidad, setSeveridad] = useState(SeveridadTicket.BAJA);
    const [idNombreServicio, setIdNombreServicio] = useState('');
    type kEvent = { target: { value: SetStateAction<string>}};
//TODO: Replace for usereducer dev.to/builderio/a-cure-for-react-usestate-hell-1ldi

    const handleClean = () => {
        setFClientes([]);
        setDescripcion('');
        setNombreGrupo('');
        setNombre(clienteServicio?.cliente.nombreCompleto || '');
        setTelefono(clienteServicio?.cliente.telefono || '');
        setDireccion(clienteServicio?.cliente.direccion || '');
    }

    useEffect(()=>{
        try {
            setClienteServicio(fClientes[0].clienteServicios[0])
        } catch (error) {
            console.log('Cliente sin servicios');
        } },[fClientes]);  

    const setClienteServicioPorNombre = (idNombre: string) => {
        console.log('select servicio');
        if(!idNombre.includes(":")) return toast.error("Mal formato de servicio 'id:Nombre'. Contacte soporte");
        const cliServicio = fClientes[0].clienteServicios.find(cliSer => cliSer.id.toString() === idNombre.split(":")[0]);        
        if(!cliServicio) return toast.error("Mal formato de servicio 'id:Nombre'. Contacte soporte");
        setClienteServicio(cliServicio);
    }  

  return (
    <Input className='' handleRefresh={handleRefresh} handleClean={handleClean} handleCancel={handleCancel} postName={postName} getBody={getBody} endpoint={endpoint} setErrors={setErrors} editar={!!ticket}>
    {clienteServicio 
        ? <div>
            <h2 className='font-bold'>Cliente:</h2>
            <ClienteCard cliente={clienteServicio.cliente} /> 
        </div>
        : <SearchBar data={fClientes} setData={setFClientes} filterKey='nombreCompleto' postName = 'Cliente' searchEndpoint='/clientes' />
    }
    {clienteServicio || (fClientes.length === 1 && fClientes[0].clienteServicios.length > 0) 
        ? <div className='w-[90%] flex-col'>
            {clienteServicio 
                ? <div className='flex space-x-2'>
                    <h2 className='font-bold'>Crear ticket para servicio:</h2>
                    <p>{clienteServicio.servicio.nombre}</p>
                </div>
                : <div className={`${!cliSerSeleccionado && 'bg-red-500' }`} onClick={() => setClienteServicioPorNombre(idNombreServicio)}>
                    <ComboBox options={fClientes[0].clienteServicios.map(cliSer => cliSer.id + ': ' + cliSer.servicio.nombre)} postName='Servicios Activos' setData={setIdNombreServicio}/>
                </div>
            }
            <InputB value={descripcion}  handleChange={setDescripcion} placeholder='Descripcion' error={errors?.descripcion} type='string'/>
            <InputB value={nombre}  handleChange={setNombre} placeholder='Nombre de contacto' error={errors?.nombreContacto} type='string'/>
            <InputB value={telefono}  handleChange={setTelefono} placeholder='Telefono de contacto' error={errors?.telefonoContacto} type='number'/>
            <InputB value={direccion}  handleChange={setDireccion} placeholder='Dirección' error={errors?.direccion} type='string'/>
            <ComboBox setData={setNombreGrupo} filterKey='nombre' postName = 'Grupo' searchEndpoint='/grupoTickets' />
            <ComboBox options={Object.values(SeveridadTicket)} postName='Severidad' setData={setSeveridad}/>
        </div> 
        : fClientes.length > 0 && <p className='bg-red-500'>Cliente sin servicios asociados activos</p>
    }        
    </Input>
 )}