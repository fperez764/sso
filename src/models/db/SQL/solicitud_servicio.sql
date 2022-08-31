CREATE SEQUENCE operaciones.solicitud_servicio_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

ALTER SEQUENCE operaciones.solicitud_servicio_id_seq
    OWNER TO postgres;

CREATE TABLE operaciones.solicitud_servicio
(
    id integer NOT NULL DEFAULT nextval('operaciones.solicitud_servicio_id_seq'::regclass),
    fecha_creacion timestamp without time zone NOT NULL DEFAULT now(),
    usuario_creacion character varying COLLATE pg_catalog."default" NOT NULL,    
    sistema character varying COLLATE pg_catalog."default" NOT NULL,
    prepagado boolean NOT NULL,
    descripcion character varying COLLATE pg_catalog."default" NOT NULL,

    recibido boolean,
    fecha_recibido timestamp without time zone,
    aceptado_comercial boolean,
    fecha_aceptado_comercial timestamp without time zone,
    usuario_aceptado_comercial character varying COLLATE pg_catalog."default",
    aceptado_instalador boolean,
    fecha_aceptado_instalador timestamp without time zone,
    usuario_aceptado_instalador character varying COLLATE pg_catalog."default",
    documentos_comercial boolean,
    fecha_documentos_comercial timestamp without time zone,
    usuario_dcumentos_comercial character varying COLLATE pg_catalog."default",
    documentos_instalador boolean,
    fecha_documentos_instalador timestamp without time zone,
    usuario_documentos_instalador character varying COLLATE pg_catalog."default",
    modem_almacen boolean,
    fecha_modem_almacen timestamp without time zone,
    usuario_modem_almacen character varying COLLATE pg_catalog."default",
    modem_instalador boolean,
    fecha_modem_instalador timestamp without time zone,
    usuario_modem_instalador character varying COLLATE pg_catalog."default",
    instalado boolean,
    fecha_instalado timestamp without time zone,
    usuario_instalado character varying COLLATE pg_catalog."default",
    activado boolean,
    fecha_activado timestamp without time zone,
    usuario_activado character varying COLLATE pg_catalog."default",
    documentos_entregados boolean,
    usuario_documentos_entregados character varying COLLATE pg_catalog."default",
    fecha_documentos_entregados timestamp without time zone,
    cliente integer,
    
    CONSTRAINT "PK_solicitud" PRIMARY KEY (id),
    CONSTRAINT "FK_cliente" FOREIGN KEY (cliente)
        REFERENCES operaciones.cliente (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE operaciones.solicitud_servicio
    OWNER to postgres;