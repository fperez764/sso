/** @format */
import { ClienteSolicitud } from '../../../types/typesSSO';
import NuevaSolicitud from '../../components/flujos/NuevaSolicitudWidget';
import RespuestaWidget from '../../components/flujos/RespuestaWidget';
import Flujo from '../../components/flujos/Flujo';
import { useState } from 'react';
import MainIndex from '../../components/MainIndex';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import NuevaRespuestaWidget from '../../components/flujos/NuevaRespuestaWidget';

interface PropsSS {
	post: ClienteSolicitud;
	setSelectedSubPost: () => void;
	selectedPost: ClienteSolicitud;
	handleInputCancel: () => void;
	handlePost: () => void;
	errors: any;
}

const postName = 'Solicitudes';
const postEndpoint = '/solicitudes';
const filterKey = 'descripcion';

export default function clienteSolicitudPage() {
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
					<RespuestaWidget respuesta={selectedSubPost} post={selectedPost} setShowEdit={setEditSubPost} showEdit={editSubPost} />
				)}
				<ClienteWidget cliente={selectedPost.cliente} />
			</div>
		);
	};

	const newWidgetChildren = ({ selectedPost, handleInputCancel }: PropsSS) => {
		return <NuevaSolicitud ss={selectedPost} handleCancel={handleInputCancel} />;
	};

	return <MainIndex postName={postName} endpoint={postEndpoint} filterKey={filterKey} feederChildren={feederChildren} widgetChildren={widgetChildren} newWidgetChildren={newWidgetChildren} />;
}
