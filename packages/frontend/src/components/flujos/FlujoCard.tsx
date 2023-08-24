import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useAuthState } from '../../context/auth';
import FlujoServicio from './FlujoServicio';
import axios from 'axios';
import FlujoTimeline from './FlujoTimeline';
import FlujoCreador from './FlujoCreador';
import { FlujoTicket, FlujoTicketAcciones, users_rol_enum } from '@types/typesSSO';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
	post: FlujoTicket;
	setSelectedSubPost: any;
	selectedSubPost: FlujoTicketAcciones | null;
	setEditSubPost: any;
	editSubPost: boolean;
}

export default function FlujoCard({ post, setSelectedSubPost, setEditSubPost, editSubPost }: Props) {
	const { user } = useAuthState();

	const [anulado, setAnulado] = useState(false);
	const [respuestas, setRespuestas] = useState<FlujoTicketAcciones[]>(post.flujoTicketAcciones);

	useEffect(() => {
		setRespuestas(post.flujoTicketAcciones);
	}, [post]);

	const owner = user?.username === post?.usuarioCreacion;
	const admin = user?.rol === users_rol_enum.ADMIN;
	const endpoint = 'solicitudes' in post ? '/flujosSolicitudes' : '/flujosTickets';

	const color = 'blue-300';
	const bgColorSeveridad = `bg-${color}`;
	const borderColorSeveridad = `border-${color}`;

	const cancelPostToEdit = () => {
		setRespuestas(post.flujoTicketAcciones);
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

	const FlujoTextos = (
		<div className={`flex flex-col w-full overflow-hidden ${bgColorSeveridad} rounded items-start`}>
			<div className="flex ml-3 space-x-3">
				<p className="text-sm font-bold">Id: {post.id}</p>
				<div className='flex items-center space-x-2'><span className=''>Tipo: </span> <span className="text-lg font-bold">{post.tipo}</span></div>
			</div>
			<p className="text-lg">{(anulado ? 'ANULADO: ' : 'Nombre Flujo: ') + post.nombre}</p>
			<p className="text-sm">Descripción: {post.descripcion}</p>
		</div>
	);

	return (
		<div className={`rounded-xl my-3 border-4 ${post.usuarioBaja || anulado ? 'bg-red-700' : 'bg-gray-100'} ${borderColorSeveridad}`}>
			<div className="flex items-center justify-between" onClick={() => setSelectedSubPost(post.flujoTicketAcciones.at(-1))}>
				<div className="flex items-center w-full ml-3 space-x-3">
					{!!post.servicio 
					? <FlujoServicio servicio={post.servicio} className="" />
					: <h2 className='font-bold'>Servicio: {post.nombreServicio}</h2>}
				</div>
				{!!post.usuarioCreacion ? <FlujoCreador post={post} className="w-28 md:w-64" /> : 'No se pudo recuperar al usuario'}
			</div>
			<div className="flex flex-col items-center">
				{FlujoTextos}
				<FlujoTimeline acciones={respuestas.sort((r, s) => r.orden - s.orden)} setAccion={setSelectedSubPost} />
			</div>
		</div>
	);
}
