CREATE SEQUENCE operaciones.cliente_servicio_paquete_id_seq INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;

ALTER SEQUENCE operaciones.cliente_servicio_paquete_id_seq OWNER TO postgres;

-- Table: operaciones.cliente_servicio_paquete
-- DROP TABLE operaciones.cliente_servicio_paquete;
CREATE TABLE
  operaciones.cliente_servicio_paquete (
    id integer NOT NULL DEFAULT nextval(
      'operaciones.cliente_servicio_paquete_id_seq':: regclass
    ),
    cliente_servicio_periodo integer NOT NULL,
    servicio_paquete integer NOT NULL,
    fecha_creacion timestamp without time zone NOT NULL DEFAULT now(),
    usuario_creacion character varying(20) COLLATE pg_catalog."default" NOT NULL,
    inicio_vigencia timestamp without time zone,
    fin_vigencia timestamp without time zone,
    fecha_facturado timestamp without time zone,
    mb_consumidos integer,
    ilimitado boolean,
    id_operacion character varying(20) COLLATE pg_catalog."default",
    cuf character varying COLLATE pg_catalog."default",
    usuario_baja character varying(20) COLLATE pg_catalog."default",
    fecha_baja time without time zone,
    consumido boolean,
    CONSTRAINT cliente_servicio_paquete_pkey PRIMARY KEY (id),
    CONSTRAINT "FK_paquete" FOREIGN KEY (servicio_paquete) REFERENCES operaciones.cliente_servicio_paquete (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT "FK_periodo" FOREIGN KEY (cliente_servicio_periodo) REFERENCES operaciones.cliente_servicio_periodo (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
  ) TABLESPACE pg_default;

ALTER TABLE
  operaciones.cliente_servicio_paquete OWNER to postgres;