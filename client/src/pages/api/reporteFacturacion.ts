// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { RespuestaABEFAC } from '../../../types/typesABEFAC';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RespuestaABEFAC>
) {
    res.status(200).json(await getResFacturas(req.body.filtroFechas));
}


//Server side rendering: Vercel
export const getResFacturas = async (filtroFechas: string) => {
    console.log('obtener facturas aca: ' + process.env.FACTURACION_URL_BASE + process.env.FACTURACION_GET_FACTURAS + filtroFechas);       
    const instance = axios.create({
        baseURL: process.env.FACTURACION_URL_BASE,
        timeout: 10000,
        headers: { 'Authorization': 'Bearer '+ process.env.FACTURACION_TOKEN },
    });
    const res = await instance.get(process.env.FACTURACION_GET_FACTURAS + filtroFechas);
    return res.data;
};
