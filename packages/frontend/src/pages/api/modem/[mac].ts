import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	message: string;
	data?: any;
};

///modem/mac-address/{macAddress}
/**
 * Obtiene el JSON del modem desde el hub Newtec
 * @param {String} mac del modem Newtec
 * @returns {Promise<{status:Number, message:String, data:JSON}>}
 */
async function getModem(mac: string, hub: string) {
	if(!mac || mac.length === 0) throw new Error('MAC invalida');
	const url = `${process.env.CONTADOR_API || 'https://contador.abe.bo/api/v1'}/${hub}/${mac}`;
	console.log(url);
	const res = await axios.get(url, {
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: process.env.CONTADOR_AUTH || 'Basic Y29udGFkb3I6YzBudEBkb3I=',
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

export enum Hubs {
	NEWTEC = 'newtec',
	GILAT = 'gilat',
}

export enum ManufacterMacs {
	NEWTEC = '000639',
	GILAT = '00A0AC',
}

//TODO: Mover a APIs
export const getModemInfo = async (mac: string) => {
	let macClean = mac.replaceAll(':', '');
	macClean = macClean.replaceAll('-', '');
	macClean = macClean.substring(0, 6);
	switch (macClean) {
		case ManufacterMacs.GILAT:
			return await getModem(mac, Hubs.GILAT);
		case ManufacterMacs.NEWTEC:
			return await getModem(mac, Hubs.NEWTEC);
		default:
			return { status: 400, message: 'Hub no identificado' };
	}
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	const { mac } = req.query;
	if (!mac || Array.isArray(mac)) return res.status(400).json({ message: 'mac es un campo obligatorio.' });
    console.log('Buscar modem: ' + mac);
	const { status, message, data } = await getModemInfo(mac);
	res.status(status).json({ message, data: data });
}
