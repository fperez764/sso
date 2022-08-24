CREATE SEQUENCE operaciones.cliente_servicio_periodo_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
ALTER SEQUENCE operaciones.cliente_servicio_periodo_id_seq
    OWNER TO postgres;

CREATE TABLE operaciones.cliente_servicio_periodo
(
    id integer NOT NULL DEFAULT nextval('operaciones.cliente_servicio_periodo_id_seq'::regclass),
    cliente_servicio integer,
    fecha_inicio timestamp without time zone NOT NULL,
    fecha_fin timestamp without time zone NOT NULL,

    CONSTRAINT cliente_servicio_periodo_pkey PRIMARY KEY (id),
    CONSTRAINT "FK_cliente_servicio" FOREIGN KEY (cliente_servicio)
    REFERENCES operaciones.cliente_servicio (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE operaciones.cliente_servicio_periodo
    OWNER to postgres;