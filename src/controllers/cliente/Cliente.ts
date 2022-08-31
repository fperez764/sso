import ABEModel from "../ABEModel/ABEModel";

/**
 * Constructor para registros en BD de MB_ADICIONALES/DETALLE
 * @constructor
 */
class ServicioPaquete extends ABEModel {

    constructor(
        id: number, fecha_creacion:Date, usuario_creacion: string, fecha_baja: Date, usuario_baja: string, 
        public nombres: string, 
        public apellidos: string, 
        public nroDocumento: string,
        public tipoDocumento: string,
        public direccion: string,
        public telefono: string,
        public email: string,
        public nit: string,
        public razon_social: string,
        public tipo_cliente: string,
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
