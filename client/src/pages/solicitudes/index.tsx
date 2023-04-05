/** @format */
import { ClienteSolicitud } from '../../../types/typesSSO';
import NuevaSolicitud from '../../components/flujos/NuevaSolicitudWidget';
import RespuestaWidget from '../../components/flujos/RespuestaWidget';
import SolicitudTicketCard from '../../components/flujos/SolicitudTicketCard';
import { useState } from 'react';
import MainIndex from '../../components/MainIndex';
import ClienteWidget from '../../components/cliente/ClienteWidget';

interface PropsSS {
	post: ClienteSolicitud;
	setSelectedSubPost: () => void;
	selectedPost: ClienteSolicitud;
	handlePost: () => void;
	handleRefresh: () => void;
	errors: any;
}

const postName = 'Solicitudes';
const postEndpoint = '/solicitudes';
const subPostEndpoint = '/solicitudes/respuestas';
const filterKey = 'descripcion';

export default function solicitudesPage() {
	const [selectedSubPost, setSelectedSubPost] = useState(null);
	const [editSubPost, setEditSubPost] = useState(false);

	const feederChildren = ({ post }: PropsSS) => {
		return <SolicitudTicketCard 
			post={post} 
			setSelectedSubPost={setSelectedSubPost} 
			selectedSubPost={selectedSubPost}
			setEditSubPost={setEditSubPost} 
			editSubPost={editSubPost} />;		
	};

	const widgetChildren = ({ selectedPost, handleRefresh }: PropsSS) => {
		return (
			<div className="space-y-2">
				<RespuestaWidget respuesta={selectedSubPost} setShowEdit={setEditSubPost} showEdit={editSubPost} 
				post={selectedPost} handleFeederRefresh={handleRefresh} />
				<ClienteWidget post={selectedPost.cliente} />
			</div>
		);
	};

	const newWidgetChildren = ({ selectedPost }: PropsSS) => {
		return <NuevaSolicitud ss={selectedPost} />;
	};

	return <MainIndex postName={postName} endpoint={postEndpoint} defaultFilterKey={filterKey} feederChildren={feederChildren} widgetChildren={widgetChildren} newWidgetChildren={newWidgetChildren} />;
}
