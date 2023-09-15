import { ClienteServicioTicket } from '../../../types/typesSSO';
import AccionWidget from '../../components/flujos/AccionWidget';
import SolicitudTicketCard from '../../components/flujos/SolicitudTicketCard';
import { useState } from 'react';
import MainIndex from '../../components/MainIndex';
import Button from '../../components/ui/Button';
import NuevoTicket from '../../components/flujos/NuevoTicketWidget';
import { LinkIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import router from 'next/router';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ToastCard from '@src/components/ui/ToastCard';
import ComboBox from '@src/components/ui/ComboBox';

interface PropsMainIndex {
	post: ClienteServicioTicket;
	selectedPost: ClienteServicioTicket;
	handleRefresh: () => void;
	setShowNew: any;
	errors: any;
}

const postName = 'Tickets';
const postEndpoint = '/tickets';
const subPostEndpoint = '/ticketsAcciones';
const defaultFilterKey = 'descripcion ó nombre de contacto';
const orderKey = 'areaPorResponder';

export async function eliminarTicket(ticketId: number) {
	if (window.confirm('Estas seguro de eliminar este ticket.')) {
		//dar de baja solicitud/ticket si la logica de negocio lo permite;
		try {
			await axios.delete(`${postEndpoint}/${ticketId}`);
			toast.success('Se elimino la solicitud/ticket ' + ticketId);
		} catch (error) {
			toast.error(`No se pudo eliminar la solicitud/ticket: ${ticketId}, error: ${error}`);
		}
	}
}

export async function anularTicket(ticketId: number) {
	if (window.confirm('Estas seguro de anular este ticket.')) {
		//dar de baja Post si la logica de negocio lo permite;
		try {
			await axios.delete(`${postEndpoint}/${ticketId}`);
			toast.success(`Se anulo el ticket ${ticketId}`);
		} catch (error) {
			toast.error(`No se pudo anular el ticket: ${ticketId}, error: ${error}`);
		}
	}
}

export async function anularRespuesta(ticketRespuestaId: number | undefined) {
	if(!ticketRespuestaId) return;
	if (window.confirm('Estas seguro de anular esta respuesta.')) {
		//dar de baja Post si la logica de negocio lo permite;
		try {
			await axios.delete(`${subPostEndpoint}/${ticketRespuestaId}`);
			toast.success(`Se anulo la respuesta ${ticketRespuestaId}`);
		} catch (error) {
			toast.error(`No se pudo anular la respuesta: ${ticketRespuestaId}, error: ${error}`);
		}
	}
}

export async function resolverTicket(ticketId: number) {
	let option = 'RECLAMO';
	ToastCard(<ComboBox options={['RECLAMO', 'CONSULTA', 'MANTENIMIENTO']} setData={(value: string)=> option = value} 
	postName='Clasificar Ticket' />, () => {
		try {
			axios.post(`${postEndpoint}/resolver/${ticketId}?tipo=${option}`).then((res) => {
				toast.success(`Ticket ${ticketId}, resuelto como ${option}.`);	
			});
		} catch (error: any) {
			toast.error(`Algo salio mal al resolver el ticket: ${ticketId}, error: ${error.response?.data?.message}`);
		}
	}, 'Resolver Ticket', 'top-center');
}

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
				<AccionWidget
					accion={selectedSubPost}
					setShowEdit={setEditSubPost}
					showEdit={editSubPost}
					post={selectedPost}
					cliente={selectedPost.clienteServicio?.cliente}
					handleFeederRefresh={handleRefresh}
				/>
			</div>
		);
	};

	const newWidgetChildren = ({ selectedPost, handleRefresh, setShowNew }: PropsMainIndex) => {
		return <NuevoTicket ticket={selectedPost} clienteServicio={selectedPost?.clienteServicio} handleRefresh={handleRefresh} setShowNew={setShowNew} />;
	};

	const extraButtons = (<div className="flex">
			<Button Icon={LinkIcon} title="Flujos" onClick={() => router.push('/flujos')} />
			<Button Icon={PresentationChartLineIcon} title="Reportes" onClick={() => router.push('/reportes')} />
			</div>
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
			orderKey={orderKey}
		/>
	);
}
