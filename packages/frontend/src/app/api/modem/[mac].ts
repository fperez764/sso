import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	message: string;
	data?: any;
};
export type DataModem = {
	nombre: string, 
	plan: string, 
	descripcion: string, 
	bloqueado: boolean, 
	url?: string
}

export type ReporteContador = {
	consumoTotalRegularMB?: number
	consumoTotalBonoMB?: number
	consumoTotalReducidoMB?:number
	consumoTotalNoQMMB?: number
}

export enum Hubs {
	NEWTEC = 'newtec',
	GILAT = 'gilat',
	NOID = 'No Identificado'
}

export enum ManufacterMacs {
	NEWTEC = '000639',
	GILAT = '00A0AC',
}
/** modem/mac-address/{macAddress}
 * Obtiene el JSON del modem desde el hub Newtec
 */
async function getModem(mac: string, hub: string): Promise<DataModem> {
	if(!mac || mac.length === 0) throw new Error('MAC invalida');
	const url = `${process.env.CONTADOR_API || 'https://contador.abe.bo/api/v1'}/${hub}/${mac}`;
	console.log(url);
	const res = await axios.get(url, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: process.env.CONTADOR_AUTH,
		},
	});
	if(res.data === "") throw new Error('Modem no encontrado en hubs.');
	console.info(res);
	const modemInfo = hub === Hubs.NEWTEC ? {
		nombre : res.data.id.name,
		plan : res.data.serviceProfileId.name,
		descripcion : res.data.description,
		bloqueado: res.data.locked,
		url : res.data.remoteGuiUrl,
	} : {
		nombre : `${res.data.data.subscriber}/${res.data.data.managedgroup}/${res.data.data.opstate}`,
		plan : res.data.data.sla,
		descripcion : res.data.data.nombre,
		bloqueado: res.data.data.adminstate.includes('BLOCKED'),
	};
	return modemInfo;
  }

  async function getReporte(mac: string, fechaInicio: Date, fechaFin: Date): Promise<ReporteContador> {
	const url = `${process.env.CONTADOR_API || 'https://contador.abe.bo/api/v1'}/reportes/${mac}`;
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

const getHub = (mac: string) =>{
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
