CREATE SEQUENCE operaciones.cliente_servicio_paquete_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;
ALTER SEQUENCE operaciones.cliente_servicio_paquete_id_seq
    OWNER TO postgres;

CREATE TABLE operaciones.cliente_servicio_paquete
(
    id integer NOT NULL DEFAULT nextval('operaciones.cliente_servicio_paquete_id_seq'::regclass),
    periodo integer NOT NULL,
    paquete integer NOT NULL,
    fecha_asignacion timestamp without time zone NOT NULL DEFAULT now(),
    usuario_asignacion character varying COLLATE pg_catalog."default" NOT NULL,    
    inicio_vigencia timestamp without time zone,
    fin_vigencia timestamp without time zone,
    facturado boolean NOT NULL default false,
    usuario_facturado character varying(20) NOT NULL,
    fecha_facturado timestamp without time zone,
    id_operacion character varying COLLATE pg_catalog."default" NOT NULL,
    cuf character varying COLLATE pg_catalog."default",
    mb_asignados integer,
    mb_usados integer,
    ilimitado boolean,


    CONSTRAINT cliente_servicio_paquete_pkey PRIMARY KEY (id),
    CONSTRAINT "FK_periodo" FOREIGN KEY (periodo)
    REFERENCES operaciones.cliente_servicio_periodo (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION,
    CONSTRAINT "FK_paquete" FOREIGN KEY (paquete)
    REFERENCES operaciones.cliente_servicio_paquete (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION

)

TABLESPACE pg_default;

ALTER TABLE operaciones.cliente_servicio_paquete
    OWNER to postgres;