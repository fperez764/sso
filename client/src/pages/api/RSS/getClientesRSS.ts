import type { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '../../../../lib/prisma';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const data = await prisma.com_cliente.findMany({skip: 0, take: 50, where:{activo:true}});
        console.log(data.length);
        return res.status(200).json(data);
    } catch (e) {
        console.error(e);
    }
}
