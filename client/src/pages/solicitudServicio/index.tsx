/** @format */
import { SolicitudServicio } from '../../../types/typesSSO';
import NuevoSSWidget from '../../components/SS/NuevoSSWidget';
import SSRespuestaWidget from '../../components/SS/SSRespuestaWidget';
import SSItem from '../../components/SS/SSItem';
import { useState } from 'react';
import MainIndex from '../../components/MainIndex';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import NuevaSRespuestaWidget from '../../components/SS/NuevaSRespuestaWidget';

interface PropsSS {
	post: SolicitudServicio;
	setSelectedSubPost: () => void;
	selectedPost: SolicitudServicio;
	handleInputCancel: () => void;
	handlePost: () => void;
	errors: any;
}

const postName = 'Solicitud de Servicio';
const postEndpoint = '/solicitudServicio';
const filterKey = 'descripcion';

export default function solicitudServicioPage() {
	const [selectedSubPost, setSelectedSubPost] = useState(null);
	const [editSubPost, setEditSubPost] = useState(false);

	const feederChildren = ({ post }: PropsSS) => {
		return (
			<SSItem
				post={post}
				setSelectedSubPost={setSelectedSubPost}
				setEditSubPost={setEditSubPost}
				editSubPost={editSubPost}
			/>
		);
	};

	const widgetChildren = ({ selectedPost }: PropsSS) => {
		return (
			<div className="space-y-2">
				{editSubPost ? (
					<NuevaSRespuestaWidget
						resp={selectedSubPost}
						ss={selectedPost}
						handleCancel={() => setEditSubPost(false)}
					/>
				) : (
					<SSRespuestaWidget
						respuesta={selectedSubPost}
						setShowEdit={setEditSubPost}
						showEdit={editSubPost}
						ss={selectedPost}
					/>
				)}
				<ClienteWidget cliente={selectedPost.cliente} />
			</div>
		);
	};

	const newWidgetChildren = ({ selectedPost, handleInputCancel }: PropsSS) => {
		return <NuevoSSWidget ss={selectedPost} handleCancel={handleInputCancel} />;
	};

	return (
		<MainIndex
			postName={postName}
			postEndpoint={postEndpoint}
			filterKey={filterKey}
			feederChildren={feederChildren}
			widgetChildren={widgetChildren}
			newWidgetChildren={newWidgetChildren}
		/>
	);
}
