import ABEModel from "../../ABEModel/ABEModel";
import Servicio from "../Servicio";

/**
 * Constructor para registros en BD de MB_ADICIONALES/DETALLE
 * @constructor
 */
class ServicioPaquete extends ABEModel {

    constructor(
        id: number, fecha_creacion:Date, usuario_creacion: string, fecha_baja: Date, usuario_baja: string,
        public nombre: string,
        public descripcion: string, 
        public servicio: Servicio,
        public mb_regular: number,
        public mb_bono: number,
        public precio: number,
        public service_profile_reducido: number,
        public service_profile_regular: number
    ){
        super(id, fecha_creacion, usuario_creacion, fecha_baja, usuario_baja);
    }
    describe(){
    }
}

export default ServicioPaquete;
export const enum TiposPaquete {
    REGULAR = 1,
    BONO = 2,
    REDUCIDO = 3
} 
