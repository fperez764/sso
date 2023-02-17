// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { RespuestaABEFAC } from '../../../types/typesABEFAC';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import logger from '../../utils/logger';

dayjs.locale(es);
dayjs.extend(relativeTime);

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<RespuestaABEFAC>
) {
  const {fechaInicial, fechaFinal} = req.body;
  const filtroFechas = `?fechaInicio=${fechaInicial}&fechaFin=${fechaFinal}`;
  logger.debug('Se buscaran facturas para ' +filtroFechas);
  res.status(200).json(await getFacturasAPI(filtroFechas));
}

const prod = process.env.NODE_ENV === "production";
const abefacConn = axios.create({
    baseURL: prod
      ? process.env.FACTURACION_URL_BASE_PROD
      : process.env.FACTURACION_URL_BASE,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${prod
          ? process.env.FACTURACION_TOKEN_PROD
          : process.env.FACTURACION_TOKEN}`,
    },
});

export const getFacturasAPI = async (filtroFechas: string | null) => {
  if (!process.env.FACTURACION_URL_BASE)
    throw { error: "variables locales no definidas" };
  if (!filtroFechas) throw { error: "filtro de fechas es requerido" };
  const res = await abefacConn.get(
    process.env.FACTURACION_GET_FACTURAS + filtroFechas
  );
  return res.data;
};

