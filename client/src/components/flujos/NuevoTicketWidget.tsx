import { SetStateAction, useEffect, useState } from 'react';
import { Cliente, ClienteServicioTicket, ClienteServicio, SeveridadTicket, TicketGrupo } from '../../../types/typesSSO';
import Input from '../Input';
import SearchBar from '../SearchBar';
import ComboBox from '../ComboBox';
import ClienteCard from '../cliente/ClienteCard';
import InputB from '../InputB';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Button from '../Button';

interface Props{
    ticket? : ClienteServicioTicket | null;
    clienteServicio: ClienteServicio| null;
    handleRefresh: () => void;
    setShowNew: () => void;
}

export default function NuevoTicket({ticket, clienteServicio, handleRefresh, setShowNew} : Props) {
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
    const [nombre, setNombre] = useState(clienteServicio?.cliente?.nombreCompleto || '');
    const [telefono, setTelefono] = useState(clienteServicio?.cliente?.telefono || '');
    const [direccion, setDireccion]= useState(clienteServicio?.cliente?.direccion || '');
    const [descripcion, setDescripcion] = useState(ticket ? ticket.descripcion : '');
    const [nombreGrupo, setNombreGrupo] = useState<TicketGrupo|string>('');
    const [severidad, setSeveridad] = useState(SeveridadTicket.BAJA);
    const [idNombreServicio, setIdNombreServicio] = useState('');
    const [coordenadas, setCoordenadas] = useState(process.env.NEXT_PUBLIC_COORDENADAS_ABE);
    const [mostrarMapa, setMostrarMapa] = useState(false);
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
            if(!clienteServicio) setClienteServicio(fClientes[0].clienteServicios[0]);
            getCliente();   
        } catch (error) {
            console.log('Cliente sin servicios');
        } },[fClientes]);  

    const getCliente = async () => {
        if(clienteServicio && !clienteServicio.cliente){
        const res = await axios.get('/clienteServicios/' + clienteServicio.id);
        setClienteServicio(res.data);
        }
    }

    const setClienteServicioPorNombre = (idNombre: string) => {
        console.log('select servicio');
        if(!idNombre.includes(':')) return toast.error('Mal formato de servicio "id:Nombre". Contacte soporte');
        const cliServicio = fClientes[0].clienteServicios.find(cliSer => cliSer.id.toString() === idNombre.split(':')[0]);        
        if(!cliServicio) return toast.error('Mal formato de servicio "id:Nombre". Contacte soporte');
        setClienteServicio(cliServicio);
    }  

    const buscarnombres = async () => {
        const res = await fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${coordenadas}&sensor=true&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`);
        const data = await res.json();
        if(data.results.length === 0){
            toast.error(`No se encontraron resultados para esas coordenadas, use el formato correcto:\nEjemplo:"${process.env.NEXT_PUBLIC_COORDENADAS_ABE}"`);
            setCoordenadas(process.env.NEXT_PUBLIC_COORDENADAS_ABE);
            return;
        }
        const direcciones = data.results.map((r: any) => r.formatted_address);
        console.log(direcciones);
        //Mostramos primer resultado + resultados con keywords: city, province
        const departamento = direcciones.filter((d: string) => d.includes('Department'))[0].replace(', Bolivia', '');
        const province = direcciones.filter((d: string) => d.includes('Province'))[0].replace(', Bolivia', '');
        setDireccion(`${data.results[0].formatted_address}; ${province}, ${departamento}`);
    }

  return (
    <Input className='' handleRefresh={handleRefresh} handleClean={handleClean} postName={postName} getBody={getBody} endpoint={endpoint} setErrors={setErrors} editar={!!ticket} setShowNew={setShowNew}>
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
            {cliSerSeleccionado && <p className='p-3 mt-2 border-2 border-gray-200 bg-slate-50'>{cliSerSeleccionado.contrato ? 'Con contrato': 'Sin contrato'}</p> }
            {cliSerSeleccionado && <p className='p-3 mt-2 border-2 border-gray-200 bg-slate-50'>Instalador: {cliSerSeleccionado.instalador}</p> }
            <InputB value={descripcion}  handleChange={setDescripcion} placeholder='Descripcion' error={errors?.descripcion} type='string'/>
            <InputB value={nombre}  handleChange={setNombre} placeholder='Nombre de contacto' error={errors?.nombreContacto} type='string'/>
            <InputB value={telefono}  handleChange={setTelefono} placeholder='Telefono de contacto' error={errors?.telefonoContacto} type='number'/>
            <InputB value={coordenadas}  handleChange={setCoordenadas} placeholder='Coordenadas' error={errors?.coordenadas} type='string'/>
            <Button title='Buscar coordenadas' onClick={buscarnombres}/>
            <InputB value={direccion}  handleChange={setDireccion} placeholder='Dirección' error={errors?.direccion} type='string'/>
            {!!idNombreServicio && <ComboBox setData={setNombreGrupo} filterKey='nombre' postName = 'Grupo' searchEndpoint={`/grupoTickets/${idNombreServicio.replace(/[^a-zA-Z]+/g, '')}`} />}
            <ComboBox options={Object.values(SeveridadTicket)} postName='Severidad' setData={setSeveridad}/>
            
        </div> 
        : fClientes.length > 0 && <p className='bg-red-500'>Cliente sin servicios asociados activos</p>
    }        
    </Input>
 );}