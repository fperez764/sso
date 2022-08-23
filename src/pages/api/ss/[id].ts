import { NextApiRequest, NextApiResponse } from "next";

const ss = (req: NextApiRequest, res: NextApiResponse) => {
    const {method, query} = req;
    switch(method){
        case 'GET':
            return res.json('Obtener SS ' + query.id);
        case 'PUT':
            return res.json('Actualizar SS ' + query.id);
        case 'DELETE':
            return res.json(`Eliminar SS ${query.id}`)
        default:
            return res.status(400).json(`Method not allowed`);
    }
};

export default ss;