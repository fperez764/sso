/** @format */

import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		const data = await prisma.com_cliente.findMany({ 
			skip: 0, 
			take: 250, 
			where: { 
				activo: true, 
				fecha_alta: { gte: new Date("01-03-2023") }
			},
			include: {
				fac_cliente_servicio: {include: {alm_articulo: true}},
				sube_cliente_servicio: true,
				sube_modem_newtec: {select: {mac:true}}
			}
		});
		console.log("RSS clientes de este anho: " + data.length);
		return res.status(200).json(data);
	} catch (e) {
		console.error(e);
	}
}
