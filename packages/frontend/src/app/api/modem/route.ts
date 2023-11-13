'use server';
import { DataModem, Hubs, ManufacterMacs, ReporteContador } from '@types/typesContador';
import axios, { AxiosError } from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';


/** modem/mac-address/{macAddress}
 * Obtiene el JSON del modem desde el hub Newtec
 */
async function getModem(mac: string, hub: string): Promise<DataModem> {
	if(!mac || mac.length === 0) throw new Error('MAC invalida');
	const url = `${process.env.CONTADOR_API}/${hub}/${mac}`;
	console.log(url);
	const res = await axios.get(url, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: process.env.CONTADOR_AUTH,
		},
	});
	if(res.data === "") throw new Error('Modem no encontrado en hubs.');
	//console.info(res.data?.id);
	const modemInfo = hub === Hubs.NEWTEC ? {
		id: res.data.id.systemId,
		nombre : res.data.id.name,
		plan : res.data.serviceProfileId.name,
		descripcion : res.data.description,
		bloqueado: res.data.locked,
		url : res.data.remoteGuiUrl,
	} : {
		id: res.data.subscriber,
		nombre : `${res.data.data.subscriber}/${res.data.data.managedgroup}/${res.data.data.opstate}`,
		plan : res.data.data.sla,
		descripcion : res.data.data.nombre,
		bloqueado: res.data.data.adminstate.includes('BLOCKED'),
	};
	return modemInfo;
  }

  async function getReporte(mac: string, fechaInicio: Date, fechaFin: Date): Promise<ReporteContador> {
	const url = `${process.env.CONTADOR_API}/reportes/${mac}`;
	console.debug('getReporte', url);
	const res = await axios.get(url, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: process.env.CONTADOR_AUTH,
		},
		params: {
			fechaInicio: fechaInicio.toISOString(),
			fechaFin: fechaFin.toISOString(),
		}
	});
	return res.data;
  }

  
export const getPaquetesContador = async (mac: string): Promise<PaqueteContador[]> => {
	const url = `${process.env.CONTADOR_API}/paquetes/${mac}`;
	console.debug('getPaquetesContador', url);
	const res = await axios.get(url, { headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		Authorization: process.env.CONTADOR_AUTH,
	}});	
	const {message, data} = res.data;
	//console.debug('getPaquetesContador', message);
	if(!data) throw new Error('Algo salio mal. Porfavor contacte a soporte');
	return res.data;
  }
    
  export const getReporteDia = async (mac: string, fechaInicio: Date, fechaFin: Date, tipoContabilizado='REGULAR') => {
	const url = `${process.env.CONTADOR_API}/reportes/dia/${mac}`;
	console.debug('getReporteDia', url);
	try{
	const res = await axios.get(url, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: process.env.CONTADOR_AUTH,
		},
		params: {
			fechaInicio: fechaInicio.toISOString(),
			fechaFin: fechaFin.toISOString(),
			tipoContabilizado
		}
	});
	//console.debug('getReporteDia', res.data);
	return res.data;
	} catch (error: AxiosError) {
		//console.error(error.response);
		return error.response?.data;
	}
  }
  
  export const getReporteHora = async (mac: string, fechaInicio: Date, fechaFin: Date, tipoContabilizado='REGULAR') => {
	const url = `${process.env.CONTADOR_API}/reportes/hora/${mac}`;
	console.debug('getReporteHora', url);
	try {
		const res = await axios.get(url, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: process.env.CONTADOR_AUTH,
			},
			params: {
				fechaInicio: fechaInicio.toISOString(),
				fechaFin: fechaFin.toISOString(),
				tipoContabilizado
			}
		});
		//console.debug('getReporteHora', res.data);
		return res.data;			
	} catch (error: AxiosError) {
		//console.error(error.response);
		return error.response?.data;
	}
  }


export const getModemInfo = async (mac: string) => {
	const hub = getHub(mac);	
	if(hub === Hubs.NOID) return { status: 400, message: 'MAC no identificada' };
	return await getModem(mac, hub);
};

export const getModemReporte = async (mac: string, fechaInicio: Date, fechaFin: Date) => {
	const hub = getHub(mac);	
	if(hub === Hubs.NOID) return { status: 400, message: 'MAC no identificada' };
	if(hub !== Hubs.NEWTEC) return { status: 400, message: 'Solo MACs de Newtec tienen reportes de megas.' };
	return await getReporte(mac, fechaInicio, fechaFin);
}

export const getHub = (mac: string) =>{
	let macClean = mac.replaceAll(':', '');
	macClean = macClean.replaceAll('-', '');
	macClean = macClean.substring(0, 6);
	switch (macClean) {
		case ManufacterMacs.GILAT:
			return Hubs.GILAT;
		case ManufacterMacs.NEWTEC:
			return Hubs.NEWTEC;
		default:
			return Hubs.NOID
	}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const { mac } = req.query;
	if (!mac || Array.isArray(mac)) return res.status(400).json({ message: 'mac es un campo obligatorio.' });
    console.log('Buscar modem: ' + mac);
	const resHub = await getModemInfo(mac);
	res.status(200).json({ message: 'OK', data: resHub });
}
