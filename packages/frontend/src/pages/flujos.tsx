import { FlujoSolicitud, FlujoTicket } from '../../types/typesSSO';
import { useState } from 'react';
import MainIndex from '../components/MainIndex';
import FlujoCard from '../components/flujos/FlujoCard';
import NuevoFlujoWidget from '../components/flujos/NuevoFlujoWidget';

interface PropsMainIndex {
	post: FlujoTicket;
	selectedPost: FlujoTicket;
	handleRefresh: () => void;
	errors: any;
}

const postName = 'Flujos';
const postEndpoint = '/flujosTickets';
const defaultFilterKey = 'nombre';

/**
 * @param PropsMainIndex son las props generales del template
 * @param selectedSubPost: Respuesta son las propiedades especificas de los tickets, mostrando como widgets la respuesta seleccionada
 * @returns MainIndex + ClienteWidget/accionesWidget/Comentarios + extraButtons
 */
export default function FlujosPage() {
	const [selectedSubPost, setSelectedSubPost] = useState(null);
	const [editSubPost, setEditSubPost] = useState(false);

	const feederChildren = ({ post }: PropsMainIndex) => {
		return <FlujoCard post={post} setSelectedSubPost={setSelectedSubPost} selectedSubPost={selectedSubPost} setEditSubPost={setEditSubPost} editSubPost={editSubPost} />;
	};

	const widgetChildren = ({ selectedPost, handleRefresh }: PropsMainIndex) => {
		return <NuevoFlujoWidget post={selectedPost} handleFeederRefresh={handleRefresh} />;
	};

	const newWidgetChildren = ({ handleRefresh }: PropsMainIndex) => {
		return <NuevoFlujoWidget handleFeederRefresh={handleRefresh} />;
	};

	return (
		<MainIndex postName={postName} endpoint={postEndpoint} defaultFilterKey={defaultFilterKey} feederChildren={feederChildren} widgetChildren={widgetChildren} newWidgetChildren={newWidgetChildren} />
	);
}
