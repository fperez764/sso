import toast from 'react-hot-toast';
import { useAuthState } from '../../context/auth';
import axios from 'axios';
import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import ComentarConImagenes from '../ui/ComentarConImagenes';
import Image from 'next/image';
import { ClienteServicioTicketAccion, ClienteServicioTicketAccionComentario, ClienteSolicitudAccion } from '@types/typesSSO';
import Comentario from './Comentario';

interface Props {
	selectedRespuesta: ClienteServicioTicketAccion | ClienteSolicitudAccion;
}

export default function SeccionComentarios({ selectedRespuesta }: Props) {
	if (!selectedRespuesta) return <p>No se puede comentar</p>;
	const { user } = useAuthState();
	const [comentarios, setComentarios] = useState<ClienteServicioTicketAccionComentario[]>([]);
	const [mostrar, setMostrar] = useState(true);
	const [textoComentario, setTextoComentario] = useState('');
	const [imageToPost, setImageToPost] = useState<Blob | null>(null);
	useEffect(()=>{
		actualizarComentarios();
	},[selectedRespuesta])

	const actualizarComentarios = async () => {
		try {
			const res = await axios.get(`/ticketsAcciones/${selectedRespuesta.id}`);
			const nComentarios = res.data.comentarios;
			setComentarios(nComentarios.sort((r: ClienteServicioTicketAccionComentario, s: ClienteServicioTicketAccionComentario) => r.id - s.id));
		} catch (error: any) {
			console.error('No se pudieron actualizar los comentarios: ' + error);
		}
	};

	const onSubmit = async (e: any) => {
		e.preventDefault();
		if(!textoComentario) return toast.error('Para comentar necesitas escribir algo de texto!');
		const tComentar = toast.loading('Guardando comentario');
		try {
			const formData = new FormData();
			if(imageToPost)
			{
				let file = new Blob([imageToPost], { type: 'image/jpeg' });
				formData.append('imagen', imageToPost);
			}
			formData.append('comentario', textoComentario);
			const res = await axios.post(`/ticketsAcciones/${selectedRespuesta.id}/comentar`, formData,
			{headers: {'Content-Type': 'multipart/form-data'}});
			toast.success(`Comentario ${imageToPost ? 'con imagen ' : ''}guardado.`, { id: tComentar });
			setTextoComentario('');
			setImageToPost(null);
			actualizarComentarios();
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
				<ArrowPathIcon className="w-6 ml-5 cursor-pointer" onClick={actualizarComentarios} />
			</div>
			{/* Lista de comentarios */}
			{mostrar && (
				<div className="flex-col">
					{!!comentarios &&
						comentarios.map((comentario) => (
							<Comentario key={comentario.id} comentario={comentario} />
						))}
				</div>
			)}
			{/* Caja para comentar */}
			{user && (
				<div className="flex items-center w-full space-x-3">
					<Image className="items-center w-10 h-10 bg-blue-200 rounded-full" src={`/images/areas/${user?.area}.png`} alt="Area" width={64} height={64} />
					<form className="flex w-full p-2 space-x-2 items-top">
						<div className="flex-col w-full">
							<ComentarConImagenes setImage={setImageToPost} image={imageToPost} textoComentario={textoComentario} setTextoComentario={setTextoComentario}/>
						</div>
						<button disabled={!textoComentario} className="h-12 px-2 text-white bg-blue-400 rounded-md disabled:text-gray-400" type="submit" onClick={onSubmit}>
							Comentar
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
