-- CreateEnum
CREATE TYPE "accion_estado_enum" AS ENUM ('ACEPTADO', 'RECHAZADO', 'PENDIENTE', 'VENCIDO');

-- CreateEnum
CREATE TYPE "cliente_persona_enum" AS ENUM ('NATURAL', 'EMPRESARIAL');

-- CreateEnum
CREATE TYPE "cliente_servicio_evento_enum" AS ENUM ('ACTIVACION', 'SUSPENSION', 'REACTIVACION', 'BAJA');

-- CreateEnum
CREATE TYPE "cliente_servicio_modem_paquete_tipo_enum" AS ENUM ('REGULAR', 'BONO', 'REDUCIDO', 'ILIMITADO');

-- CreateEnum
CREATE TYPE "cliente_servicio_ticket_severidad_enum" AS ENUM ('CRITICA', 'ALTA', 'MEDIA', 'BAJA');

-- CreateEnum
CREATE TYPE "cliente_solicitud_accion_estado_enum" AS ENUM ('ACEPTADO', 'RECHAZADO', 'PENDIENTE');

-- CreateEnum
CREATE TYPE "cliente_tipodocumentofacturacion_enum" AS ENUM ('CI', 'NIT', 'CEX', 'OTRO');

-- CreateEnum
CREATE TYPE "flujo_solicitud_tipo_enum" AS ENUM ('FACTIBILIDAD', 'ALTA', 'BAJA', 'CORTE_TEMPORAL', 'CORTE_MANTENIMIENTO', 'REHABILITACION', 'MODIFICACION', 'ALTA_EVENTUAL', 'ENTREGA_EQUIPOS', 'RETIRO_EQUIPOS', 'PROVISIONAMIENTO', 'PRUEBAS', 'OTRO');

-- CreateEnum
CREATE TYPE "flujo_ticket_tipo_enum" AS ENUM ('CAMBIO_DE_PLAN', 'MODIFICACION_SERVICIO', 'BAJA_DE_SERVICIO', 'DEGRADACION_SERVICIO', 'CORTE_SERVICIO', 'SOPORTE_TECNICO', 'MANTENIMIENTO_CORRECTIVO', 'MANTENIMIENTO', 'OTRO', 'REHABILITACION_SERVICIO');

-- CreateEnum
CREATE TYPE "instalador_tipodocumentofacturacion_enum" AS ENUM ('CI', 'NIT', 'CEX', 'OTRO');

-- CreateEnum
CREATE TYPE "user_permiso_rol_enum" AS ENUM ('ADMIN', 'DIRECTOR', 'RESPONSABLE', 'ENCARGADO', 'FUNCIONARIO');

-- CreateEnum
CREATE TYPE "users_area_enum" AS ENUM ('NOC', 'ALMACENES', 'UTI', 'PROYECTOS', 'EMPRESARIAL', 'ATENCION_CLIENTE', 'SERVICIOS_BASICOS', 'INSTALACIONES', 'FACTURACION', 'AUXILIAR');

-- CreateEnum
CREATE TYPE "users_dep_enum" AS ENUM ('DGE', 'DAF', 'COMERCIAL', 'INGENIERIA', 'OPERACIONES');

-- CreateEnum
CREATE TYPE "users_rol_enum" AS ENUM ('ADMIN', 'DIRECTOR', 'RESPONSABLE', 'ENCARGADO', 'FUNCIONARIO');

-- CreateTable
CREATE TABLE "CategoriaServicio" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,

    CONSTRAINT "PK_CATSERVICIO" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nroDocumentoFacturacion" VARCHAR NOT NULL,
    "tipoDocumentoFacturacion" "cliente_tipodocumentofacturacion_enum" NOT NULL DEFAULT 'CI',
    "razonSocial" VARCHAR NOT NULL,
    "tipo" "cliente_persona_enum" NOT NULL DEFAULT 'NATURAL',
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "nrodocumento" VARCHAR,

    CONSTRAINT "PK_CLI" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteContacto" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreacion" VARCHAR NOT NULL,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioBaja" VARCHAR,
    "fechaBaja" TIMESTAMP(6),
    "nroDocumento" VARCHAR NOT NULL,
    "nombreCompleto" VARCHAR NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "idCliente" INTEGER NOT NULL,

    CONSTRAINT "ClienteContacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicio" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreacion" VARCHAR NOT NULL,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "usuarioBaja" VARCHAR,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "contrato" BOOLEAN NOT NULL DEFAULT false,
    "instalador" VARCHAR NOT NULL DEFAULT 'POR MIGRAR DE RSS',
    "nombreServicio" VARCHAR NOT NULL,
    "idCliente" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISER" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicioEquipo" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "serial" VARCHAR NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idClienteServicio" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISEREQUIPO" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicioEvento" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreacion" VARCHAR NOT NULL,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "usuarioBaja" VARCHAR,
    "evento" "cliente_servicio_evento_enum" NOT NULL DEFAULT 'ACTIVACION',
    "comentario" VARCHAR,
    "idClienteServicio" INTEGER NOT NULL,

    CONSTRAINT "ClienteServicioEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicioModem" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "mac" VARCHAR NOT NULL,
    "autoAdministrado" BOOLEAN NOT NULL DEFAULT true,
    "coordenadas" VARCHAR,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idClienteServicio" INTEGER NOT NULL,
    "idClienteSolicitudAccion" INTEGER,

    CONSTRAINT "PK_CLISERMODEM" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicioPaquete" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "inicioVigencia" TIMESTAMP(6) NOT NULL,
    "finVigencia" TIMESTAMP(6) NOT NULL,
    "modemMac" VARCHAR NOT NULL,
    "consumo" INTEGER NOT NULL,
    "consumido" BOOLEAN NOT NULL,
    "tipo" "cliente_servicio_modem_paquete_tipo_enum" NOT NULL DEFAULT 'REGULAR',
    "facturaReferencia" VARCHAR NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "servicioPaquete" VARCHAR NOT NULL,
    "idClienteServicioPeriodo" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISERMODEMPAQUETE" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicioPeriodo" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "fechaInicio" TIMESTAMP(6) NOT NULL,
    "fechaFin" TIMESTAMP(6) NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idClienteServicio" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISERPERIODO" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicioTicket" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "origen" VARCHAR NOT NULL,
    "reclamo" BOOLEAN NOT NULL DEFAULT false,
    "resuelto" BOOLEAN NOT NULL DEFAULT false,
    "descripcion" VARCHAR NOT NULL,
    "severidad" "cliente_servicio_ticket_severidad_enum" NOT NULL DEFAULT 'BAJA',
    "telefonoContacto" VARCHAR,
    "nombreContacto" VARCHAR,
    "direccion" VARCHAR,
    "coordenadas" VARCHAR,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idClienteServicio" INTEGER NOT NULL,
    "nombreFlujo" VARCHAR,

    CONSTRAINT "PK_CLISERTICKET" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicioTicketAccion" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "orden" INTEGER NOT NULL,
    "area" VARCHAR NOT NULL,
    "estado" "accion_estado_enum" NOT NULL DEFAULT 'PENDIENTE',
    "fechaInicio" TIMESTAMP(6),
    "fechaFin" TIMESTAMP(6),
    "vigenciaDias" INTEGER NOT NULL,
    "fechaRespuesta" TIMESTAMP(6),
    "respuesta" VARCHAR,
    "accion" VARCHAR NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idTicket" INTEGER NOT NULL,
    "usuarioAsignado" VARCHAR,

    CONSTRAINT "PK_CLISERTICKETACCION" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicioTicketAccionComentario" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "comentario" VARCHAR NOT NULL,
    "imagen" VARCHAR,
    "usuarioArea" VARCHAR NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idTicketAccion" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISERTICKETACCIONCOMENTARIO" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicioTicketModem" (
    "idTicket" INTEGER NOT NULL,
    "macModem" TEXT NOT NULL,

    CONSTRAINT "PK_CLISERTICKETMODEM_IDTICKET_MACMODEM" PRIMARY KEY ("idTicket","macModem")
);

-- CreateTable
CREATE TABLE "ClienteSolicitud" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "origen" VARCHAR NOT NULL,
    "prepagado" BOOLEAN NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "recibido" BOOLEAN NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idCliente" INTEGER NOT NULL,
    "nombreServicio" VARCHAR NOT NULL,
    "nombreFlujo" VARCHAR NOT NULL,

    CONSTRAINT "PK_CLISOL" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteSolicitudAccion" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "orden" INTEGER NOT NULL,
    "area" VARCHAR NOT NULL,
    "estado" "cliente_solicitud_accion_estado_enum" NOT NULL DEFAULT 'PENDIENTE',
    "fechaInicio" TIMESTAMP(6),
    "fechaFin" TIMESTAMP(6),
    "vigenciaDias" INTEGER NOT NULL,
    "fechaRespuesta" TIMESTAMP(6),
    "respuesta" VARCHAR,
    "accion" VARCHAR NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "usuarioAsignado" VARCHAR,
    "idClienteSolicitud" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISOLACCION" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteSolicitudAccionComentario" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "comentario" VARCHAR NOT NULL,
    "leido" BOOLEAN NOT NULL DEFAULT false,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idClienteSolicitudAccion" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISOLACCIONCOMENTARIO" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlujoSolicitud" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nombre" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "tipo" "flujo_solicitud_tipo_enum" NOT NULL DEFAULT 'PROVISIONAMIENTO',
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "nombreServicio" VARCHAR,

    CONSTRAINT "PK_FLUJOSOL" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlujoSolicitudAcciones" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "orden" INTEGER NOT NULL,
    "area" VARCHAR NOT NULL,
    "accion" VARCHAR NOT NULL,
    "vigenciaDias" INTEGER NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "nombreFlujo" VARCHAR NOT NULL,

    CONSTRAINT "PK_FLUJOSOLACCIONES" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlujoTicket" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nombre" VARCHAR NOT NULL,
    "descripcion" TEXT,
    "tipo" "flujo_ticket_tipo_enum" NOT NULL DEFAULT 'SOPORTE_TECNICO',
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "nombreServicio" VARCHAR,

    CONSTRAINT "PK_FLUJOTICKET" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlujoTicketAcciones" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "orden" INTEGER NOT NULL,
    "area" VARCHAR NOT NULL,
    "accion" VARCHAR NOT NULL,
    "vigenciaDias" INTEGER NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "nombreFlujo" VARCHAR,

    CONSTRAINT "PK_FLUJOTICKETACCIONES" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instalador" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nroDocumento" VARCHAR,
    "nombreCompleto" VARCHAR NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "nroDocumentoFacturacion" VARCHAR NOT NULL,
    "tipoDocumentoFacturacion" "instalador_tipodocumentofacturacion_enum" NOT NULL DEFAULT 'CI',
    "razonSocial" VARCHAR NOT NULL,
    "zona" VARCHAR NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,

    CONSTRAINT "PK_INSTALADOR" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "nombreCategoria" VARCHAR NOT NULL,

    CONSTRAINT "PK_SER" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicioPaquete" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nombre" VARCHAR NOT NULL,
    "descripcion" VARCHAR NOT NULL,
    "precio" INTEGER NOT NULL,
    "renovacion" BOOLEAN NOT NULL DEFAULT true,
    "vigenciaDias" INTEGER,
    "mbRegular" INTEGER NOT NULL,
    "mbBono" INTEGER NOT NULL,
    "mbRecargo" INTEGER NOT NULL,
    "perfilReducido" INTEGER NOT NULL,
    "perfilRegular" INTEGER NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "nombreServicio" VARCHAR NOT NULL,

    CONSTRAINT "PK_SERPAQUETE" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioCreacion" TEXT,
    "username" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "password" VARCHAR NOT NULL,
    "area" "users_area_enum" NOT NULL DEFAULT 'AUXILIAR',
    "departamento" "users_dep_enum" NOT NULL DEFAULT 'DGE',
    "rol" "users_rol_enum" NOT NULL DEFAULT 'FUNCIONARIO',

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CATSERVICIO_NOMBRE" ON "CategoriaServicio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CATSERVICIO_DESCRIPCION" ON "CategoriaServicio"("descripcion");

-- CreateIndex
CREATE INDEX "IDX_CATSERVICIO" ON "CategoriaServicio"("id");

-- CreateIndex
CREATE INDEX "IDX_CLI" ON "Cliente"("id");

-- CreateIndex
CREATE INDEX "IDX_CLICONTACTO_EMAIL" ON "ClienteContacto"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ClienteContacto_nroDocumento_fechaBaja_key" ON "ClienteContacto"("nroDocumento", "fechaBaja");

-- CreateIndex
CREATE INDEX "IDX_CLISER" ON "ClienteServicio"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISER_IDCLIENTE_NOMBRESERVICO" ON "ClienteServicio"("idCliente", "nombreServicio");

-- CreateIndex
CREATE INDEX "IDX_CISEREQUIPO_SERIAL" ON "ClienteServicioEquipo"("serial");

-- CreateIndex
CREATE INDEX "IDX_CLISEREQUIPO" ON "ClienteServicioEquipo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISEREQUIPO_SERIAL" ON "ClienteServicioEquipo"("idClienteServicio", "serial");

-- CreateIndex
CREATE INDEX "IDX_CLISERMODEM" ON "ClienteServicioModem"("id");

-- CreateIndex
CREATE INDEX "IDX_CLISERMODEMPAQUETE" ON "ClienteServicioPaquete"("id");

-- CreateIndex
CREATE INDEX "IDX_CLISERPERIODO" ON "ClienteServicioPeriodo"("id");

-- CreateIndex
CREATE INDEX "IDX_CLISERTICKET" ON "ClienteServicioTicket"("id");

-- CreateIndex
CREATE INDEX "IDX_CLISERTICKETACCION" ON "ClienteServicioTicketAccion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISERTICKETACCION_IDTICKET_ORDEN" ON "ClienteServicioTicketAccion"("idTicket", "orden");

-- CreateIndex
CREATE INDEX "IDX_PK_CLISERTICKETACCIONCOMENTARIO" ON "ClienteServicioTicketAccionComentario"("id");

-- CreateIndex
CREATE INDEX "IDX_CLISERTICKETMODEM_IDTICKET" ON "ClienteServicioTicketModem"("idTicket");

-- CreateIndex
CREATE INDEX "IDX_CLISOL" ON "ClienteSolicitud"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISOL_NOMBRESERVICIO" ON "ClienteSolicitud"("idCliente", "nombreServicio");

-- CreateIndex
CREATE INDEX "IDX_CLISOLACCION" ON "ClienteSolicitudAccion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISOLACCION_IDCLISOL_ORDEN" ON "ClienteSolicitudAccion"("idClienteSolicitud", "orden");

-- CreateIndex
CREATE INDEX "IDX_CLISOLACCIONCOMENTARIO" ON "ClienteSolicitudAccionComentario"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_FLUJOSOL_NOMBRE" ON "FlujoSolicitud"("nombre");

-- CreateIndex
CREATE INDEX "IDX_FLUJOSOL" ON "FlujoSolicitud"("id");

-- CreateIndex
CREATE INDEX "IDX_FLUJOSOL_NOMBRE" ON "FlujoSolicitud"("nombre");

-- CreateIndex
CREATE INDEX "IDX_FLUJOSOLACCIONES" ON "FlujoSolicitudAcciones"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_FLUJOSOLACCIONES_ORDEN_NOMBREFLUJO" ON "FlujoSolicitudAcciones"("orden", "nombreFlujo");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_FLUJOTICKET_NOMBRE" ON "FlujoTicket"("nombre");

-- CreateIndex
CREATE INDEX "IDX_FLUJOTICKET" ON "FlujoTicket"("id");

-- CreateIndex
CREATE INDEX "IDX_FLUJOTICKET_NOMBRE" ON "FlujoTicket"("nombre");

-- CreateIndex
CREATE INDEX "IDX_FLUJOTICKETACCIONES" ON "FlujoTicketAcciones"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_FLUJOTICKETACCIONES_ORDEN_NOMBREFLUJO" ON "FlujoTicketAcciones"("orden", "nombreFlujo");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_INSTALADOR_NRODOC" ON "Instalador"("nroDocumento");

-- CreateIndex
CREATE INDEX "IDX_INSTALADOR" ON "Instalador"("id");

-- CreateIndex
CREATE INDEX "IDX_INSTALADOR_EMAIL" ON "Instalador"("email");

-- CreateIndex
CREATE INDEX "IDX_INSTALADOR_NRODOC" ON "Instalador"("nroDocumento");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_SER_NOMBRE" ON "Servicio"("nombre");

-- CreateIndex
CREATE INDEX "IDX_SER" ON "Servicio"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_SER_NOMBRE_NOMBRECATEGORIA" ON "Servicio"("nombre", "nombreCategoria");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_SERPAQUETE_NOMBRE" ON "ServicioPaquete"("nombre");

-- CreateIndex
CREATE INDEX "IDX_SERPAQUETE" ON "ServicioPaquete"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_SERVICIOPAQUETE_NOMBRE_NOMBRESERVICO" ON "ServicioPaquete"("nombre", "nombreServicio");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "ClienteContacto" ADD CONSTRAINT "ClienteContacto_idCliente_fkey" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicio" ADD CONSTRAINT "FK_CLISER_IDCLIENTE" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicio" ADD CONSTRAINT "FK_CLISER_NOMBRESERVICIO" FOREIGN KEY ("nombreServicio") REFERENCES "Servicio"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioEquipo" ADD CONSTRAINT "FK_CLISEREQUIPO_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioEvento" ADD CONSTRAINT "FK_CLISEREVENTO_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioModem" ADD CONSTRAINT "FK_CLISERMODEM_IDCLIENTESOLICITUDACCION" FOREIGN KEY ("idClienteSolicitudAccion") REFERENCES "ClienteSolicitudAccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioModem" ADD CONSTRAINT "FK_CLISERMODEM_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioPaquete" ADD CONSTRAINT "FK_CLISERMODEMPAQUETE_IDCLISERPERIODO" FOREIGN KEY ("idClienteServicioPeriodo") REFERENCES "ClienteServicioPeriodo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioPaquete" ADD CONSTRAINT "FK_CLISERMODEMPAQUETE_NOMBRESERVICIOPAQUETE" FOREIGN KEY ("servicioPaquete") REFERENCES "ServicioPaquete"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioPeriodo" ADD CONSTRAINT "FK_CLISERPERIODO_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioTicket" ADD CONSTRAINT "FK_CLISERTICKET_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioTicket" ADD CONSTRAINT "FK_CLISERTICKET_NOMBREFLUJO" FOREIGN KEY ("nombreFlujo") REFERENCES "FlujoTicket"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioTicketAccion" ADD CONSTRAINT "FK_CLISERTICKETACCION_IDTICKET" FOREIGN KEY ("idTicket") REFERENCES "ClienteServicioTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioTicketAccionComentario" ADD CONSTRAINT "FK_CLISERTICKETACCIONCOMENTARIO_IDTICKETACCION" FOREIGN KEY ("idTicketAccion") REFERENCES "ClienteServicioTicketAccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioTicketModem" ADD CONSTRAINT "FK_CLISERTICKETMODEM" FOREIGN KEY ("idTicket") REFERENCES "ClienteServicioTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSolicitud" ADD CONSTRAINT "ClienteSolicitud_nombreServicio_fkey" FOREIGN KEY ("nombreServicio") REFERENCES "Servicio"("nombre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSolicitud" ADD CONSTRAINT "FK_CLISOL_IDCLIENTE" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSolicitud" ADD CONSTRAINT "FK_CLISOL_NOMBREFLUJO" FOREIGN KEY ("nombreFlujo") REFERENCES "FlujoSolicitud"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSolicitudAccion" ADD CONSTRAINT "FK_CLISOLACCION_IDCLISOL" FOREIGN KEY ("idClienteSolicitud") REFERENCES "ClienteSolicitud"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSolicitudAccionComentario" ADD CONSTRAINT "FK_CLISOLACCIONCOMENTARIO_IDCLISOLACCION" FOREIGN KEY ("idClienteSolicitudAccion") REFERENCES "ClienteSolicitudAccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlujoSolicitud" ADD CONSTRAINT "FK_FLUJOSOL_NOMBRESERVICIO" FOREIGN KEY ("nombreServicio") REFERENCES "Servicio"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlujoSolicitudAcciones" ADD CONSTRAINT "FK_FLUJOSOLACCIONES_NOMBREFLUJO" FOREIGN KEY ("nombreFlujo") REFERENCES "FlujoSolicitud"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlujoTicket" ADD CONSTRAINT "FK_FLUJOTICKET_NOMBRESERVICIO" FOREIGN KEY ("nombreServicio") REFERENCES "Servicio"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlujoTicketAcciones" ADD CONSTRAINT "FK_FLUJOTICKETACCIONES_NOMBREFLUJO" FOREIGN KEY ("nombreFlujo") REFERENCES "FlujoTicket"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "FK_SER_NOMBRECATEGORIA" FOREIGN KEY ("nombreCategoria") REFERENCES "CategoriaServicio"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicioPaquete" ADD CONSTRAINT "ServicioPaquete_nombreServicio_fkey" FOREIGN KEY ("nombreServicio") REFERENCES "Servicio"("nombre") ON DELETE RESTRICT ON UPDATE CASCADE;
