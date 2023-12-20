import ToastCard from "@src/components/ui/ToastCard";
import axios from "axios";
import toast from "react-hot-toast";

export const postName = 'Tickets';
export const postEndpoint = '/tickets';
export const subPostEndpoint = '/ticketsAcciones';
export const defaultFilterKey = 'descripcion ó nombre de contacto';
export const orderKey = 'areaPorResponder';

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

export const opcionesExtraClasificacion = [
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

export const GetKml = async (categoria: string) => {
	const jsonRes = await axios.get(`${postEndpoint}/kml?categoria=${categoria}`);
	console.info(jsonRes.data);
	const kmlAPI = axios.create({
		baseURL: 'http://192.168.238.51:5500/',
		withCredentials: false,
		headers: {
			'Access-Control-Allow-Origin': '*'
		}
	})
	const kmlRes = await kmlAPI.post('generate_kml', jsonRes.data);
	console.info(kmlRes.data);
	return kmlRes.data;
}