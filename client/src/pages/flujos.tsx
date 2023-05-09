/** @format */
import { SolicitudGrupo, TicketGrupo } from '../../types/typesSSO';
import { useState } from 'react';
import MainIndex from '../components/MainIndex';
import FlujoCard from '../components/flujos/FlujoCard';
import NuevoGrupoWidget from '../components/flujos/NuevoGrupoWidget';

interface PropsMainIndex {
	post: TicketGrupo | SolicitudGrupo;
	selectedPost: TicketGrupo | SolicitudGrupo;
	handleRefresh: () => void;
	errors: any;
}

const postName = 'Flujos';
const postEndpoint = '/grupoTickets';
const defaultFilterKey = 'nombre';

/**
 * @param PropsMainIndex son las props generales del template
 * @param selectedSubPost: Respuesta son las propiedades especificas de los tickets, mostrando como widgets la respuesta seleccionada
 * @returns MainIndex + ClienteWidget/RespuestaWidget/Comentarios + extraButtons
 */
export default function FlujosPage() {
	const [selectedSubPost, setSelectedSubPost] = useState(null);
	const [editSubPost, setEditSubPost] = useState(false);

	const feederChildren = ({ post }: PropsMainIndex) => {
		return <FlujoCard post={post} setSelectedSubPost={setSelectedSubPost} selectedSubPost={selectedSubPost} setEditSubPost={setEditSubPost} editSubPost={editSubPost} />;
	};

	const widgetChildren = ({ selectedPost, handleRefresh }: PropsMainIndex) => {
		return <NuevoGrupoWidget post={selectedPost} handleFeederRefresh={handleRefresh} />;
	};

	const newWidgetChildren = ({ handleRefresh }: PropsMainIndex) => {
		return <NuevoGrupoWidget handleFeederRefresh={handleRefresh} />;
	};

	return (
		<MainIndex postName={postName} endpoint={postEndpoint} defaultFilterKey={defaultFilterKey} feederChildren={feederChildren} widgetChildren={widgetChildren} newWidgetChildren={newWidgetChildren} />
	);
}
