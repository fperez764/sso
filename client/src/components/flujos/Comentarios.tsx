import { Respuesta, Comentario } from '../../../types/typesSSO';
import toast from 'react-hot-toast';
import { useAuthState } from '../../context/auth';
import dayjs from 'dayjs';
import axios from 'axios';
import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import ComentarConImagenes from '../ComentarConImagenes';
import Image from 'next/image';
import Icons from '../Icons';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
	selectedRespuesta: Respuesta;
}

export default function SeccionComentarios({ selectedRespuesta }: Props) {
	if (!selectedRespuesta) return <p>No se puede comentar</p>;
	const endpoint = ('servicio' in selectedRespuesta ? '/solicitudes/' : '/tickets/') + selectedRespuesta.id;
	const { user } = useAuthState();
	const [comentarios, setComentarios] = useState<Comentario[]>([]);
	const [mostrar, setMostrar] = useState(true);
	const [textoComentario, setTextoComentario] = useState('');
	const [imagen, setImagen] = useState('');

	useEffect(()=>{
		setComentarios(selectedRespuesta.comentarios || []);
	},[selectedRespuesta])

	const actualizarComentarios = async () => {
		const tActCom = toast.loading('Actualizar comentarios para respuesta: ' + selectedRespuesta.id);
		try {
			const res = await axios.get(`/tickets/respuestas/${selectedRespuesta.id}`);
			const nComentarios = res.data.comentarios;
			setComentarios(nComentarios.sort((r: Comentario, s: Comentario) => r.id - s.id));
			toast.success(`${comentarios.length} comentarios actualizados`, { id:  tActCom});
		} catch (error: any) {
			console.error('No se pudieron actualizar los comentarios: ' + error);
			toast.error(`No se pudieron actualizar los comentarios`, { id:  tActCom});
		}
	};

	const onSubmit = async (e: any) => {
		e.preventDefault();
		if(!textoComentario) return toast.error('Para comentar necesitas escribir algo de texto!');
		const tComentar = toast.loading('Guardando comentario');
		try {
			await axios.post(`/tickets/respuestas/${selectedRespuesta.id}/comentar`, {
				comentario: textoComentario,
				imagen,
			});
			toast.success(`Comentario ${!!imagen && 'con imagen '}guardado.`, { id: tComentar });
			setTextoComentario('');
			setImagen('');
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
							<div key={comentario.id} className="relative flex mb-2 space-x-2">
								<Image className="items-center w-10 h-10 bg-blue-200 rounded-full" src={`/images/areas/${comentario.usuarioCreacion?.area}.png`} width={64} height={64} alt="Area" />
								<div className="px-3 py-3 bg-gray-100 rounded-xl">
									<div className="flex">
										<h4 className="text-sm font-bold">{comentario.usuarioCreacion?.username || 'desconocido'}</h4>
										<p className="my-1 ml-1 text-xs whitespace-nowrap">{dayjs(comentario.fechaModificacion).fromNow()}</p>
									</div>
									<p className="text-lg">{comentario.comentario}</p>
									{!!comentario.imagen && <img src={comentario.imagen} className="w-auto h-96 rounded-xl" alt={comentario.imagen} />}
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
							<ComentarConImagenes value={imagen} onChange={(image) => setImagen(image)} textoComentario={textoComentario} setTextoComentario={setTextoComentario}/>
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
