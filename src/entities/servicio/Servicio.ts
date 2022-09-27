import ABEModel from '../ABEModel/ABEModel';

/**
 * Constructor para registros en BD de SERVICIO
 * @constructor
 */
class Servicio extends ABEModel {
    constructor(
        id: number,
        fecha_creacion: Date,
        usuario_creacion: string,
        fecha_baja: Date,
        usuario_baja: string,
        public categoria: string,
        public descripcion: string,
        public activo: boolean
    ) {
        super(id, fecha_creacion, usuario_creacion, fecha_baja, usuario_baja);
    }
}

export default Servicio;
