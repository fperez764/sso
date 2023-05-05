import { Respuesta, Comentario } from '../../../types/typesSSO';
import toast from 'react-hot-toast';
import { useAuthState } from '../../context/auth';
import dayjs from 'dayjs';
import axios from 'axios';
import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import ImageUpload from '../ImageUpload';
import Image from 'next/image';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
	selectedRespuesta: Respuesta | null;
}

export default function SeccionComentarios({ selectedRespuesta }: Props) {
	if (!selectedRespuesta) return <p>No se puede comentar</p>;
	const endpoint = ('servicio' in selectedRespuesta ? '/solicitudes/' : '/tickets/') + selectedRespuesta.id;
	const { user } = useAuthState();
	const [textoComentario, setTextoComentario] = useState('');
	const [comentarios, setComentarios] = useState<Comentario[]>(selectedRespuesta.comentarios);
	const [mostrar, setMostrar] = useState(true);
	const [mostrarDropZone, setMostrarDropZone] = useState(false);
	const [imagen, setImagen] = useState('');

	if (!selectedRespuesta) return <></>;

	useEffect(() => {
		actualizarComentarios();
	}, [selectedRespuesta]);

	const actualizarComentarios = async () => {
		try {
			const res = await axios.get(`/tickets/respuestas/${selectedRespuesta.id}`);
			const nComentarios = res.data.comentarios;
			setComentarios(nComentarios.sort((r: Comentario, s: Comentario) => r.id - s.id));
		} catch (error: any) {
			toast.error('No se pudieron actualizar los comentarios: ' + error);
		}
	};

	const comentarRespuesta = async () => {
		if (!user) {
			toast.error('Inicia sesión');
			return;
		}
		const tComentar = toast.loading('Agregando comentario...');
		try {
			const comentarioBody = {
				comentario: textoComentario,
			};
			const res = await axios.post(`/tickets/respuestas/${selectedRespuesta.id}/comentar`, comentarioBody);
			toast.success('Comentario agregado!', { id: tComentar });
		} catch (error: any) {
			toast.error(error.code + ' Algo salio mal ' + JSON.stringify(error), { id: tComentar });
		}
	};

	const onSubmit = async (e: any) => {
		e.preventDefault();
		const tComentar = toast.loading('Guardando comentario');
		try {
			await axios.post(`/tickets/respuestas/${selectedRespuesta.id}/comentar`, {
				comentario: textoComentario,
				imagen,
			});
			toast.success('Comentario con imagen guardado.', { id: tComentar });
			setTextoComentario('');
			setImagen('');
			actualizarComentarios();
			setMostrarDropZone(false);
		} catch (err) {
			toast.error('Algo salio mal ' + err, { id: tComentar });
		}
	};

	if (!comentarios) return <p>Sin comentarios</p>;

	return (
		<div className="mt-2 ml-6">
			<div className="flex mb-2 border-gray-300 border-y">
				<h4>{comentarios.length + (comentarios.length !== 1 ? ' comentarios' : ' comentario')}</h4>
				{mostrar ? <ChevronUpIcon className="w-6 ml-5" onClick={() => setMostrar(false)} /> : <ChevronDownIcon className="w-6 ml-5" onClick={() => setMostrar(true)} />}
				<ArrowPathIcon className="w-6 ml-5" onClick={actualizarComentarios} />
			</div>
			{/* Lista de comentarios */}
			{mostrar && (
				<div className="flex-col">
					{!comentarios && setComentarios(selectedRespuesta.comentarios)}
					{!!comentarios &&
						comentarios.map((comentario) => (
							<div key={comentario.id} className="relative flex mb-2 space-x-2">
								<Image className="items-center w-10 h-10 bg-blue-200 rounded-full" src={`/images/areas/${comentario.usuarioCreacion?.area}.png`} width={64} height={64} alt="Area" />
								<div className="px-3 py-3 bg-gray-100 rounded-xl">
									<div className="flex">
										<h4 className="text-sm font-bold">{comentario.usuarioCreacion?.username || 'desconocido'}</h4>
										<p className="my-1 ml-1 text-xs whitespace-nowrap">{dayjs(comentario.fechaModificacion).fromNow()}</p>
									</div>
									<p className="text-lg">{comentario.comentario}</p>
									{!!comentario.imagen && <img src={comentario.imagen} className="w-auto h-96 rounded-xl" alt="No se pudo cargar la imagen" />}
								</div>
							</div>
						))}
				</div>
			)}
			{/* Caja para comentar */}
			{user && (
				<div className="flex items-center space-x-3">
					<Image className="items-center w-10 h-10 bg-blue-200 rounded-full" src={`/images/areas/${user.area}.png`} alt="Area" width={64} height={64} />
					<form className="flex items-center justify-between p-2 space-x-2">
						<div className="flex-col">
							<div className="flex">
								<input
									value={textoComentario}
									onChange={(e) => setTextoComentario(e.target.value)}
									className="flex-1 w-full p-2 text-lg bg-gray-100 rounded-lg outline-none"
									type="text"
									placeholder="Escribe un comentario..."
								/>
								<PhotoIcon onClick={() => setMostrarDropZone(!mostrarDropZone)} className="w-12 mx-2 text-blue-400" />
							</div>
							{mostrarDropZone && <ImageUpload value={imagen} onChange={(image) => setImagen(image)} label="Adjunta una imagen" />}
						</div>
						<button className="h-12 px-2 text-white bg-blue-400 rounded-md disabled:text-gray-400" type="submit" onClick={onSubmit}>
							Comentar
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
