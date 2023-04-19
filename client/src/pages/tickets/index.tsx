/** @format */
import { ClienteServicioTicket } from '../../../types/typesSSO';
import RespuestaWidget from '../../components/flujos/RespuestaWidget';
import SolicitudTicketCard from '../../components/flujos/SolicitudTicketCard';
import { useState } from 'react';
import MainIndex from '../../components/MainIndex';
import Button from '../../components/Button';
import NuevoTicket from '../../components/flujos/NuevoTicketWidget';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import SeccionComentarios from '../../components/flujos/Comentarios';
import router from 'next/router';

interface PropsMainIndex {
	post: ClienteServicioTicket;
	selectedPost: ClienteServicioTicket;
	handleRefresh: () => void;
	setShowNew: any;
	errors: any;
}

const postName = 'Tickets';
const postEndpoint = '/tickets';
const subPostEndpoint = '/tickets/respuestas'
const defaultFilterKey = 'descripcion';


/**
 * @param PropsMainIndex son las props generales del template
 * @param selectedSubPost: Respuesta son las propiedades especificas de los tickets, mostrando como widgets la respuesta seleccionada
 * @returns MainIndex + ClienteWidget/RespuestaWidget/Comentarios + extraButtons
 */
export default function TicketPage() {
	const [selectedSubPost, setSelectedSubPost] = useState(null);
	const [editSubPost, setEditSubPost] = useState(false);

	const feederChildren = ({ post }: PropsMainIndex) => {
		return <SolicitudTicketCard post={post} setSelectedSubPost={setSelectedSubPost} selectedSubPost={selectedSubPost} setEditSubPost={setEditSubPost} editSubPost={editSubPost} />;
	};

	const widgetChildren = ({ selectedPost, handleRefresh, setShowNew }: PropsMainIndex) => {
		//TODO: useEffect triggereado por handleRefresh llama a setSelectedSubpost para actualizarlo?
		return (
			<div className="space-y-2">
				<RespuestaWidget
					respuesta={selectedSubPost}
					setShowEdit={setEditSubPost}
					setShowNew={setShowNew}
					showEdit={editSubPost}
					post={selectedPost}
					cliente={selectedPost.clienteServicio.cliente}
					handleFeederRefresh={handleRefresh}
				/>
				<SeccionComentarios selectedRespuesta={selectedSubPost}/> 
			</div>
		);
	};

	const newWidgetChildren = ({ selectedPost, handleRefresh, setShowNew }: PropsMainIndex) => {
		return <NuevoTicket ticket={selectedPost} clienteServicio={selectedPost?.clienteServicio} handleRefresh={handleRefresh} setShowNew={setShowNew}/>;
	};

	const extraButtons = (
		<>
			<Button Icon={PresentationChartLineIcon} title="Flujos" onClick={() => router.push('/flujos')} />
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
