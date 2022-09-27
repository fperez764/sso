import type { NextApiRequest, NextApiResponse } from 'next';

export default async function index(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    switch (method) {
        case 'GET':
            return res.status(200).json('GET SS');
        case 'POST':
            return res.status(200).json('POST SS');
        default:
            return res.status(400).json('Invalid Method');
    }
}
