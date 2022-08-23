CREATE SEQUENCE operaciones.cliente_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
ALTER SEQUENCE operaciones.cliente_id_seq
    OWNER TO postgres;

CREATE TABLE operaciones.cliente
(
    id integer NOT NULL DEFAULT nextval('operaciones.cliente_id_seq'::regclass),
    fecha_creacion timestamp without time zone NOT NULL DEFAULT now(),
    usuario_creacion character varying COLLATE pg_catalog."default" NOT NULL,    
    fecha_baja timestamp without time zone,
    usuario_baja character varying COLLATE pg_catalog."default",    
    nombres character varying(50) COLLATE pg_catalog."default" NOT NULL,
    apellidos character varying(50) COLLATE pg_catalog."default" NOT NULL,
    nro_documento character varying(10) COLLATE pg_catalog."default",
    tipo_documento character varying(5) COLLATE pg_catalog."default" DEFAULT 'CI'::character varying,
    direccion character varying(250) COLLATE pg_catalog."default",
    telefono character varying(10) COLLATE pg_catalog."default",
    email character varying(150) COLLATE pg_catalog."default",
    
    nit character varying(20) COLLATE pg_catalog."default" NOT NULL,
    razon_social character varying(150) COLLATE pg_catalog."default",
    tipo_cliente character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT cliente_pkey PRIMARY KEY (id)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE operaciones.cliente
    OWNER to postgres;