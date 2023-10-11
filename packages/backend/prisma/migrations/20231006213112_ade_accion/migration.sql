/*
  Warnings:

  - The values [CAMBIO_DE_PLAN,DEGRADACION_SERVICIO,SOPORTE_TECNICO,MANTENIMIENTO_CORRECTIVO,MANTENIMIENTO] on the enum `ticket_tipo_enum` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `nrodocumento` on the `Cliente` table. All the data in the column will be lost.
  - You are about to drop the column `reclamo` on the `ClienteServicioTicket` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[razonSocial]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[serial]` on the table `ClienteServicioEquipo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `marca` to the `ClienteServicioEquipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `modelo` to the `ClienteServicioEquipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `ClienteServicioEquipo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "equipo_estado_enum" AS ENUM ('NUEVO', 'REPARADO', 'BUENO', 'REGULAR', 'MALO');

-- CreateEnum
CREATE TYPE "lugar_recojo_enum" AS ENUM ('AMACHUMA', 'LA_GUARDIA', 'OTRO');

-- AlterEnum
BEGIN;
CREATE TYPE "ticket_tipo_enum_new" AS ENUM ('SOPORTE_REMOTO', 'MANTENIMIENTO_EN_SITIO', 'MODIFICACION_SERVICIO', 'REHABILITACION_SERVICIO', 'CORTE_SERVICIO', 'BAJA_DE_SERVICIO', 'OTRO');
ALTER TABLE "FlujoTicket" ALTER COLUMN "tipo" DROP DEFAULT;
ALTER TABLE "FlujoTicket" ALTER COLUMN "tipo" TYPE "ticket_tipo_enum_new" USING ("tipo"::text::"ticket_tipo_enum_new");
ALTER TABLE "TicketClasificacion" ALTER COLUMN "tipo" TYPE "ticket_tipo_enum_new" USING ("tipo"::text::"ticket_tipo_enum_new");
ALTER TYPE "ticket_tipo_enum" RENAME TO "ticket_tipo_enum_old";
ALTER TYPE "ticket_tipo_enum_new" RENAME TO "ticket_tipo_enum";
DROP TYPE "ticket_tipo_enum_old";
ALTER TABLE "FlujoTicket" ALTER COLUMN "tipo" SET DEFAULT 'SOPORTE_REMOTO';
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "users_area_enum" ADD VALUE 'ALMACENES_LA_GUARDIA';
ALTER TYPE "users_area_enum" ADD VALUE 'ALMACENES_AMACHUMA';
ALTER TYPE "users_area_enum" ADD VALUE 'EXT_INSTALADOR';
ALTER TYPE "users_area_enum" ADD VALUE 'EXT_CLIENTE';

-- AlterEnum
ALTER TYPE "users_dep_enum" ADD VALUE 'ACTIVOS';

-- DropIndex
DROP INDEX "UQ_CLISEREQUIPO_SERIAL";

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "nrodocumento";

-- AlterTable
ALTER TABLE "ClienteServicio" ADD COLUMN     "coordenadas" VARCHAR;

-- AlterTable
ALTER TABLE "ClienteServicioEquipo" ADD COLUMN     "estado" "equipo_estado_enum" NOT NULL DEFAULT 'NUEVO',
ADD COLUMN     "idActaEntrega" INTEGER,
ADD COLUMN     "mac" VARCHAR,
ADD COLUMN     "marca" VARCHAR NOT NULL,
ADD COLUMN     "modelo" VARCHAR NOT NULL,
ADD COLUMN     "observaciones" VARCHAR,
ADD COLUMN     "tipo" VARCHAR NOT NULL,
ADD COLUMN     "verificado" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "idClienteServicio" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ClienteServicioTicket" DROP COLUMN "reclamo",
ADD COLUMN     "tipo" TEXT;

-- AlterTable
ALTER TABLE "FlujoTicket" ALTER COLUMN "tipo" SET DEFAULT 'SOPORTE_REMOTO';

-- CreateTable
CREATE TABLE "ClienteServicioTicketOrdenMantenimiento" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nombreInstalador" VARCHAR NOT NULL,
    "lugarRecojo" VARCHAR NOT NULL,
    "horasViaje" INTEGER NOT NULL DEFAULT 0,
    "precioAcordado" INTEGER NOT NULL DEFAULT 0,
    "fechaVisitaProgramada" TIMESTAMP(6) NOT NULL,
    "fechaEjecucion" TIMESTAMP(6),
    "diagnostico" VARCHAR NOT NULL,
    "detalles" VARCHAR,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idTicket" INTEGER NOT NULL,
    "equipos" VARCHAR NOT NULL,

    CONSTRAINT "PK_CLISERTICKETODM" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClienteServicioActaEntrega" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nombreInstalador" VARCHAR NOT NULL,
    "lugarRecojo" VARCHAR NOT NULL,
    "observaciones" VARCHAR NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idClienteServicio" INTEGER NOT NULL,
    "idTicketAccion" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISERADE" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketClasificacion" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "tipo" "ticket_tipo_enum" NOT NULL DEFAULT 'SOPORTE_REMOTO',
    "detalle" VARCHAR NOT NULL,

    CONSTRAINT "PK_TICKETCLASIFICACION" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISERTICKETODM_IDTICKET" ON "ClienteServicioTicketOrdenMantenimiento"("idTicket");

-- CreateIndex
CREATE INDEX "IDX_CLISERTICKETODM" ON "ClienteServicioTicketOrdenMantenimiento"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISERADE_IDTICKETACCION" ON "ClienteServicioActaEntrega"("idTicketAccion");

-- CreateIndex
CREATE INDEX "IDX_CLISERADE" ON "ClienteServicioActaEntrega"("id");

-- CreateIndex
CREATE INDEX "IDX_TICKETCLASIFICACION" ON "TicketClasificacion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLIENTE_RAZONSOCIAL" ON "Cliente"("razonSocial");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISEREQUIPO_SERIAL" ON "ClienteServicioEquipo"("serial");

-- AddForeignKey
ALTER TABLE "ClienteServicioTicketOrdenMantenimiento" ADD CONSTRAINT "FK_CLISERTICKETODM_IDTICKET" FOREIGN KEY ("idTicket") REFERENCES "ClienteServicioTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioActaEntrega" ADD CONSTRAINT "FK_CLISERADE_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioActaEntrega" ADD CONSTRAINT "FK_CLISERADE_IDCLISERTICKETACCION" FOREIGN KEY ("idTicketAccion") REFERENCES "ClienteServicioTicketAccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioEquipo" ADD CONSTRAINT "ClienteServicioEquipo_idActaEntrega_fkey" FOREIGN KEY ("idActaEntrega") REFERENCES "ClienteServicioActaEntrega"("id") ON DELETE SET NULL ON UPDATE CASCADE;
