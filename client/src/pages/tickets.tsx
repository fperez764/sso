/** @format */
import { ServicioTicket } from '../../types/typesSSO';
import NuevoFlujo from '../components/flujos/NuevoFlujoWidget';
import RespuestaWidget from '../components/flujos/RespuestaWidget';
import Flujo from '../components/flujos/Flujo';
import { useState } from 'react';
import MainIndex from '../components/MainIndex';
import ClienteWidget from '../components/cliente/ClienteWidget';
import NuevaRespuestaWidget from '../components/flujos/NuevaRespuestaWidget';

interface PropsSS {
	post: ServicioTicket;
	setSelectedSubPost: () => void;
	selectedPost: ServicioTicket;
	handleInputCancel: () => void;
	handlePost: () => void;
	errors: any;
}

const postName = 'Tickets';
const postEndpoint = '/tickets';
const filterKey = 'descripcion';

export default function TicketPage() {
	const [selectedSubPost, setSelectedSubPost] = useState(null);
	const [editSubPost, setEditSubPost] = useState(false);

	const feederChildren = ({ post }: PropsSS) => {
		return <Flujo post={post} setSelectedSubPost={setSelectedSubPost} setEditSubPost={setEditSubPost} editSubPost={editSubPost} />;
	};

	const widgetChildren = ({ selectedPost }: PropsSS) => {
		return (
			<div className="space-y-2">
				{editSubPost ? (
					<NuevaRespuestaWidget resp={selectedSubPost} ss={selectedPost} handleCancel={() => setEditSubPost(false)} />
				) : (
					<RespuestaWidget respuesta={selectedSubPost} setShowEdit={setEditSubPost} showEdit={editSubPost} ss={selectedPost} />
				)}
				<ClienteWidget cliente={selectedPost.clienteServicio.cliente} />
			</div>
		);
	};

	const newWidgetChildren = ({ selectedPost, handleInputCancel }: PropsSS) => {
		return <NuevoFlujo ss={selectedPost} handleCancel={handleInputCancel} />;
	};

	return <MainIndex postName={postName} endpoint={postEndpoint} filterKey={filterKey} feederChildren={feederChildren} widgetChildren={widgetChildren} newWidgetChildren={newWidgetChildren} />;
}
