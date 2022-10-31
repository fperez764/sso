import queryDb from "../../../models/db/db";
import * as queries from "./servicioPaquete.queries";
const convRatio = 1024*1024; //Trafico en tablas ya esta en bytes
import logger from "../../../utils/logger";
import {TiposPaquete} from "./ServicioPaquete";
import Paquete from "./ServicioPaquete";


async function getPaquetesVigentes(servicio: number, tipo: number, fechaHora: Date, limite=100) {
    if(!servicio) {logger.error("getPaqueteVigentes: Servicio no puede ser null"); return [];}
    logger.silly(`getPaquetesVigentes para registro con vigencia para ${fechaHora} para el servicio ${servicio}`);
    try{
        const result = tipo === TiposPaquete.BONO ?
            await queryDb(queries.allPaquetesBonoVigentesQuery, [servicio, fechaHora, limite]) :
            await queryDb(queries.allPaquetesRegularesVigentesQuery, [servicio, fechaHora, limite]);
        return result.rows;
    }catch(error:any){
        throw new Error(`No se pudieron obtener los paquetes de ${tipo} del servicio ${servicio}\n${error.getMessage}`);
    }
}

/**
 * Retorna todos los paquetes vigentes (consumido = false; fecha_baja.after(now)) relacionados a un @servicio por orden de compra.
 * @param servicio que tiene paquetes vigentes
 * @param fechaHora Busca paquetes con rango d vigencia para fechaHora
 * @param limite la cantidad limite de paquetes que puede mostrar
 * @returns {Promise<[PaqueteExtra]>}
 */
 async function getAllPaquetes(servicio:number, fecha:Date) {
    if(!servicio) {logger.error("getAllPaquetes: Servicio no puede ser null"); return [];}
    logger.silly(`getAllPaquetes con vigencia para la fecha ${fecha} para el servicio ${servicio}`);
    try{
        const result = await queryDb(queries.allPaquetesVigentesQuery, [servicio, fecha]);
        return result.rows;
    }catch(error:any){
        throw new Error(`No se pudieron obtener los paquetes del servicio ${servicio}\n${error.stack}`);
    }
}

/**
 * Retorna el paquete vigente mas próximo a vencer (consumido = false; fecha_baja.after(now)) relacionado a un @servicio por orden de compra.
 * @param {Number} servicio para relacionado al modem para la contabilizacion
 * @param {Date} fechaHora para verificar el tipo de paquete que buscara en base de datos
 * @returns {Promise<{PaqueteDetExtra, Number}>} regresa el objeto paquete o null en caso de no encontrar paquetes.
 */
async function getPaqueteVigente(servicio:number, fechaHora:Date) {
    if(isParaBono(fechaHora)){
        logger.verbose(`Serivicio: ${servicio} - Se buscara el paquete de bono para ${fechaHora}`);
        try {
            const result = await queryDb(queries.allPaquetesBonoVigentesQuery, [servicio, fechaHora, 1]);
            const paquetes = result.rows;

            if(paquetes.length > 0) {
                logger.verbose(`Servicio: ${servicio} - se encontro el paquete de bono ${paquetes[0].detalle} - ${paquetes[0].descripcion}`);
                return {paquete:  paquetes[0] || ``, tipoContabilizado: TiposPaquete.BONO};
            }
        } catch(error:any) {
            logger.error(`Hubo un error al buscar el paquete de bono del servicio ${servicio} error: ${error.getMessage}`);
        }
        logger.warn(servicio + " sin paquete de bono, se buscara el regular.")
    }
    //Si no es para bono o el paquete de bono ya no tiene megas buscamos un paquete para consumo regular.
    logger.debug(`Se buscara el paquete regular del servicio ${servicio} para ${fechaHora}`);
    const result = await queryDb(queries.allPaquetesRegularesVigentesQuery, [servicio, fechaHora, 1]);
    const paquetes = result.rows;
    logger.debug(`Servicio ${servicio} tiene ${paquetes.length} paquetes regulares vigentes`);
    return {paquete: paquetes[0] || ``, tipoContabilizado: TiposPaquete.REGULAR};
}

/**
 * Retorna true si la fecha de alta de un paquete se encuentra entre el horario de bono definido en la config.
 * @param {Date} fechaHora
 * @returns {boolean}
 */
function isParaBono(fechaHora: Date){
    let horaTrafico = fechaHora.getHours();
    logger.warn(process.env.HORA_BONO_INICIO);
    logger.warn(process.env.HORA_BONO_FIN);
    return horaTrafico >= 0 && horaTrafico <= 7;
}

async function getPaquetePorId(id:number) {
    if(!id) {
        logger.error("Id no puede ser null");
        return;
    }
    logger.debug("get Paquete: " + id);
    try{
        const result = await queryDb(queries.getPaqueteQuery, [id]);
        logger.debug(result.rows[0]);
        //let paquetes = result.rows.map(o => new PaqueteExtra(o));
        return result.rows[0];
    } catch(error){
        logger.error(`No se pudo obtener el paquete ${id} \n ${error}`);
        return error;
    }
}

/**
 * Actualiza los campos consumido, mb_consumidos del paquete.
 * @param {PaqueteDetExtra} paquete debe ser el paquete vigente, con saldo disponible mas proximo a vencer.
 * @param {Number} consumoMB Se adicionan a MB_consumidos del paquete.
 * @returns {Promise<Number>} true si contabilizo los megas, false si hubo un error que loguea.
 */
async function agregarConsumoPaquete(paquete: Paquete, consumoMB: number){
    if(paquete === null) {
        throw Error("Contabilizar: Paquete no puede ser null");
    }
    if(consumoMB === null) {
        throw Error("Contabilizar: Consumo no puede ser null");
    }
    try {
        logger.debug(`Consumo = ${paquete.mb_consumidos} + ${consumoMB}`);
        paquete.mb_consumidos = Math.min(paquete.mb, paquete.mb_consumidos + consumoMB);
        let saldo = Math.max(consumoMB - (paquete.mb - paquete.mb_consumidos), 0);
        if (paquete.mb_consumidos >= paquete.mb) {
            paquete.consumido = true;
        }
        await queryDb(queries.updatePaqueteQuery,
            [paquete.id, paquete.consumido, paquete.mb_consumidos]);
        logger.debug("Se agrego consumo al paquete " + paquete.id);
        return saldo;
    }
    catch(error:any){
        throw Error(`Hubo un problema al agregar ${consumoMB} MB al paquete: ${paquete.id} \n ${error.getMessage} \n ${error.stack}`);
    }
}

export {agregarConsumoPaquete, 
    getPaqueteVigente, 
    getPaquetesVigentes, 
    convRatio,
    getAllPaquetes};