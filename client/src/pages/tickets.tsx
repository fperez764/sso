/** @format */
import { ClienteServicioTicket } from '../../types/typesSSO';
import NuevaSolicitud from '../components/flujos/NuevaSolicitudWidget';
import RespuestaWidget from '../components/flujos/RespuestaWidget';
import FlujoCard from '../components/flujos/FlujoCard';
import { useState } from 'react';
import MainIndex from '../components/MainIndex';
import ClienteWidget from '../components/cliente/ClienteWidget';
import NuevaRespuestaWidget from '../components/flujos/NuevaRespuestaWidget';

interface PropsSS {
	post: ClienteServicioTicket;
	setSelectedSubPost: () => void;
	selectedPost: ClienteServicioTicket;
	handleInputCancel: () => void;
	handlePost: () => void;
	errors: any;
}

const postName = 'Tickets';
const postEndpoint = '/tickets';
const defaultFilterKey = 'descripcion';

export default function TicketPage() {
	const [selectedSubPost, setSelectedSubPost] = useState(null);
	const [editSubPost, setEditSubPost] = useState(false);

	const feederChildren = ({ post }: PropsSS) => {
		return <FlujoCard post={post} setSelectedSubPost={setSelectedSubPost} setEditSubPost={setEditSubPost} editSubPost={editSubPost} />;
	};

	const widgetChildren = ({ selectedPost }: PropsSS) => {
		return (
			<div className="space-y-2">
				{editSubPost ? (
					<NuevaRespuestaWidget resp={selectedSubPost} ss={selectedPost} handleCancel={() => setEditSubPost(false)} />
				) : (
					<RespuestaWidget respuesta={selectedSubPost} setShowEdit={setEditSubPost} showEdit={editSubPost} post={selectedPost} />
				)}
				<ClienteWidget cliente={selectedPost.clienteServicio.cliente} />
			</div>
		);
	};

	const newWidgetChildren = ({ selectedPost, handleInputCancel }: PropsSS) => {
		return <NuevaSolicitud ss={selectedPost} handleCancel={handleInputCancel} />;
	};

	return (
		<MainIndex postName={postName} endpoint={postEndpoint} defaultFilterKey={defaultFilterKey} feederChildren={feederChildren} widgetChildren={widgetChildren} newWidgetChildren={newWidgetChildren} />
	);
}
