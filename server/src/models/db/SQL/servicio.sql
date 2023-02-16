CREATE SEQUENCE operaciones.servicio_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
ALTER SEQUENCE operaciones.servicio_id_seq
    OWNER TO postgres;

CREATE TABLE operaciones.servicio
(
    id integer NOT NULL DEFAULT nextval('operaciones.servicio_id_seq'::regclass),
    fecha_creacion timestamp without time zone NOT NULL DEFAULT now(),
    usuario_creacion character varying COLLATE pg_catalog."default" NOT NULL,    
    fecha_baja timestamp without time zone,
    usuario_baja character varying COLLATE pg_catalog."default",
    categoria character varying(20) COLLATE pg_catalog."default" NOT NULL,
    descripcion character varying(20) COLLATE pg_catalog."default" NOT NULL,
    activo boolean NOT NULL DEFAULT true,

    CONSTRAINT servicio_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE operaciones.servicio
    OWNER to postgres;