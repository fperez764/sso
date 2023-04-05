/** @format */
import { ClienteServicioTicket } from '../../../types/typesSSO';
import RespuestaWidget from '../../components/flujos/RespuestaWidget';
import SolicitudTicketCard from '../../components/flujos/SolicitudTicketCard';
import { useState } from 'react';
import MainIndex from '../../components/MainIndex';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import Button from '../../components/Button';
import NuevoTicket from '../../components/flujos/NuevoTicketWidget';
import { PresentationChartLineIcon } from '@heroicons/react/24/outline';
import SeccionComentarios from '../../components/flujos/Comentarios';
import router from 'next/router';

interface PropsMainIndex {
	post: ClienteServicioTicket;
	selectedPost: ClienteServicioTicket;
	handleRefresh: () => void;
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

	const widgetChildren = ({ selectedPost, handleRefresh }: PropsMainIndex) => {
		//TODO: useEffect triggereado por handleRefresh llama a setSelectedSubpost para actualizarlo?
		return (
			<div className="space-y-2">
				<ClienteWidget post={selectedPost.clienteServicio.cliente} />				
				<RespuestaWidget respuesta={selectedSubPost} setShowEdit={setEditSubPost} showEdit={editSubPost} post={selectedPost}  handleFeederRefresh={handleRefresh}/>
				<SeccionComentarios selectedRespuesta={selectedSubPost}/> 
			</div>
		);
	};

	const newWidgetChildren = ({ selectedPost, handleRefresh}: PropsMainIndex) => {
		return <NuevoTicket ticket={selectedPost} clienteServicio={selectedPost?.clienteServicio} handleRefresh={handleRefresh}/>;
	};

	const extraButtons = (
		<>
			<Button Icon={PresentationChartLineIcon} title="Flujos" onClick={()=>router.push('/flujos')} />
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
