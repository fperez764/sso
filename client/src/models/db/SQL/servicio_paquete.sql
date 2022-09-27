CREATE SEQUENCE operaciones.servicio_paquete_id_seq INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1;

ALTER SEQUENCE operaciones.servicio_paquete_id_seq OWNER TO postgres;

-- Table: operaciones.servicio_paquete
-- DROP TABLE operaciones.servicio_paquete;
CREATE TABLE
  operaciones.servicio_paquete (
    id integer NOT NULL DEFAULT nextval('operaciones.plan_servicio_id_seq':: regclass),
    fecha_creacion timestamp without time zone NOT NULL DEFAULT now(),
    usuario_creacion character varying COLLATE pg_catalog."default" NOT NULL,
    fecha_baja timestamp without time zone,
    usuario_baja character varying COLLATE pg_catalog."default",
    nombre character varying(100) COLLATE pg_catalog."default" NOT NULL,
    descripcion text COLLATE pg_catalog."default" NOT NULL,
    servicio integer,
    mb_bono integer,
    mb_regular integer,
    precio numeric(10, 2),
    service_profile_reducido integer,
    service_profile_regular integer,
    CONSTRAINT plan_servicio_pkey PRIMARY KEY (id),
    CONSTRAINT uk_nombre_plan UNIQUE (nombre),
    CONSTRAINT fk_servicio FOREIGN KEY (servicio) REFERENCES operaciones.servicio (id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE NO ACTION
  ) TABLESPACE pg_default;

ALTER TABLE
  operaciones.servicio_paquete OWNER to postgres;