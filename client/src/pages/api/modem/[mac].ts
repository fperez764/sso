import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

type Data = {
	message: string;
	data?: any;
};

const GLTimeoutBackup = 10000;
const requestBuilder = (resource: string, body: string) => {
	return {
		url: `${process.env.GILAT_URL}${resource}`,
		timeout: GLTimeoutBackup,
		json: false,
		headers: {
			'Content-Type': 'text/xml',
			Authorization: process.env.GILAT_AUTH || 'Basic auth not found on .env',
		},
		rejectUnauthorized: false,
		body: '<?xml version="1.0" encoding="utf-8"?>' + '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:com="com.gilat.ngnms.server.services.ws.cfg.face" >' + body,
	};
};

/**
 * Identifica el nombre, grupo, id y SLA del un modem en base a su direccion mac
 * @param {MAC} Mac que identifica al modem Gilat
 * @returns {Promise<{status:Number, message:String, data:JSON}>}
 */
const getModemGilat = async (MAC: string) => {
	try {
		const options = requestBuilder('cpeService', `<soapenv:Body><com:getCPEbyMacAddress><macAddress>${MAC}</macAddress></com:getCPEbyMacAddress></soapenv:Body></soapenv:Envelope>`);
		const result = await axios.post(options.url, options.body, { headers: options.headers });
		if (result.status !== 200) return { status: 204, message: 'MAC no encontrada: ', data: result };
		const cpes = result.data['soap:Envelope']['soap:Body']['ns2:getCPEbyMacAddressResponse']['return'];
		const cpe = {
			mac: cpes.macAddress,
			nombre: cpes.rtnClassifierName,
			descripcion: cpes.description,
			plan: cpes.slaName,
			estadoModem: cpes.operationalState,
			estadoBloqueo: cpes.provStatus,
			managedgroup: cpes.cpeId.managedGroupId,
			subscriber: cpes.cpeId.subscriberId,
			adminstate: cpes.authorization,
		};
		return { status: 200, message: 'Se recupero informacion del Hub Gilat para el modem ' + cpe.nombre, data: cpe };
	} catch (error) {
        console.log(JSON.stringify(error));
		return { status: 500, message: `Gilat: Algo salio mal al buscar al modem ${MAC}\n${error}` };
	}
};

///modem/mac-address/{macAddress}
/**
 * Obtiene el JSON del modem desde el hub Newtec
 * @param {String} mac del modem Newtec
 * @returns {Promise<{status:Number, message:String, data:JSON}>}
 */
async function getModemNewtec(mac: string) {
	try {
        console.log(`NT: ${process.env.NEWTEC_URL}/modem?macAddress=${mac}`);
		const resGet = await axios.get(`${process.env.NEWTEC_URL}/modem?macAddress=${mac}`, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: process.env.NEWTEC_AUTH || 'Basic auth not found on .env',
			},
		});
		let data;
		if(resGet.data.length > 0){
			try {
				data = {
					mac: resGet.data[0]['macAddress'],
					nombre: resGet.data[0]['id']['name'],
					descripcion: resGet.data[0]['description'],
					modelo: resGet.data[0]['serviceProfileId']['type'],
					plan: resGet.data[0]['serviceProfileId']['name'],
					estadoBloqueo: resGet.data[0]['locked']
				 };
			} catch (error) {
				console.error('Algo salio mal al parsear respuesta de NT: ' + error);
				data = resGet.data;
			}
		}
		return { status: 200, message: `Se recupero informacion del Newtec para el modem ${mac}`, data };
	} catch (err) {
		return { status: 500, message: `Newtec: No se pudo recuperar informacion del modem ${mac}`, data: err };
	}
}

export enum Hubs {
	NEWTEC = 'NEWTEC',
	GILAT = 'GILAT',
}

export enum ManufacterMacs {
	NEWTEC = '000639',
	GILAT = '00A0AC',
}

//TODO: Mover a APIs
const getModemInfo = async (mac: string) => {
	let macClean = mac.replaceAll(':', '');
	macClean = macClean.replaceAll('-', '');
	macClean = macClean.substring(0, 6);
	switch (macClean) {
		case ManufacterMacs.GILAT:
			return await getModemGilat(mac);
		case ManufacterMacs.NEWTEC:
			return await getModemNewtec(mac);
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
