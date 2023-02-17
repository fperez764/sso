import type { NextApiRequest, NextApiResponse } from 'next';
import {prisma} from '../../../../lib/prisma';
import logger from '../../../utils/logger';


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const data = await prisma.com_cliente.findMany();
        logger.silly(data);
        return res.status(200).json(data);
    } catch (e) {
        console.error(e);
    }
}
