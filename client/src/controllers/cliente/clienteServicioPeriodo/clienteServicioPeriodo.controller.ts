import queryDB from '../../../models/db/db';
import * as queries from './clienteServicioPeriodo.queries';
import logger from '../../../utils/logger';

/**
 * Marca un periodo con el flag de sobrepasoconsumo en base de datos
 * @param {Number} idServicio
 */
async function periodoSobrepasoConsumo(idServicio: number) {
    if (!idServicio) {
        logger.error('periodoSobrepasoConsumo: Servicio no puede ser null.');
    }
    const now = new Date();
    try {
        const res = await queryDB(queries.setSobrepasoConsumoByServicioQuery, [
            idServicio,
            now,
        ]);
        logger.debug(`Se marco al periodo ${  res.rows[0]}`);
    } catch (err) {
        logger.error(
            `No se pudo marcar como sobrepaso consumo el periodo vigente del servicio ${idServicio}\n${err}`
        );
    }
}

/**
 * Retorna verdadero si existe un periodo para ese servicio que este pagado.
 * @param {Number} idServicio
 * @param {Date} fechaHora debe estar entre fechaInicio y fechaFin del periodo
 * @returns {Promise<boolean} Retorna el saldo en MB que no pudo ser contabilizado y el Id de este tráfico.
 */
async function isPagado(idServicio: number, fechaHora: number) {
    if (!idServicio || !fechaHora) {
        logger.error(
            `periodoIsPagado: Servicio ${idServicio} ni fechaHora ${fechaHora} pueden ser null.`
        );
    }
    try {
        const res = await queryDB(queries.buscarPeriodoEnFecha, [
            idServicio,
            fechaHora,
        ]);
        if (res.rowCount > 1) {
            logger.error(
                `Servicio ${idServicio} con mas de un periodo en fecha ${fechaHora}`
            );
        }
        if (res.rowCount === 0) {
            logger.error(
                `Servicio ${idServicio} sin periodos en fecha ${fechaHora}`
            );
            // TODO evaluar si debe ser notificado
            return false;
        }
        logger.debug(
            `Servicio ${idServicio} con periodo ${res.rows[0].id} ${ 
                res.rows[0].pagado}`
                ? 'pagado'
                : 'no pagado'
        );
        return res.rows[0].pagado;
    } catch (err) {
        logger.error(
            `No se pudo verificar si el periodo con servicio ${idServicio} esta pagado\n${err}`
        );
        return false;
    }
}
module.exports = { periodoSobrepasoConsumo, isPagado };
