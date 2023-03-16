/** @format */
import { ClienteServicioTicket } from '../../types/typesSSO';
import RespuestaWidget from '../components/flujos/RespuestaWidget';
import FlujoCard from '../components/flujos/FlujoCard';
import { useEffect, useState } from 'react';
import MainIndex from '../components/MainIndex';
import ClienteWidget from '../components/cliente/ClienteWidget';
import NuevaRespuestaWidget from '../components/flujos/NuevaRespuestaWidget';
import Button from '../components/Button';
import NuevoTicket from '../components/flujos/NuevoTicketWidget';
import { ArrowPathIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import { toastCard } from '../components/ToastCard';
import SeccionComentarios from '../components/flujos/Comentarios';

interface PropsMainIndex {
	post: ClienteServicioTicket;
	selectedPost: ClienteServicioTicket;
	handleInputCancel: () => void;
	handleRefresh: () => void;
	errors: any;
}

const postName = 'Tickets';
const postEndpoint = '/tickets';
const defaultFilterKey = 'descripcion';

/**
 * @param PropsMainIndex son las props generales del template
 * @param selectedSubPost: Respuesta son las propiedades especificas de los tickets, mostrando como widgets la respuesta seleccionada
 * @returns MainIndex + ClienteWidget/RespuestaWidget/Comentarios + extraButtons
 */
export default function TicketPage() {
	const [selectedSubPost, setSelectedSubPost] = useState(null);
	const [editSubPost, setEditSubPost] = useState(false);

	const mostrarNuevoFlujo = async () => {
		toastCard(<p className='font-bold bg-blue-300'>Por implementar: nuevo flujo.</p>, 'Nuevo Flujo');
	};

	const verFlujos = async () => {
		toastCard(<p>Por implementar: {`<Flujos: GrupoTicketRespuestas?.map(flujo => timeline respuetas={flujo.respuestas}) />`}</p>, 'Flujos');
	};

	const feederChildren = ({ post }: PropsMainIndex) => {
		return <FlujoCard post={post} setSelectedSubPost={setSelectedSubPost} selectedSubPost={selectedSubPost} setEditSubPost={setEditSubPost} editSubPost={editSubPost} />;
	};

	const widgetChildren = ({ selectedPost, handleRefresh }: PropsMainIndex) => {
		//TODO: useEffect triggereado por handleRefresh llama a setSelectedSubpost para actualizarlo?
		return (
			<div className="space-y-2">
				<ClienteWidget cliente={selectedPost.clienteServicio.cliente} />
				{editSubPost ? (
					<NuevaRespuestaWidget resp={selectedSubPost} ss={selectedPost} handleCancel={() => setEditSubPost(false)} handleFeederRefresh={handleRefresh}/>
				) : (<>
						<RespuestaWidget respuesta={selectedSubPost} setShowEdit={setEditSubPost} showEdit={editSubPost} post={selectedPost}  handleFeederRefresh={handleRefresh}/>
						<SeccionComentarios selectedRespuesta={selectedSubPost}/> 
					</>
				)}
			</div>
		);
	};

	const newWidgetChildren = ({ selectedPost, handleInputCancel }: PropsMainIndex) => {
		return <NuevoTicket ticket={selectedPost} clienteServicio={selectedPost?.clienteServicio} handleCancel={handleInputCancel} />;
	};

	const extraButtons = (
		<>
			<Button Icon={ArrowPathIcon} title="Agregar flujo" onClick={mostrarNuevoFlujo} disabled={true}/>
			<Button Icon={PresentationChartLineIcon} title="Flujos" onClick={verFlujos} disabled={true}/>
		</>
	);

	return (
		<MainIndex
			postName={postName}
			endpoint={postEndpoint}
			extraButtons={extraButtons}
			defaultFilterKey={defaultFilterKey}
			feederChildren={feederChildren}
			widgetChildren={widgetChildren}
			newWidgetChildren={newWidgetChildren}
		/>
	);
}
