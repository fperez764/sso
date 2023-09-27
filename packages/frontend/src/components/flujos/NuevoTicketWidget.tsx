import { useEffect, useState } from 'react';
import { Cliente, ClienteServicioTicket, ClienteServicio, FlujoTicket, ClienteServicioModem, cliente_servicio_ticket_severidad_enum } from '../../../types/typesSSO';
import Input from '../ui/Input';
import SearchBar from '../ui/SearchBar';
import ComboBox from '../ui/ComboBox';
import ClienteCard from '../cliente/ClienteCard';
import InputB from '../ui/InputB';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Button from '../ui/Button';
import SelectComboBox from '../ui/SelectComboBox';
import Link from 'next/link';
import { getColorSeveridad } from '../../utils/common';
import ClienteInfo from '../cliente/ClienteInfo';

interface Props {
	ticket?: ClienteServicioTicket | null;
	clienteServicio: ClienteServicio | null;
	handleRefresh?: () => void;
	setShowNew?: () => void;
}
export enum OrigenTicket {
	LINEA_GRATUITA = 'LINEA GRATUITA',
	WHATSAPP = 'WHATSAPP',
	CORREO = 'CORREO',
	OTRO = 'OTRO',
}

export default function NuevoTicket({ ticket, clienteServicio, handleRefresh, setShowNew }: Props) {
	const postName = 'Ticket';
	const endpoint = '/tickets';
	const [errors, setErrors] = useState<any>(null);
	const [fClientes, setFClientes] = useState<Cliente[]>([]);
	const [cliSerSeleccionado, setClienteServicio] = useState<ClienteServicio | null>(clienteServicio);
	const [nombre, setNombre] = useState(clienteServicio?.cliente?.contactos[0]?.nombreCompleto || ticket?.nombreContacto ||'');
	const [telefono, setTelefono] = useState(clienteServicio?.cliente?.contactos[0]?.telefono || ticket?.telefonoContacto ||'');
	const [direccion, setDireccion] = useState(clienteServicio?.cliente?.contactos[0]?.direccion || ticket?.direccion ||'');
	const [descripcion, setDescripcion] = useState(ticket?.descripcion || '');
	const [origen, setOrigen] = useState(OrigenTicket.LINEA_GRATUITA);
	const [nombreFlujo, setNombreFlujo] = useState<FlujoTicket | string>('');
	const [severidad, setSeveridad] = useState(ticket?.severidad || cliente_servicio_ticket_severidad_enum.BAJA);
	const [idNombreServicio, setIdNombreServicio] = useState(ticket ? ticket.clienteServicio?.nombreServicio : 'OTROS');
	const [modems, setModems] = useState<ClienteServicioModem[]>([]);
	const [latitud, setLatitud] = useState(ticket?.coordenadas?.split(',')[0] || '');
	const [longitud, setLongitud] = useState(ticket?.coordenadas?.split(',')[1] || '');
		const [mostrarActContacto, setMostrarActContacto] = useState(false);

	const getBody = () => {
		if(latitud === '' || longitud === ''){
			toast.error('Longitud y latitud es obligatoria');
			return;
		}
		const body = {
			idClienteServicio: clienteServicio ? clienteServicio.id : cliSerSeleccionado?.id,
			descripcion: descripcion,
			nombreFlujo,
			telefonoContacto: telefono,
			nombreContacto: nombre,
			direccion,
			severidad,
			origen,
			coordenadas: `${latitud},${longitud}`,
			modems: modems
		};
		return body;
	};

	const handleClean = () => {
		setFClientes([]);
		setDescripcion('');
		setNombreFlujo('');
		setNombre(clienteServicio?.cliente?.contactos[0]?.nombreCompleto || '');
		setTelefono(clienteServicio?.cliente?.contactos[0]?.telefono || '');
		setDireccion(clienteServicio?.cliente?.contactos[0]?.direccion || '');
		setLatitud(ticket?.coordenadas?.split(',')[0] || '');
		setLongitud(ticket?.coordenadas?.split(',')[1] || '');
	};

	useEffect(() => {
		if(idNombreServicio) getCliente(idNombreServicio.split(':')[0]);
	}, [idNombreServicio]);

	useEffect(() => {
		if(modems.length > 0){
			const modemCoord = modems.find((m) => !!m.coordenadas);
			if(!modemCoord) return;
			setLatitud(modemCoord?.coordenadas?.split(',')[0] || '');
			setLongitud(modemCoord?.coordenadas?.split(',')[1] || '');
		}
	}, [modems]);
	
	const getCliente = async (idClienteServicio: string) => {
		if(!idClienteServicio) return;
		try {
			const res = await axios.get('/clienteServicios/' + idClienteServicio);
			console.log('getClienteServicio' + idClienteServicio, res);
			if (res.data?.cliente || fClientes[0]) {
				setNombre(res.data?.cliente?.nombreCompleto || fClientes[0].contactos[0]?.nombreCompleto);
				setTelefono(res.data?.cliente?.telefono || fClientes[0].contactos[0]?.telefono);
				setDireccion(res.data?.cliente?.direccion || fClientes[0].contactos[0]?.direccion);
			}
			setClienteServicioPorNombre(res.data.id);
		} catch (error) {
			console.error('No se pudo obtener datos de clienteServicio');
		}
	};

	const setClienteServicioPorNombre = (idNombre: string) => {
		if (!idNombre.includes(':')) return toast.error('Mal formato de servicio "id:Nombre". Contacte soporte');
		const cliServicio = fClientes[0].clienteServicios.find((cliSer) => cliSer.id.toString() === idNombre.split(':')[0]);
		if (!cliServicio) return toast.error('Mal formato de servicio "id:Nombre". Contacte soporte');
		setClienteServicio(cliServicio);
		if(cliServicio.tickets){
			const lastTicket = cliServicio.tickets.sort((a, b) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())[0];
			console.log(lastTicket);
			setLatitud(lastTicket?.coordenadas?.split(',')[0] || '');
			setLongitud(lastTicket?.coordenadas?.split(',')[1] || '');
		}
	};

	const buscarCoordenadas = async () => {
		if (!process.env.NEXT_PUBLIC_GOOGLE_KEY) {
			toast.error('Servicio de coordenadas de google no disponible.');
			return;
		}
		const res = await fetch(`http://maps.googleapis.com/maps/api/geocode/json?latlng=${latitud},${longitud}&sensor=true&key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`);
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
			endpoint={`${endpoint}${ticket ? '/' + ticket.id : ''}`}
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
				<SearchBar data={fClientes} setData={setFClientes} filterKeyId='razonSocial' filterKey="Nombre o razon social de cliente" postName="Cliente" searchEndpoint="/clientes/contactos" handleClean={handleClean} />
			)}
			{clienteServicio || (fClientes.length === 1 && fClientes[0].clienteServicios?.length > 0) ? (
				<div className="w-[90%] flex-col">
					{clienteServicio ? (
						<div className="flex space-x-2">
							<h2 className="font-bold">Ticket para servicio:</h2>
							<p>{clienteServicio.nombreServicio}</p>
						</div>
					) : (
						<div className={`${!cliSerSeleccionado && 'bg-red-500'}`} onClick={() => setClienteServicioPorNombre(idNombreServicio)}>
							<ComboBox options={fClientes[0].clienteServicios.map((cliSer) => `${cliSer.id}: ${cliSer.nombreServicio}${cliSer.fechaBaja ? ' (Baja)' : ''}`)} postName="Servicios" setData={setIdNombreServicio} />
						</div>
					)}
					{fClientes[0] && (
						<div className="flex flex-col items-start h-16 mt-2 ml-2 space-y-1 overflow-y-scroll">
							<p>{fClientes[0].clienteServicios.reduce((total, cliSer) => total + cliSer.tickets.length, 0)} Tickets:</p>
							{fClientes[0].clienteServicios?.map((cliSer) =>
								cliSer.tickets?.map((tick) => (
									<Link href={`/tickets/${tick.id}`} key={tick.id} className="m-0 hover:underline">
										<p className={`bg-${getColorSeveridad(tick)} rounded-full px-2 text-center whitespace-nowrap`}>
											{cliSer.nombreServicio} - {tick.id}: {tick.descripcion}
										</p>
									</Link>
								)),
							)}
						</div>
					)}
					{cliSerSeleccionado && (
						<ClienteInfo cliente={fClientes[0]}/>
					)}
					{cliSerSeleccionado && (
						<div>
							<p className="mt-6 text-xl font-bold">Detalles ticket:</p>
							{!!idNombreServicio && <ComboBox setData={setNombreFlujo} filterKey="nombre" postName="Flujo" searchEndpoint={`/flujosTickets/servicios/${idNombreServicio.replace(/[^a-zA-Z]+/g, '')}`} />}
							<InputB value={descripcion} handleChange={setDescripcion} placeholder="Descripcion" errors={errors} type="string" />
							{cliSerSeleccionado?.modems && cliSerSeleccionado?.modems.length > 0 && (
							<>
								<p className="mt-3">Seleccione modems ({cliSerSeleccionado?.modems.length}) afectados:</p>
								<p className="text-xs">Si no selecciona ningun modem, se asumira que el problema es en todo el servicio</p>
								{!!cliSerSeleccionado && cliSerSeleccionado.modems?.length > 0 && (
									<SelectComboBox
										optionsValue={cliSerSeleccionado.modems.map((m) => `${m.hub || ''} ${m.mac}${m.coordenadas ? ':' + m.coordenadas : ''}`)}
										optionsObject={cliSerSeleccionado.modems}
										setData={setModems}
									/>
								)}
							</>
						)}
							<ComboBox value={severidad} options={Object.values(cliente_servicio_ticket_severidad_enum)} postName="Severidad" setData={setSeveridad} />
							<ComboBox value={origen} options={Object.values(OrigenTicket)} postName="Origen" setData={setOrigen} />
							<p className="mt-6 mb-3 text-xl font-bold cursor-pointer hover:underline" onClick={() => setMostrarActContacto(!mostrarActContacto)}>
								Contacto para el ticket:
							</p>
							{
								<>
									<InputB value={nombre} handleChange={setNombre} placeholder="Nombre de contacto" errors={errors} type="string" />
									<InputB value={telefono} handleChange={setTelefono} placeholder="Telefono de contacto" errors={errors} type="number" />
									<InputB value={direccion} handleChange={setDireccion} placeholder="Dirección" errors={errors} type="string" />
									<div className="flex">
										<p>Opcional: </p>
										<Button title="Actualizar dirección por coordenadas" onClick={buscarCoordenadas} />
										<InputB value={latitud} handleChange={setLatitud} placeholder="Latitud" errors={errors} type="string" className="w-1/2" />
										<InputB value={longitud} handleChange={setLongitud} placeholder="Longitud" errors={errors} type="string" className="w-1/2" />

									</div>
								</>
							}
						</div>
					)}
				</div>
			) : (
				fClientes.length > 0 && <p className="bg-red-500">Cliente sin servicios asociados activos</p>
			)}
			{ticket && <p className="font-bold text-red-800">Tomar en cuenta que si el grupo cambia el flujo de acciones ya creado se mantendra</p>}
		</Input>
	);
}
