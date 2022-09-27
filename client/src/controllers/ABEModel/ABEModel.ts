/**
 * Constructor para registros en BD de parametros de auditoria
 * @constructor
 */
class ABEModel {
    constructor(
        readonly id: number, // integer NOT NULL DEFAULT nextval('operaciones.plan_servicio_id_seq'::regclass),
        readonly fecha_creacion: Date, // timestamp without time zone NOT NULL DEFAULT now(),
        readonly usuario_creacion: string, // character varying COLLATE pg_catalog."default" NOT NULL,
        private fecha_baja: Date, // timestamp without time zone,
        private usuario_baja: string // character varying COLLATE pg_catalog."default",
    ) {}
}

export default ABEModel;
