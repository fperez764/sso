import Servicio from '../../servicio/Servicio';
import ClienteServicio from '../clienteServicio/ClienteServicio';

/**
 * Constructor para registros en BD de CLIENTE_SERVICIO_PERIODO
 * @constructor
 */
class ClienteServicioPeriodo {
    constructor(
        readonly id: number,
        readonly fecha_inicio: Date,
        readonly fecha_fin: Date,
        public cliente_servicio: ClienteServicio
    ) {}
}

export default ClienteServicioPeriodo;
