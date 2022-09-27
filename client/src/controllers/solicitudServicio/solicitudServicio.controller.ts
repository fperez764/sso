import queryDB from '../../models/db/db';
import * as queries from './soliciutdServicio.queries';
import logger from '../../utils/logger';

export default async function getSolicitudesServicio(idFuncionario?: number) {
    if (!idFuncionario) {
        logger.info('No idFuncionario, se devolveran todos los SS activos');
    }
    const res = idFuncionario
        ? await queryDB(queries.queryServicioPorModem, [idFuncionario])
        : await queryDB(queries.queryAllSSActivas, []);
    if (res.rowCount === 0) {
        throw new Error(
            `No se pudo encontrar un servicio relacionado al modem ${ 
                idFuncionario}`
        );
    }
    return res.rows[0].id;
}

/**
 * Resuelve el id de un modem en base al id de un servicio.
 * @param idServicio id correspondiente.
 * @returns {Promise<Number|null>} el id del modem o null si no lo encuentra.
 */
async function getModemPorServicio(idServicio: number) {
    if (!idServicio) {
        throw new Error(
            'getModemPorServicio: Servicio no puede ser null en getServicioPorModem'
        );
    }
    const res = await queryDB(queries.queryModemPorServicio, [idServicio]);
    if (res.rowCount === 0) {
        throw new Error(
            `No se pudo encontrar un modem relacionado al servicio ${ 
                idServicio}`
        );
    }
    return res.rows[0].modem;
}

/**
 * Marca un servicio como en mantenimiento para asumir que esta de baja por no tener paquetes vigentes.
 * @param {Number} idServicio del servicio
 */
async function marcarMantenimiento(idServicio: number) {
    if (!idServicio) {
        throw new Error(
            'marcarMantenimiento: Servicio no puede ser null en marcarMantenimiento'
        );
    }
    const motivoBaja = 'Servicio sin paquetes vigentes, entra en corte';
    const fechaRegistroBaja = new Date();
    const mantenimiento = true;

    await queryDB(queries.updateServicioToCorte, [
        motivoBaja,
        fechaRegistroBaja,
        mantenimiento,
        idServicio,
    ]);
    logger.debug(
        `Servicio ${idServicio} entra en corte por no tener paquetes vigentes.`
    );
}

module.exports = {
    getServicioPorModem: getSolicitudesServicio,
    getModemPorServicio,
    marcarMantenimiento,
};
