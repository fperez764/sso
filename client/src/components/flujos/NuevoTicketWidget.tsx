/** @format */

import { useEffect, useState } from 'react';
import { Cliente, ClienteServicioTicket, ClienteServicio, SeveridadTicket, TicketGrupo, OrigenTicket, ClienteServicioModem, getColorSeveridad } from '../../../types/typesSSO';
import Input from '../Input';
import SearchBar from '../SearchBar';
import ComboBox from '../ComboBox';
import ClienteCard from '../cliente/ClienteCard';
import InputB from '../InputB';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Button from '../Button';
import SelectComboBox from '../SelectComboBox';
import ModemsWidget from '../servicio/ModemsWidget';
import Link from 'next/link';

interface Props {
	ticket?: ClienteServicioTicket | null;
	clienteServicio: ClienteServicio | null;
	handleRefresh?: () => void;
	setShowNew?: () => void;
}

export default function NuevoTicket({ ticket, clienteServicio, handleRefresh, setShowNew }: Props) {
	const postName = 'Ticket';
	const endpoint = '/tickets';

	const [errors, setErrors] = useState<any>(null);
	const [fClientes, setFClientes] = useState<Cliente[]>([]);
	const [cliSerSeleccionado, setClienteServicio] = useState<ClienteServicio | null>(clienteServicio);
	const [nombre, setNombre] = useState(clienteServicio?.cliente?.nombreCompleto || '');
	const [telefono, setTelefono] = useState(clienteServicio?.cliente?.telefono || '');
	const [direccion, setDireccion] = useState(clienteServicio?.cliente?.direccion || '');
	const [descripcion, setDescripcion] = useState(ticket?.descripcion || '');
	const [origen, setOrigen] = useState(OrigenTicket.LINEA_GRATUITA);
	const [nombreGrupo, setNombreGrupo] = useState<TicketGrupo | string>('');
	const [severidad, setSeveridad] = useState(SeveridadTicket.BAJA);
	const [idNombreServicio, setIdNombreServicio] = useState(ticket ? ticket.clienteServicio?.servicio?.nombre : 'OTROS');
	const [modems, setModems] = useState<ClienteServicioModem[]>([]);
	const [coordenadas, setCoordenadas] = useState('');
	const [mostrarActContacto, setMostrarActContacto] = useState(false);

	const getBody = () => {
		const body = {
			idClienteServicio: clienteServicio ? clienteServicio.id : cliSerSeleccionado?.id,
			descripcion: descripcion,
			nombreGrupo,
			telefonoContacto: telefono,
			nombreContacto: nombre,
			direccion,
			severidad,
			origen,
			macModems: modems?.map((m) => m.mac),
		};
		return body;
	};

	const handleClean = () => {
		setFClientes([]);
		setDescripcion('');
		setNombreGrupo('');
		setNombre(clienteServicio?.cliente?.nombreCompleto || '');
		setTelefono(clienteServicio?.cliente?.telefono || '');
		setDireccion(clienteServicio?.cliente?.direccion || '');
	};

	useEffect(() => {
		if(ticket) return;
		try {
			if (!clienteServicio) setClienteServicio(fClientes[0].clienteServicios[0]);
			getCliente();
			if(!fClientes || fClientes.length === 0) handleClean();
		} catch (error) {
			console.error('Cliente sin servicios');
		}
	}, []);

	useEffect(()=>{
		if(!fClientes[0]) return;
		setNombre(fClientes[0].nombreCompleto || '');
		setDireccion(fClientes[0].direccion || '');
		setTelefono(fClientes[0]?.telefono || '');
	},[fClientes])

	const getCliente = async () => {
		if (clienteServicio && !clienteServicio.cliente) {
			const res = await axios.get('/clienteServicios/' + clienteServicio.id);
			setClienteServicio(res.data);
		}
		if(cliSerSeleccionado?.cliente)
		{
			setNombre(cliSerSeleccionado.cliente.nombreCompleto);
			setTelefono(cliSerSeleccionado.cliente?.telefono);
			setDireccion(cliSerSeleccionado.cliente.direccion);
		}
	};

	const setClienteServicioPorNombre = (idNombre: string) => {
		if (!idNombre.includes(':')) return toast.error('Mal formato de servicio "id:Nombre". Contacte soporte');
		const cliServicio = fClientes[0].clienteServicios.find((cliSer) => cliSer.id.toString() === idNombre.split(':')[0]);
		if (!cliServicio) return toast.error('Mal formato de servicio "id:Nombre". Contacte soporte');
		setClienteServicio(cliServicio);
	};

	const buscarCoordenadas = async () => {
		if(!process.env.NEXT_PUBLIC_GOOGLE_KEY) {
			toast.error('Servicio de coordenadas de google no disponible.');
			return;
		}
		const res = await fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${coordenadas}&sensor=true&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`);
		const data = await res.json();
		if (data.results.length === 0) {
			toast.error(`No se encontraron resultados para esas coordenadas, use el formato correcto:\nEjemplo:"${process.env.NEXT_PUBLIC_COORDENADAS_ABE}"`);
			return;
		}
		const direcciones = data.results.map((r: any) => r.formatted_address);
		//Mostramos primer resultado + resultados con keywords: city, province
		const departamento = direcciones.filter((d: string) => d.includes('Department'));
		const province = direcciones.filter((d: string) => d.includes('Province'));
		setDireccion(`${data.results[0].formatted_address} ${departamento.length > 0 && departamento[0]}/${province.length > 0 && province[0]}`);
	};

	return (
		<Input
			className="h-screen"
			handleRefresh={handleRefresh || console.info('No refresh')}
			handleClean={handleClean}
			postName={postName}
			getBody={getBody}
			endpoint={ `${endpoint}${ticket ? '/'+ticket.id : ''}` }
			setErrors={setErrors}
			editar={!!ticket}
			setShowNew={setShowNew || console.info('No close shownew')}
		>
			{clienteServicio ? (
				<div>
					<h2 className="font-bold">Cliente:</h2>
					<ClienteCard cliente={clienteServicio.cliente} />
				</div>
			) : (
				<SearchBar data={fClientes} setData={setFClientes} filterKey="nombreCompleto" postName="Cliente" searchEndpoint="/clientes" handleClean={handleClean} />
			)}
			{clienteServicio || (fClientes.length === 1 && fClientes[0].clienteServicios.length > 0) ? (
				<div className="w-[90%] flex-col">
					{clienteServicio ? (
						<div className="flex space-x-2">
							<h2 className="font-bold">Ticket para servicio:</h2>
							<p>{clienteServicio.servicio.nombre}</p>
						</div>
					) : (
						<div className={`${!cliSerSeleccionado && 'bg-red-500'}`} onClick={() => setClienteServicioPorNombre(idNombreServicio)}>
							<ComboBox options={fClientes[0].clienteServicios.map((cliSer) => cliSer.id + ': ' + cliSer.servicio.nombre)} postName="Servicios Activos" setData={setIdNombreServicio} />
						</div>
					)}
					{fClientes[0] && <div className="flex flex-col items-start h-16 ml-5 space-y-1 overflow-y-scroll">
						<p>Cliente con {fClientes[0].clienteServicios.reduce((total, cliSer) => total + cliSer.tickets.length, 0)} tickets:</p>
						{fClientes[0].clienteServicios?.map(cliSer => cliSer.tickets?.map(tick =>
						<Link href={`/tickets/${tick.id}`} className='m-0 hover:underline'>
							<p className={`bg-${getColorSeveridad(tick)} rounded-full px-2 text-center whitespace-nowrap`}>
								{tick.id}: {tick.descripcion}
							</p>
						</Link>
            		))}</div>}
					{cliSerSeleccionado && (
						<div className="">
							<InputB value={cliSerSeleccionado.contrato ? 'Con contrato' : 'Sin contrato'} placeholder="Contrato" type="string" disabled />
							<InputB value={cliSerSeleccionado?.instalador} placeholder="Instalador" type="string" disabled />
						</div>
					)}
					{cliSerSeleccionado?.modems && cliSerSeleccionado?.modems.length > 0 && (
						<>
							<p className="mt-3">Seleccione modems ({cliSerSeleccionado?.modems.length}) afectados:</p>
							<p className="text-xs">Si no selecciona ningun modem, se asumira que el problema es en todo el servicio</p>
							{!!cliSerSeleccionado && cliSerSeleccionado.modems?.length > 0 && (
								<SelectComboBox optionsValue={cliSerSeleccionado.modems.map((m) => `${m.hub}-${m.mac}${m.coordenadas ? ':'+m.coordenadas : ''}`)} optionsObject={cliSerSeleccionado.modems} setData={setModems} />
							)}
						</>
					)}
					{cliSerSeleccionado && <div>
					<p className="mt-6 font-bold ">Detalles ticket:{descripcion}</p>
					<InputB value={descripcion} handleChange={setDescripcion} placeholder="Descripcion" error={errors?.descripcion} type="string" />
					{!!idNombreServicio && <ComboBox setData={setNombreGrupo} filterKey="nombre" postName="Grupo" searchEndpoint={`/grupoTickets/servicio/${idNombreServicio.replace(/[^a-zA-Z]+/g, '')}`} />}
					<ComboBox options={Object.values(SeveridadTicket)} postName="Severidad" setData={setSeveridad} />
					<ComboBox options={Object.values(OrigenTicket)} postName="Origen" setData={setOrigen} />
					<p className="mt-6 mb-3 font-bold cursor-pointer hover:underline" onClick={()=>setMostrarActContacto(!mostrarActContacto)}>Actualizar Contacto ticket (Opcional):</p>
					{ <>
					<InputB value={nombre} handleChange={setNombre} placeholder="Nombre de contacto" error={errors?.nombreContacto} type="string" />
					<InputB value={telefono} handleChange={setTelefono} placeholder="Telefono de contacto" error={errors?.telefonoContacto} type="number" />				
					<InputB value={direccion} handleChange={setDireccion} placeholder="Dirección" error={errors?.direccion} type="string" />
					<div className="flex">
						<p>Opcional: </p>
						<Button title="Actualizar dirección por coordenadas" onClick={buscarCoordenadas} />
						<InputB value={coordenadas} handleChange={setCoordenadas} placeholder="Coordenadas" error={errors?.coordenadas} type="string" className='w-1/2'/>
					</div>
					</>}
					</div>}
				</div>
			) : (
				fClientes.length > 0 && <p className="bg-red-500">Cliente sin servicios asociados activos</p>
			)}
			{ticket && <p className='font-bold text-red-800'>Tomar en cuenta que si el grupo cambia el flujo de acciones ya creado se mantendra</p>}
		</Input>
	);
}
