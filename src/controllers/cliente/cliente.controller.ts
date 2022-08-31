import {Query, queryDB} from "../../models/db/db";
import * as queries from "./cliente.queries";
const convRatio = 1024*1024; //Trafico en tablas ya esta en bytes
import logger from "../../utils/logger";
import Cliente from "./Cliente";


async function getClientes() {
    try{
        const result: Query = await queryDB(queries.allClientesQuery, []);
        return result.rows;
    }catch(error:any){
        throw new Error(`No se pudieron obtener todos los clientes`);
    }
}

async function getClientePorId(id:number) {
    if(!id) {
        logger.error("Id no puede ser null");
        return;
    }
    logger.debug("get Cliente: " + id);
    try{
        const result = await queryDB(queries.getClienteQuery, [id]);
        logger.debug(result.rows[0]);
        return result.rows[0];
    } catch(error: any){
        logger.error(`No se pudo obtener el cliente ${id} \n ${error.getMessage}`);
    }
}

export {getClientePorId, getClientes};