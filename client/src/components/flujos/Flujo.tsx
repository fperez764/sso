/** @format */

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Comentario, Respuesta, ClienteSolicitud, ClienteServicioTicket, Roles } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import router from 'next/router';
import { useAuthState } from '../../context/auth';
import FlujoServicio from './FlujoServicio';
import FlujoCliente from './FlujoCliente';
import axios from 'axios';
import FlujoTimeline from './FlujoTimeline';
import Image from 'next/image';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
	post: ClienteSolicitud | ClienteServicioTicket;
	setSelectedSubPost: any;
	setEditSubPost: any;
	editSubPost: boolean;
}

export default function Flujo({ post, setSelectedSubPost, setEditSubPost, editSubPost }: Props) {
	const { user } = useAuthState();
	const [anulado, setAnulado] = useState(false);
	const [textoComentario, setTextoComentario] = useState('');
	const [puedeResponder, setPuedeResponder] = useState(false);
	const [respondiste, setRespondiste] = useState(false);
	const [respondidos, setRespondidos] = useState<string[]>([]);
	const [comentarios, setComentarios] = useState<Comentario[]>([]);
	const [nuevoComentarioVisible, setNuevoComentarioVisible] = useState(false);
	const [respuestas, setRespuestas] = useState<Respuesta[]>(post.respuestas);
	//TODO: Replace for usereducer dev.to/builderio/a-cure-for-react-usestate-hell-1ldi

	const owner = user?.username === post?.usuarioCreacion.username;
	const admin = user?.rol === Roles.ADMIN;

	const cancelPostToEdit = () => {
		setRespuestas(post.respuestas);
		setEditSubPost(false);
		setSelectedSubPost(null);
	};

	const setPostToEdit = () => {
		setEditSubPost(true);
	};
	const comentarSS = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const comentarioToast = toast.loading('Agregando comentario...');
		const comentario = {
			comentario: textoComentario,
			clienteSolicitud: post.id,
			usuarioCreacion: user?.username || 'usuario incorrecto',
		};

		const result = await fetch('/solicitudes/comentario', {
			body: JSON.stringify(comentario),
			method: 'POST',
		});

		toast.success('Comentario agregado!', { id: comentarioToast });
		setTextoComentario('');
		setNuevoComentarioVisible(false);
		actualizarComentariosSS();
	};

	const actualizarComentariosSS = async () => {
		const res = await fetch('/solicitudescomentario', {
			method: 'GET',
		});
		setComentarios(await res.json());
	};

	async function changeAcceptSS() {
		if (!user) {
			router.push('/auth/login');
			return;
		}
		if (respondiste) {
			setRespondiste(false);
			setRespondidos([...respondidos, user.username]);
		} else {
			setRespondiste(true);
			setRespondidos([...respondidos, user.username]);
		}
	}

	async function deleteSS() {
		if (window.confirm('Estas seguro de eliminar esta solicitud de servicio.')) {
			//dar de baja SS si la logica de negocio lo permite;
			try {
				const result = await axios.delete(`/solicitudes/${post.id}`);
				toast.success('Se elimino la SS ' + post.id);
				setAnulado(true);
			} catch (error) {
				toast.error(`No se pudo eliminar la SS: ${post.id}, error: ${error}`);
			}
		}
	}

	async function cancelSS() {
		if (window.confirm('Estas seguro de anular esta solicitud de servicio.')) {
			//dar de baja SS si la logica de negocio lo permite;
			try {
				const result = await axios.patch(`/solicitudes/${post.id}`);
				toast.success('Se anulo la SS ' + post.id);
				setAnulado(true);
			} catch (error) {
				toast.error(`No se pudo anular la SS: ${post.id}, error: ${error}`);
			}
		}
	}

	const usuarioCreacionInfo = (
		<div className="flex flex-col items-start mx-1">
			{/**Post user info */}
			<div className="">
				<Image className="m-auto rounded-full h-7 w-7" src={`/images/areas/${post.usuarioCreacion?.area}.png`} width={64} height={64} alt={post.usuarioCreacion?.area} />
				<h4 className="font-bold text-[11px] text-center sm:text-[10px] hover:underline">{post.usuarioCreacion?.area}</h4>
			</div>
			<div className="flex-col items-start">
				<p className="text-[13px]">@{post.usuarioCreacion.username}</p>
				<p className="font-medium text-[12px]">{dayjs(post.fechaCreacion).fromNow()}</p>
			</div>
			{(post.usuarioBaja || anulado) && (
				<div className="flex-col items-start ml-4 ">
					<p className="text-sm sm:text-[15px]">Anulado por: @{post.usuarioBaja || user?.username}</p>
					<p className="font-medium text-[13px]">{anulado ? 'Justo ahora' : dayjs(post.fechaModificacion).fromNow()}</p>
				</div>
			)}
		</div>
	);

	const postTexts = (
		<div className="flex items-center h-full overflow-hidden bg-blue-100 rounded">
			<div className="ml-2 w-[40%]">
				<p className="font-bold text-[14px] sm:text-[13px] hover:underline">
					{post.grupo?.nombre}-{post.grupo?.tipo}: {post.id}
				</p>
				<p className="text-gray-800 text-[12px] sm:text-[13px] hidden lg:inline">Origen: {post.origen}</p>
				{post.grupo && <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">Grupo: ${post.grupo.nombre}</p>}
			</div>
			<p className="self-center w-[60%]">{(anulado ? 'ANULADO: ' : '') + post.descripcion}</p>
		</div>
	);

	const seccionComentarios = (
		<>
			{/* Caja para comentar */}
			{nuevoComentarioVisible && (
				<form onSubmit={comentarSS} className="flex mt-3 space-x-3">
					<input
						value={textoComentario}
						onChange={(e) => setTextoComentario(e.target.value)}
						className="flex-1 p-2 bg-gray-100 outline-none reounded-lg"
						type="text"
						placeholder="Escribe un comentario para la respuesta pendiente..."
					/>
					<button disabled={!textoComentario} type="submit" className="text-abe disabled:text-gray-200">
						Comentar
					</button>
				</form>
			)}
			{/* Lista de comentarios */}
			{comentarios?.length > 0 && (
				<div>
					{comentarios.map((comentario) => (
						<div key={comentario.id} className="relative flex space-x-2">
							<hr className="absolute h-8 left-5 top-10 border-x border-abe/30" />
							{/*<Iamge className="object-cover mt-2 rounded-full h-7 w-7" alt="" src={comentario.usuarioCreacion}/>*/}
							<div className="flex items-center space-x-1">
								<p className="mr-1 font-bold">{comentario.usuarioCreacion.username}</p>
								<p className="hidden text-sm text-gray-500 lg:inline">{comentario.usuarioCreacion.rol}</p>
							</div>
						</div>
					))}
				</div>
			)}
		</>
	);

	return (
		<div className={`bg-gray-100 border-b border-t border-gray-400${(post.usuarioBaja || anulado) && 'bg-red-700'}`}>
			<div className="flex">
				<FlujoServicio servicio={'servicio' in post ? post.servicio : post.clienteServicio.servicio} />
				<div className="hidden w-1/2 lg:inline">{postTexts}</div>
				{usuarioCreacionInfo}
				{/*Cliente*/}
				<div className="w-1/4">
					<FlujoCliente cliente={'cliente' in post ? post.cliente : post.clienteServicio.cliente} />
				</div>
			</div>
			<div className="w-full lg:hidden">{postTexts}</div>
			{seccionComentarios}
			<FlujoTimeline respuestas={respuestas.sort((r, s) => r.orden - s.orden)} setRespuesta={setSelectedSubPost} />
		</div>
	);
}
