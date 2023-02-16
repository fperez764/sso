CREATE SEQUENCE operaciones.cliente_servicio_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
ALTER SEQUENCE operaciones.cliente_servicio_id_seq
    OWNER TO postgres;

CREATE TABLE operaciones.cliente_servicio
(
    id integer NOT NULL DEFAULT nextval('operaciones.cliente_servicio_id_seq'::regclass),
    fecha_activacion timestamp without time zone NOT NULL DEFAULT now(),
    usuario_activacion character varying COLLATE pg_catalog."default" NOT NULL,    
    fecha_baja timestamp without time zone,
    usuario_baja character varying COLLATE pg_catalog."default",
    plan_servicio character varying(20) COLLATE pg_catalog."default" NOT NULL,
    categoria_servicio character varying(20) COLLATE pg_catalog."default" NOT NULL,
    modem character varying(20) COLLATE pg_catalog."default",

    CONSTRAINT cliente_servicio_pkey PRIMARY KEY (id),
    CONSTRAINT "FK_cliente" FOREIGN KEY (cliente)
    REFERENCES operaciones.cliente (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE operaciones.cliente_servicio
    OWNER to postgres;