import ABEModel from "../../ABEModel/ABEModel";
import ServicioPaquete from "../Cliente";
import ClienteServicio from "../clienteServicio/ClienteServicio";
import ClienteServicioPeriodo from "../clienteServicioPeriodo/ClienteServicioPeriodo";

/**
 * Constructor para registros en BD de MB_ADICIONALES/DETALLE
 * @constructor
 */
class ClienteServicioPaquete extends ABEModel {

    constructor(
        id: number, fecha_creacion:Date, usuario_creacion: string, fecha_baja: Date, usuario_baja: string, 
        public servicioPaquete: ServicioPaquete,
        public clienteServicioPeriodo: ClienteServicioPeriodo,
        public inicioVigencia: Date,
        public finVigencia: Date,
        public mb_consumidos: number,
        public consumido: boolean,
        public ilimitado: boolean,
        public idOperacion: string,
       public  cuf: string, 
   ){
        super(id, fecha_creacion, usuario_creacion, fecha_baja, usuario_baja);
    }
    describe(){
    }
}

export default ClienteServicioPaquete;
export const enum TiposPaquete {
    REGULAR = 1,
    BONO = 2,
    REDUCIDO = 3
} 
