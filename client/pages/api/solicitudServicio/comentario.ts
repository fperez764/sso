// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
//import { Comentario } from '../../typings'

type Data = {
    mensaje: string;
};

type Comentario = {
    contenido: string;
    usuarioCreacion: string;
    solicitudServicioId: number
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const comentario: Comentario = JSON.parse(req.body);
    const mutations = {mutations:[{create:{
        _type: 'comentario',
        comentario: comentario.contenido,
        usuarioCreacion: comentario.usuarioCreacion,
        solicitudServicio: {
            _type: 'reference',
            _ref: comentario.solicitudServicioId,
        }
    }}]}

    const apiEndPoint = `sanitythingy/api`;
    const result = await fetch(apiEndPoint, {
        headers: {
            'Content-Type': 'application/json', 
            Authorization: `Bearer ${process.env.BACKEND_TOKEN}`
        },
        body: JSON.stringify(mutations), 
        method: 'POST',
    })
    const json = await result.json();
    res.status(200).json({ mensaje: 'Comentario agregado' });
}
