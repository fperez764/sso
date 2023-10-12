'use client';
import { ClienteServicioTicket } from '../../../types/typesSSO';
import AccionWidget from '../../components/flujos/AccionWidget';
import SolicitudTicketCard from '../../components/flujos/SolicitudTicketCard';
import { useState } from 'react';
import MainIndex from '../../components/MainIndex';
import Button from '../../components/ui/Button';
import NuevoTicket from '../../components/flujos/NuevoTicketWidget';
import { LinkIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ToastCard from '@src/components/ui/ToastCard';
import ComboBox from '@src/components/ui/ComboBox';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

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

const opcionesExtraClasificacion = [
	'SOPORTE_REMOTO: Revisión de Equipos Remotos',
	'SOPORTE_REMOTO: Revisión en HUB/Core/Cabecera/Contribución',
	'SOPORTE_REMOTO: Revisión por Megas',
	'SOPORTE_REMOTO: Revisión por Facuración (Periodo Sin Servicio)',
	'SOPORTE_REMOTO: Reclamo por Cobranzas (Pasarela)',
	'SOPORTE_REMOTO: Cambio de Contraseña',
	'SOPORTE_REMOTO: Desapuntamiento de Antena',
	'SOPORTE_REMOTO: Otros',
	'MANTENIMIENTO_EN_SITIO: Otros',
	'MANTENIMIENTO_EN_SITIO: Modem Defectuoso',
	'MANTENIMIENTO_EN_SITIO: BUC/LNB/ILB Defectuoso',
	'MANTENIMIENTO_EN_SITIO: Conectores/Cables Defectuosos',
	'MANTENIMIENTO_EN_SITIO: Desapuntamiento de Antena',
	'MANTENIMIENTO_EN_SITIO: Energía Fotovoltaica (Instalado por la ABE)',
	'MODIFICACION_SERVICIO: De Plan',
	'MODIFICACION_SERVICIO: De Servicio',
	'MODIFICACION_SERVICIO: De Titularidad',
	'MODIFICACION_SERVICIO: Traslado',
	'MODIFICACION_SERVICIO: Corte Temporal',
	'MODIFICACION_SERVICIO: Rehabilitación de Servicio',
	'MODIFICACION_SERVICIO: Megas de Regalo',
	'MODIFICACION_SERVICIO: Reposición de Equipos',
	'BAJA_DE_SERVICIO: Otros',
	'BAJA_DE_SERVICIO: Otra Tecnología',
	'BAJA_DE_SERVICIO: Cambio de Domicilio',
	'BAJA_DE_SERVICIO: Mal Servicio',
	'BAJA_DE_SERVICIO: Precio Elevado',
	]

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
	let option = 'SOPORTE_REMOTO: Otros';
	ToastCard(<ComboBox options={opcionesExtraClasificacion} setData={(value: string)=> option = value} 
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
	const searchParams = useSearchParams();
	const seccion = searchParams?.get('seccion') || null;

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
					ticket={selectedPost}
					cliente={selectedPost.clienteServicio?.cliente}
					handleFeederRefresh={handleRefresh}
				/>
			</div>
		);
	};

	const newWidgetChildren = ({ selectedPost, handleRefresh, setShowNew }: PropsMainIndex) => {
		return <NuevoTicket ticket={selectedPost} clienteServicio={selectedPost?.clienteServicio} handleRefresh={handleRefresh} setShowNew={setShowNew} />;
	};

	const extraButtons = <div className="flex">
			<Link href='/flujos'><Button Icon={LinkIcon} title="Flujos" /></Link>
			<Link href='/reportes'><Button Icon={PresentationChartLineIcon} title="Reportes" /></Link>
	</div>;

	return (
		<MainIndex
			postName={postName}
			endpoint={`${postEndpoint}${seccion ? `/${seccion}` : ''}`}
			extraButtons={extraButtons}
			defaultFilterKey={defaultFilterKey}
			feederChildren={feederChildren}
			widgetChildren={widgetChildren}
			newWidgetChildren={newWidgetChildren}
			orderKey={orderKey}
		/>
	);
}
