'use client';
import { ClienteServicioTicket, flujo_solicitud_tipo_enum } from '../../../types/typesSSO';
import AccionWidget from '../../components/flujos/AccionWidget';
import SolicitudTicketCard from '../../components/flujos/SolicitudTicketCard';
import { Suspense, useState } from 'react';
import MainIndex from '../../components/MainIndex';
import Button from '../../components/ui/Button';
import NuevoTicket from '../../components/flujos/NuevoTicketWidget';
import { MapIcon, LinkIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ToastCard from '@src/components/ui/ToastCard';
import ComboBox from '@src/components/ui/ComboBox';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Loading from '@src/components/ui/Loading';
import ExportButton from '@src/components/ui/ExportButton';
import { GetKml, defaultFilterKey, opcionesExtraClasificacion, orderKey, postEndpoint, postName } from '../api/ticket';

interface PropsMainIndex {
	post: ClienteServicioTicket;
	selectedPost: ClienteServicioTicket;
	handleRefresh: () => void;
	setShowNew: any;
	errors: any;
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
	const [categoria, setCategoria] = useState<string>(flujo_solicitud_tipo_enum.MANTENIMIENTO_EN_SITIO);

	const feederChildren = ({ post }: PropsMainIndex) => {
		return <SolicitudTicketCard post={post} setSelectedSubPost={setSelectedSubPost} selectedSubPost={selectedSubPost} setEditSubPost={setEditSubPost} editSubPost={editSubPost} />;
	};

	const widgetChildren = ({ selectedPost, handleRefresh }: PropsMainIndex) => {
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
		return <NuevoTicket ticket={selectedPost} clienteServicio={selectedPost?.clienteServicio} 
		handleRefresh={handleRefresh} setShowNew={setShowNew} />;
	};

	const downloadKML = async () => {
		const tKml = toast.loading('Generando KML');
	    try {
			const res = await GetKml(categoria);
			navigator.clipboard.writeText(res);
			toast.success('KML copiado a portapapeles', {id: tKml})
			const blob = new Blob([res], { type: "text/plain" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.download = "test.kml";
			link.href = url;
			link.click();				
		} catch (error) {
			console.error(error)
			toast.error('Algo salio mal al generar KML', {id: tKml});
		}
	}

	const extraButtons = <div className="flex items-center space-x-3">
		<Link href='/flujos'><Button Icon={LinkIcon} title="Flujos" /></Link>
		<Link href='/reportes'><Button Icon={PresentationChartLineIcon} title="Reportes" /></Link>
		<Button Icon={MapIcon} title='Export KML' onClick={downloadKML} />
	</div>;

	return (
  	  <Suspense fallback={<Loading />}>
		<MainIndex
			postName={postName}
			endpoint={`${postEndpoint}${seccion ? `/${seccion}` : ''}`}
			searchEndpoint={postEndpoint}
			extraButtons={extraButtons}
			defaultFilterKey={defaultFilterKey}
			feederChildren={feederChildren}
			widgetChildren={widgetChildren}
			newWidgetChildren={newWidgetChildren}
			orderKey={orderKey}
		/>
	  </Suspense>
	);
}
