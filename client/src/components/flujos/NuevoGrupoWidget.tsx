/** @format */

import { useState } from 'react';
import { FlujoRespuesta, GrupoFlujos } from '../../../types/typesSSO';
import { ArrowDownIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { useAuthState } from '../../context/auth';
import { toast } from 'react-hot-toast';
import NuevaAccionFlujo from './NuevaAccionFlujo';
import ComboBox from '../ComboBox';
import InputB from '../InputB';
import Button from '../Button';
import TextArea from '../TextArea';
import axios from 'axios';

interface Props {
	post?: GrupoFlujos;
	selectedSubPost?: FlujoRespuesta;
	handleFeederRefresh: () => void;
	setBlockClose: (block: boolean) => void;
}
function NuevoGrupoWidget({ post, handleFeederRefresh, setBlockClose }: Props) {
	const { user } = useAuthState();
	const [items, setItems] = useState<Partial<FlujoRespuesta>[]>(post?.respuestas || []);
	const [nombre, setNombre] = useState(post?.nombre || '');
	const [descripcion, setDescripcion] = useState(post?.descripcion || '');
	const [tipo, setTipo] = useState(post?.tipo || '');
	const [nombreServicio, setNombreServicio] = useState(post?.servicio?.nombre || '');
	const [editarInfo, setEditarInfo] = useState(!post);

	const handleGuardarInfo = async () => {
		const tNuevoFlujo = toast.loading('Se creara un nuevo flujo.');
		console.log('GUARDAR');
		if (!nombre || nombre.length < 3) {
			toast.error('El nombre del grupo es requerido', { id: tNuevoFlujo});
			return;
		}
		if (!descripcion || descripcion.length < 10) {
			toast.error('La descripción debe tener al menos 10 caracteres', { id: tNuevoFlujo});
			return;
		}
		const accionConError = items.find((i) => !i.accion || i.accion.includes('acción'));
		if (items.length === 0) {
			toast.error('Un nuevo grupo-flujo debe tener al menos una acción-respuesta', { id: tNuevoFlujo});
			return;
		}
		if (accionConError) {
			toast.error(`Hay una acción con errores ${accionConError.orden}-${accionConError}-${accionConError?.accion}`, { id: tNuevoFlujo});
			return;
		}
		//TODO: SAVE GRUPO
		try {
			const getBody = {
				nombre,
				descripcion,
				tipo,
				nombreServicio,
				respuestas: items,
			};
			// Si hay un post lo edita cc crea uno nuevo.
			const res = !post ? await axios.post('/grupoTickets', getBody) : await axios.put(`/grupoTickets/${post.id}`, getBody);
			toast.success('Nuevo grupo-flujo guardado! ' + res.data);
		} catch (error: any) {
			toast.error('No se pudo guardar el flujo:\n' + JSON.stringify(error.response?.data || error), { id: tNuevoFlujo});
		}
		try {
			setEditarInfo(false);
			handleFeederRefresh();
			setBlockClose(false);
		} catch (error) {
			console.error('Post-NuevoFlujo:' + error);
		}
	};

	const handleNuevoItem = (orden: number) => {
		if (!user) {
			toast.error('Debe inciar sesión para crear un flujo.');
			return;
		}
		toast.success(`Agrega una acción despues de ${orden}`);
		const newItem = {
			fechaCreacion: new Date(),
			usuarioCreacion: user,
			fechaModificacion: new Date(),
			orden: orden + 1,
			area: '',
			accion: `acción ${orden + 1}`,
			vigenciaDias: 1,
		};
		setItems([...items, newItem]);
	};

	const handleBorrarItem = (respuesta: Partial<FlujoRespuesta>) => {
		console.log(`handle delete ${respuesta.orden} de ${items.length}`);
		if (!respuesta.orden) return;
		if (respuesta.orden === 0) toast.error('Un nuevo flujo necesita al menos una acción');
		const newItems = items.filter((item) => item.orden != respuesta.orden);
		for (let i = 0; i < newItems.length; i++) {
			newItems[i].orden = i + 1;
		}
		setItems(newItems);
		toast.success('Se elimino la respuesta ' + respuesta.orden);
	};

	const handleEditarItem = (respuesta: Partial<FlujoRespuesta>) => {
		console.log(`handle edit ${respuesta.orden} con datos ${respuesta.area}-${respuesta.accion}`);
		const idx = items.findIndex((item) => item.orden == respuesta.orden);
		const newItems = items;
		newItems.splice(idx, 1, respuesta);
		setItems([]);
		setItems(newItems);
		setEditarInfo(true);
	};

	const InfoGrupo = (
		<div className="mx-8 mt-3 bg-gray-100 rounded-lg">
			{editarInfo && !!user ? (
				<div className="flex flex-col items-center text-center rounded-lg">
					<h2 className="my-3 text-xl font-bold">Crear un nuevo flujo de acciones-respuesta para un grupo de tickets</h2>
					<ComboBox setData={setTipo} postName="Tipo" searchEndpoint="/grupoTickets/tipos" className="w-64" />
					<ComboBox setData={setNombreServicio} filterKey="nombre" postName="Servicio" searchEndpoint="/servicios" className="w-64" />
					<InputB placeholder="Nombre" type="text" value={nombre} handleChange={setNombre} className="w-96" />
					<TextArea placeholder="Descripción" rows={2} value={descripcion} handleChange={setDescripcion} className="h-32 w-96" />
				</div>
			) : (
				<div className="flex flex-col items-center overflow-hidden">
					<h2 className="my-3 text-xl font-bold text-center">Flujo de acciones-respuesta para el grupo de tickets:</h2>
					<p className="font-bold">{tipo}</p>
					{!!post && <p className="font-bold">No. {post.id}</p>}
					<p>{nombreServicio}</p>
					<p className="ml-3 text-lg">{nombre}</p>
					<p className="ml-3 text-lg">{descripcion}</p>
				</div>
			)}
			{!!user && (
				<div className="flex justify-end px-3 pb-3 space-x-3">
					{editarInfo ? <Button title="Guardar" onClick={handleGuardarInfo} titleConfirm="Estas seguro de modificar este grupo" /> : <Button title="Editar" onClick={() => setEditarInfo(true)} />}
				</div>
			)}
		</div>
	);

	return (
		<div>
			{InfoGrupo}
			<ol className="mt-5">
				{items.length > 0 &&
					items.map((accion) => (
						<li key={items.indexOf(accion)} className="flex flex-col items-center">
							<NuevaAccionFlujo respuesta={accion} handleEdit={handleEditarItem} handleDelete={handleBorrarItem} />
							<div className="flex my-2">
								<ArrowDownIcon className="w-12 h-12 text-blue-400" />
								{user && accion.orden !== items[items.length - 1].orden && <PlusCircleIcon className="w-12 h-6 -ml-6" 
								onClick={ () => {
									if(!!accion.orden) handleNuevoItem(accion.orden + .5); 
									else toast.error('Verificar orden de acción.');
								}}/>}
							</div>
						</li>
					))}
				{user && (
					<li className="flex flex-col items-center ">
						<PlusCircleIcon className="h-12 rounded-full cursor-pointer" onClick={() => handleNuevoItem(items.length)} />
					</li>
				)}
			</ol>
		</div>
	);
}

export default NuevoGrupoWidget;
