/** @format */

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FlujoRespuesta, Roles, GrupoFlujos } from '../../../types/typesSSO';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuthState } from '../../context/auth';
import FlujoServicio from './FlujoServicio';
import axios from 'axios';
import FlujoTimeline from './FlujoTimeline';
import FlujoCreador from './FlujoCreador';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
	post: GrupoFlujos;
	setSelectedSubPost: any;
	selectedSubPost: FlujoRespuesta | null;
	setEditSubPost: any;
	editSubPost: boolean;
}

export default function FlujoCard({ post, setSelectedSubPost, setEditSubPost, editSubPost }: Props) {
	const { user } = useAuthState();

	const [anulado, setAnulado] = useState(false);
	const [respuestas, setRespuestas] = useState<FlujoRespuesta[]>(post.respuestas);

	useEffect(() => {
		setRespuestas(post.respuestas);
	}, [post]);

	const owner = user?.username === post?.usuarioCreacion.username;
	const admin = user?.rol === Roles.ADMIN;
	const endpoint = 'solicitudes' in post ? '/grupoSolicitudes' : '/grupoTickets';

	const color = 'blue-300';
	const bgColorSeveridad = `bg-${color}`;
	const borderColorSeveridad = `border-${color}`;

	const cancelPostToEdit = () => {
		setRespuestas(post.respuestas);
		setEditSubPost(false);
		setSelectedSubPost(null);
	};

	const setPostToEdit = () => {
		setEditSubPost(true);
	};

	async function deletePost() {
		if (window.confirm('Estas seguro de eliminar esta solicitud de servicio.')) {
			//dar de baja solicitud/ticket si la logica de negocio lo permite;
			try {
				const result = await axios.delete(`${endpoint}/${post.id}`);
				toast.success('Se elimino la solicitud/ticket ' + post.id);
				setAnulado(true);
			} catch (error) {
				toast.error(`No se pudo eliminar la solicitud/ticket: ${post.id}, error: ${error}`);
			}
		}
	}

	async function anularPost() {
		if (window.confirm('Estas seguro de anular esta solicitud de servicio.')) {
			//dar de baja Post si la logica de negocio lo permite;
			try {
				const result = await axios.patch(`${endpoint}/${post.id}`);
				const message = 'severidad' in post ? 'la solicitud ' : 'el ticket ';
				toast.success(`Se anulo ${message} ${post.id}`);
				setAnulado(true);
			} catch (error) {
				toast.error(`No se pudo anular: ${post.id}, error: ${error}`);
			}
		}
	}

	const FlujoTextos = (
		<div className={`flex w-full h-full overflow-hidden ${bgColorSeveridad} rounded items-center`}>
			<div className="flex-col h-16 ml-3">
				<p className="text-sm font-bold">Id: {post.id}</p>
				<p className="text-lg font-bold">{post.tipo}</p>
			</div>
			<p className="self-center w-2/3 ml-3 text-lg max-h-16 text-start">{(anulado ? 'ANULADO: ' : '') + post.nombre + ': ' + post.descripcion}</p>
		</div>
	);

	return (
		<div className={`rounded-xl my-3 border-4 ${post.usuarioBaja || anulado ? 'bg-red-700' : 'bg-gray-100'} ${borderColorSeveridad}`}>
			<div className="flex items-center justify-between" onClick={() => setSelectedSubPost(post.respuestas[post.respuestas.length - 1])}>
				{!!post.servicio ? (
					<div className="flex items-center w-full ml-3 space-x-3">
						<FlujoServicio servicio={post.servicio} className="" />
						<p className="text-md">{post.servicio?.descripcion}</p>
					</div>
				) : (
					<p>Servicio no especificado</p>
				)}
				{!!post.usuarioCreacion ? <FlujoCreador post={post} className="w-28 md:w-64" /> : 'No se pudo recuperar al usuario'}
			</div>
			<div className="flex flex-col items-center">
				{FlujoTextos}
				<FlujoTimeline respuestas={respuestas.sort((r, s) => r.orden - s.orden)} setRespuesta={setSelectedSubPost} />
			</div>
		</div>
	);
}
