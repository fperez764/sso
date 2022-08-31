import ABEModel from "../../ABEModel/ABEModel";
import Servicio from "../../servicio/Servicio";
import Cliente from "../Cliente";
/**
 * Constructor para registros en BD de CLIENTE_SERVICIO
 * @constructor
 */
 class ClienteServicio extends ABEModel{

    constructor(
        id: number, fecha_activacion: Date, usuario_activacion: string, fecha_baja: Date, usuario_baja: string,
        readonly servicio: Servicio,//NOT NULL
        readonly cliente: Cliente,//NOT NULL
        readonly modemMac: string,
        public activo: boolean = true//NOT NULL
    ){
        super(id, fecha_activacion, usuario_activacion, fecha_baja, usuario_baja);
    }
    describe(){
    }
}

export default ClienteServicio;

