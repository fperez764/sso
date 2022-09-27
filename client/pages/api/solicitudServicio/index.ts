import type { NextApiRequest, NextApiResponse } from 'next';

export default async function index(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    switch (method) {
        case 'GET':
            return res.status(200).json(SSJsonExample);
        case 'POST':
            return res.status(200).json('POST SS');
        default:
            return res.status(400).json('Invalid Method');
    }
}


const SSJsonExample = [
    {
        'id': 1,
        'fecha_creacion': '2022-01-01',
        'usuario_creacion': 'test1',
    },
    {
        id: 2,
        fecha_creacion: '2022-01-02',
        usuario_creacion: 'test2',
    },
];