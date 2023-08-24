import { useState } from 'react';
import { ArrowDownIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAuthState } from '../../context/auth';
import { toast } from 'react-hot-toast';
import NuevaAccionFlujo from './NuevaAccionFlujo';
import ComboBox from '../ComboBox';
import InputB from '../InputB';
import Button from '../Button';
import TextArea from '../TextArea';
import axios from 'axios';
import { FlujoTicket, FlujoTicketAcciones } from '@types/typesSSO';
import { actualizarAccionFlujo, eliminarAccionFlujo, insertarAccionFlujo } from '@src/stories/tickets/flujos/flujos';

interface Props {
	post?: FlujoTicket;
	selectedSubPost?: FlujoTicketAcciones;
	handleFeederRefresh: () => void;
}
function NuevoFlujoWidget({ post, handleFeederRefresh }: Props) {
	const { user } = useAuthState();
	const [items, setItems] = useState<FlujoTicketAcciones[]>(post?.flujoTicketAcciones.filter((i) => !i.fechaBaja) || []);
	const [nombre, setNombre] = useState(post?.nombre || '');
	const [descripcion, setDescripcion] = useState(post?.descripcion || '');
	const [tipo, setTipo] = useState(post?.tipo || '');
	const [nombreServicio, setNombreServicio] = useState(post?.servicio?.nombre || '');
	const [editarInfo, setEditarInfo] = useState(!post);

	const handleGuardarInfo = async () => {
		if (!nombre || nombre.length < 3) {
			toast.error('El nombre del grupo es requerido');
			return;
		}
		if (!descripcion || descripcion.length < 10) {
			toast.error('La descripción debe tener al menos 10 caracteres');
			return;
		}
		const accionConError = items.find((i) => !i.accion || i.accion.includes('acción'));
		if (items.length === 0) {
			toast.error('Un nuevo grupo-flujo debe tener al menos una acción');
			return;
		}
		if (accionConError) {
			toast.error(`Hay una acción con errores ${accionConError.orden}-${accionConError}-${accionConError?.accion}`);
			return;
		}
		const tNuevoFlujo = toast.loading(`Se ${post ? 'modificara el flujo' : 'creara un nuevo flujo.'}`);
		try {
			const getBody = {
				nombre,
				descripcion,
				tipo,
				nombreServicio,
			};
			// Si hay un post lo edita cc crea uno nuevo.
			const res = !post ? await axios.post('/flujosTickets', getBody) : await axios.put(`/flujosTickets/${post.id}`, getBody);
			toast.success('Flujo guardado! ' + res.data, { id: tNuevoFlujo });
		} catch (error: any) {
			toast.error('No se pudo guardar el flujo:\n' + JSON.stringify(error.response?.data || error), { id: tNuevoFlujo });
		}
		try {
			setEditarInfo(false);
			handleFeederRefresh();
		} catch (error) {
			console.error('Post-NuevoFlujo:' + error);
		}
	};

	const handleNuevoItem = (accionAnterior: FlujoTicketAcciones) => {
		if (!user) {
			toast.error('Debe inciar sesión para crear un flujo.');
			return;
		}
		toast.success(accionAnterior ? `Agrega una acción despues de ${JSON.stringify(accionAnterior)}` : 'Agrega una nueva accion.');
		const newItem = {
			...accionAnterior,
			usuarioCreacion: user.username,
			orden: accionAnterior ? accionAnterior.orden + 0.5 : 0,
			area: '',
			accion: `acción ${accionAnterior?.orden || 0 + 1}`,
			vigenciaDias: 1,
			idAccionAnterior: accionAnterior?.id
		};
		const idx = items.findIndex((i) => i.orden === accionAnterior.orden);
		const newItems = [...items];
		newItems.splice(idx + 1, 0, newItem);
		setItems(newItems);
	};


	const handleBorrarItem = (accion: Partial<FlujoTicketAcciones>) => {
		if (!accion.orden) return;
		if (accion.orden === 0) toast.error('Un nuevo flujo necesita al menos una acción');
		const newItems = items.filter((item) => item.orden != accion.orden);
		for (let i = 0; i < newItems.length; i++) {
			newItems[i].orden = i + 1;
		}
		setItems(newItems);
		toast.success('Se elimino la acción ' + accion.orden);
	};


	const InfoGrupo = (
		<div className="mx-8 mt-3 bg-gray-100 rounded-lg">
			{editarInfo && !!user ? (
				<div className="flex flex-col items-center text-center rounded-lg space-y-1">
					<h2 className="my-3 text-xl font-bold">Crear un nuevo flujo de acciones para un grupo de tickets</h2>
					<ComboBox setData={setTipo} postName="Tipo" searchEndpoint="/flujosTickets/tipos" className="w-64" />
					<ComboBox setData={setNombreServicio} filterKey="nombre" postName="Servicio" searchEndpoint="/servicios" className="w-64" />
					<InputB placeholder="Nombre Flujo" type="text" value={nombre} handleChange={setNombre} className="w-96 mt-1" />
					<TextArea placeholder="Descripción" rows={2} value={descripcion} handleChange={setDescripcion} className="h-32 w-96" />
				</div>
			) : (
				<div className="flex flex-col items-center overflow-hidden">
					<h2 className="my-3 text-lg font-bold text-center">Flujo de acciones para el tipo de tickets:</h2>
					<p className="font-bold">Tipo: {tipo}</p>
					{!!post && <p className="font-bold">ID: {post.id}</p>}
					<p>Servicio: {nombreServicio}</p>
					<p className="ml-3 text-lg">Nombre Flujo: {nombre}</p>
					<p className="ml-3 text-md">Descripción: {descripcion}</p>
				</div>
			)}
			{!!user && (
				<div className="flex justify-end px-3 pb-3 space-x-3">
					{editarInfo ? <Button title="Guardar" onClick={handleGuardarInfo} titleConfirm="Estas seguro de modificar este grupo" /> : <Button title="Editar" onClick={() => setEditarInfo(true)} />}
				</div>
			)}
		</div>
	);

	return (<div>
		{InfoGrupo}
		<ol className="mt-5">
			{items.length > 0 && items.map((accion) => (
					<li key={items.indexOf(accion)} className="flex flex-col items-center">
						<NuevaAccionFlujo accion={accion} 
							handleSave={(partialAction) => {
								accion.idAccionAnterior
								? insertarAccionFlujo(accion, partialAction).then(handleFeederRefresh)
								: actualizarAccionFlujo(accion, partialAction).then(handleFeederRefresh)
							}}								
							handleDelete={(partialAction) => {
								if(!accion.id) setItems(items.filter((i) => i.orden !== accion.orden));
								else eliminarAccionFlujo(accion.id).then(()=>{
									handleFeederRefresh();
								})
							}} 
						/>
						<div className="flex my-2">
							<ArrowDownIcon className="w-12 h-12 text-blue-400" />
							{user && accion.orden !== items.at(-1).orden && (
								<PlusCircleIcon
									className="w-12 h-6 -ml-6"
									onClick={() => {
										handleNuevoItem(accion);
									}}
								/>
							)}
						</div>
					</li>
				))}
		</ol>
	</div>);
}

export default NuevoFlujoWidget;
