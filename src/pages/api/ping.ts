// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import queryDB from '../../models/db';
import logger from '../../utils/logger';

type Data = {message: string; time: string}

export default async function index(req: NextApiRequest, res: NextApiResponse<Data>){
    const resDB = await queryDB("SELECT NOW()", []);
    return res.json({message: `pong`, time: `${resDB.rows[0].now}`});
};