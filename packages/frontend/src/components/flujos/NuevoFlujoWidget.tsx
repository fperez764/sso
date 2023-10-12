import { useEffect, useState } from 'react';
import { ArrowDownIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAuthState } from '../../context/auth';
import { toast } from 'react-hot-toast';
import NuevaAccionFlujo from './NuevaAccionFlujo';
import ComboBox from '../ui/ComboBox';
import axios from 'axios';
import { FlujoTicket, FlujoTicketAcciones, users_area_enum } from '@types/typesSSO';
import InputB from '../ui/InputB';
import TextArea from '../ui/TextArea';
import Button from '../ui/Button';
import FlujoTimeline from './FlujoTimeline';
import Icons from '../ui/Icons';
import { actualizarAccionFlujo, eliminarAccionFlujo, insertarAccionFlujo } from '@src/app/api/tickets/flujos/flujos';

interface Props {
	post?: FlujoTicket;
	selectedSubPost?: FlujoTicketAcciones;
	handleFeederRefresh: () => void;
}
function NuevoFlujoWidget({ post, handleFeederRefresh }: Props) {
	const [flujo, setFlujo] = useState(post);
	const { user } = useAuthState();
	const [items, setItems] = useState<any[]>(post?.flujoTicketAcciones.filter((i) => !i.fechaBaja) || []);
	const [accion, setAccion] = useState<any>(post?.flujoTicketAcciones.find((i) => !i.fechaBaja));
	const [nombre, setNombre] = useState(post?.nombre || '');
	const [descripcion, setDescripcion] = useState(post?.descripcion || '');
	const [tipo, setTipo] = useState(post?.tipo || '');
	const [nombreServicio, setNombreServicio] = useState(post?.servicio?.nombre || '');
	const [editarDatosFlujo, setEditarDatosFlujo] = useState(!post);
	const [editarAccion, setEditarAccion] = useState(false);

	useEffect(() => {
		setFlujo(post);
		setItems(post?.flujoTicketAcciones.filter((i) => !i.fechaBaja) || []);
		setNombre(post?.nombre || '');
		setDescripcion(post?.descripcion || '');
		setTipo(post?.tipo || '');
		setNombreServicio(post?.servicio?.nombre || '');
		setAccion(post?.flujoTicketAcciones.find((i) => !i.fechaBaja));
	},[post]);

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
		// if (items.length === 0) {
		// 	toast.error('Un nuevo grupo-flujo debe tener al menos una acción');
		// 	return;
		// }
		if (accionConError) {
			toast.error(`Hay una acción con errores ${accionConError.orden}-${accionConError}-${accionConError?.accion}`);
			return;
		}
		const tNuevoFlujo = toast.loading(`Se ${flujo ? 'modificara el flujo' : 'creara un nuevo flujo.'}`);
		try {
			const getBody = {
				nombre,
				descripcion,
				tipo,
				nombreServicio,
			};
			// Si hay un post lo edita cc crea uno nuevo.
			const res = !flujo ? await axios.post('/flujosTickets', getBody) : await axios.put(`/flujosTickets/${post?.id}`, getBody);
			toast.success('Flujo guardado! ' + res.data, { id: tNuevoFlujo });
		} catch (error: any) {
			toast.error('No se pudo guardar el flujo:\n' + JSON.stringify(error.response?.data || error), { id: tNuevoFlujo });
		}
		try {
			setEditarDatosFlujo(false);
			handleFeederRefresh();
		} catch (error) {
			console.error('Post-NuevoFlujo:' + error);
		}
	};

	const handleNuevoItem = (accionAnterior: FlujoTicketAcciones | undefined) => {
		if (!user) {
			toast.error('Debe inciar sesión para crear un flujo.');
			return;
		}
		toast.success(accionAnterior ? `Agrega una acción despues de ${accionAnterior.area}/${accionAnterior.accion}` : 'Agrega una nueva accion.');
		const newItem = {
			//...accionAnterior,
			usuarioCreacion: user.username,
			orden: accionAnterior ? (accionAnterior.orden + 0.5) : 0,
			area: users_area_enum.ATENCION_CLIENTE,
			accion: `acción ${(accionAnterior?.orden || 0) + 1}`,
			vigenciaDias: 0,
			nombreFlujo: flujo?.nombre,
			idAccionAnterior: accionAnterior?.id
		};
		if(!accionAnterior) {
			setItems([newItem]);
			return;
		}
		const idx = items.findIndex((i) => i.id === accionAnterior.id);
		const newItems = [...items];
		newItems.splice(idx + 1, 0, newItem);
		setItems(newItems);
		setAccion(newItem);
	};


	const handleBorrarItem = (accionPorBorrar: Partial<FlujoTicketAcciones>) => {
		if (!accionPorBorrar.orden) return;
		if (accionPorBorrar.orden === 0) toast.error('Un nuevo flujo necesita al menos una acción');
		const newItems = items.filter((item) => item.orden != accionPorBorrar.orden);
		for (let i = 0; i < newItems.length; i++) {
			newItems[i].orden = i + 1;
		}
		setItems(newItems);
		toast.success('Se elimino la acción ' + accionPorBorrar.orden);
	};


	const InfoGrupo = (
		<div className="w-full mx-8 mt-3 bg-gray-100 rounded-lg">
			{editarDatosFlujo && !!user ? (
				<div className="flex flex-col items-center space-y-1 text-center rounded-lg">
					<h2 className="my-3 text-xl font-bold">Crear un nuevo flujo de acciones para un grupo de tickets</h2>
					<ComboBox setData={setTipo} postName="Tipo" searchEndpoint="/flujosTickets/tipos" className="w-64" />
					<ComboBox setData={setNombreServicio} filterKey="nombre" postName="Servicio" searchEndpoint="/servicios" className="w-64" />
					<InputB placeholder="Nombre Flujo" type="text" value={nombre} handleChange={setNombre} className="mt-1 w-96" />
					<TextArea placeholder="Descripción" rows={2} value={descripcion} handleChange={setDescripcion} className="h-32 w-96" />
				</div>
			) : (
				<div className="flex flex-col items-center overflow-hidden">
					<h2 className="my-3 text-lg font-bold text-center">Flujo de acciones para el tipo de tickets:</h2>
					<p className="font-bold">Tipo: {tipo}</p>
					{!!flujo && <p className="font-bold">ID: {flujo.id}</p>}
					<p>Servicio: {nombreServicio}</p>
					<p className="ml-3 text-lg">Nombre Flujo: {nombre}</p>
					<p className="ml-3 text-md">Descripción: {descripcion}</p>
				</div>
			)}
			{!!user && (
				<div className="flex justify-end px-3 pb-3 space-x-3">
					{editarDatosFlujo ? <Button title="Guardar" onClick={handleGuardarInfo} titleConfirm="Estas seguro de modificar este grupo" /> : <Button title="Editar" onClick={() => setEditarDatosFlujo(true)} />}
				</div>
			)}
		</div>
	);

	return (<div className="flex flex-col items-center justify-center w-full">
		{InfoGrupo}
		{items.length > 0 && <FlujoTimeline acciones={items} setAccion={setAccion} />}
		{accion && <div className="flex flex-col items-center w-full">
			nuevoFlujo {editarAccion? 'Editar': 'Noditar'}
			<NuevaAccionFlujo accion={accion} 
			    edit={editarAccion}
				handleSave={(partialAction) => {
					accion.id
					? actualizarAccionFlujo(partialAction).then(handleFeederRefresh)
					: insertarAccionFlujo(partialAction).then(handleFeederRefresh);
					
				}}								
				handleDelete={(partialAction) => {
					if(!accion.id) setItems(items.filter((i) => i.orden !== accion.orden));
					else eliminarAccionFlujo(partialAction.id).then(()=>{
						handleFeederRefresh();
					});
				}} 
			/>
			<Icons 
				customAction='Insertar'
				name='Acción'
				handleEdit={()=>setEditarAccion(true)}
				handleCancelEdit={()=>setEditarAccion(false)}
				handleCustomAction={() => {handleNuevoItem(accion); setEditarAccion(true);}}
				handleDelete={() => handleBorrarItem(accion)}
			/>
		</div>}
		{items.length === 0 && 			<Icons 
				customAction='Insertar'
				name='Acción'
				handleCustomAction={() => handleNuevoItem(accion)}
			/>
		}
	</div>);
}

export default NuevoFlujoWidget;
