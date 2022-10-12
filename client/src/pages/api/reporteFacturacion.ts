// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

type Data = {
    name: string;
};




export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    res.status(200).json({ name: JSON.stringify(await getFacturas()) });
}


async function getFacturas() {
	console.log('obtener facturas');
	let resPagos = {};
    try {
        const fechaFinal = new Date();
        const fechaInicial = new Date().setMonth(fechaFinal.getMonth() -1);
        const filtroFechas = '?fechaInicio=2022-10-01&fechaFin=2022-10-05';

        const instance = axios.create({
            baseURL: process.env.FACTURACION_URL_BASE,
            timeout: 10000,
            headers: { 'Authorization': 'Bearer '+ process.env.FACTURACION_TOKEN },
        });
        
        const res = await instance.get(process.env.FACTURACION_GET_FACTURAS + filtroFechas);
        console.log(res);
		resPagos = res.data;
    } catch (e) {
        console.log('Error al cargar facturas: ' + e);
        return { props:{ mensaje: { e } } };
    }
    return {
        props: { resPagos },
    };
}