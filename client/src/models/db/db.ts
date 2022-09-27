import { Pool } from 'pg';
import logger from '../../utils/logger';

let _db: any;
export default queryDB;

type PoolConf = {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
    max: number;
};

const dbConfig: PoolConf = JSON.parse(
    process.env.DB ??
        '{user: postgres,password: master,host: localhost,port: 5432,database: postgres,max: 50}'
);

if (!_db) {
    _db = new Pool(dbConfig);
    const { user, password, ...configToLog } = dbConfig;
    logger.info(
        `DB inicializada: ${
            process.env.NODE_ENV === 'production' ? 'PRODUCCION' : 'DESARROLLO'
        }\n ${configToLog}`
    );
}

async function queryDB(
    query: string,
    params: Array<string | Date | number | boolean>
) {
    try {
        return await _db.query(query, params);
    } catch (error: any) {
        let imptntPart = error.stack.toString();
        imptntPart = imptntPart
            .substring(imptntPart.indexOf(';') + 1, imptntPart.indexOf('\n'))
            .replace('Error:', '')
            .replace('\n', '')
            .replace('  ', '');
        logger.silly(
            `DB QUERY ERROR: ${imptntPart}\nQUERY(${query}, [${params}]\n`
        );
        throw Error(`${imptntPart}`);
    }
}

type Query = {
    rows: Array<string>;
};

export { queryDB };
export type { Query };
