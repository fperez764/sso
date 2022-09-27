import ABEModel from '../ABEModel/ABEModel';

/**
 * Constructor para registros en BD de SOLICITUD_SERVICIO
 * @constructor
 */
class Servicio extends ABEModel {
    constructor(
        id: number,
        fecha_creacion: Date,
        usuario_creacion: string,
        fecha_baja: Date,
        usuario_baja: string,
        readonly sistema: string,
        readonly prepagado: boolean = false,
        public descripcion: string,
        public recibido: boolean = false,
        public fecha_recibido: null | Date = null,
        public aceptado_comercial: boolean = false,
        public fecha_aceptado_comercial: null | Date = null,
        public usuario_aceptado_comercial: string,
        public aceptado_instalador: boolean = false,
        public fecha_aceptado_instalador: null | Date = null,
        public usuario_aceptado_instalador: string,
        public documentos_comercial: boolean = false,
        public fecha_documentos_comercial: null | Date = null,
        public usuario_dcumentos_comercial: string,
        public documentos_instalador: boolean = false,
        public fecha_documentos_instalador: null | Date = null,
        public usuario_documentos_instalador: string,
        public modem_almacen: boolean = false,
        public fecha_modem_almacen: null | Date = null,
        public usuario_modem_almacen: string,
        public modem_instalador: boolean = false,
        public fecha_modem_instalador: null | Date = null,
        public usuario_modem_instalador: string,
        public instalado: boolean = false,
        public fecha_instalado: null | Date = null,
        public usuario_instalado: string,
        public activado: boolean = false,
        public fecha_activado: null | Date = null,
        public usuario_activado: string,
        public documentos_entregados: boolean = false,
        public usuario_documentos_entregados: string,
        public fecha_documentos_entregados: null | Date = null
    ) {
        super(id, fecha_creacion, usuario_creacion, fecha_baja, usuario_baja);
    }
}

export default Servicio;
