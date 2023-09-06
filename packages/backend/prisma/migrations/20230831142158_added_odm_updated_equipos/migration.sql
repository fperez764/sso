/*
  Warnings:

  - You are about to drop the column `nrodocumento` on the `Cliente` table. All the data in the column will be lost.
  - Added the required column `marca` to the `ClienteServicioEquipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `observaciones` to the `ClienteServicioEquipo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "equipo_estado_enum" AS ENUM ('NUEVO', 'REPARADO', 'BUENO', 'REGULAR', 'MALO');

-- CreateEnum
CREATE TYPE "lugar_recojo_enum" AS ENUM ('AMACHUMA', 'LA_GUARDIA', 'OTRO');

-- AlterEnum
ALTER TYPE "users_dep_enum" ADD VALUE 'ACTIVOS';

-- AlterTable
ALTER TABLE "Cliente" DROP COLUMN "nrodocumento";

-- AlterTable
ALTER TABLE "ClienteServicioEquipo" ADD COLUMN     "estado" "equipo_estado_enum" NOT NULL DEFAULT 'NUEVO',
ADD COLUMN     "idOrdenMantenimiento" INTEGER,
ADD COLUMN     "marca" VARCHAR NOT NULL,
ADD COLUMN     "observaciones" VARCHAR NOT NULL;

-- CreateTable
CREATE TABLE "ClienteServicioTicketOrdenMantenimiento" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nombreInstalador" VARCHAR NOT NULL,
    "lugarRecojo" "lugar_recojo_enum" NOT NULL DEFAULT 'AMACHUMA',
    "horasViaje" INTEGER NOT NULL,
    "fechaVisitaProgramada" TIMESTAMP(6) NOT NULL,
    "fechaEjecucion" TIMESTAMP(6),
    "diagnostico" VARCHAR NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idTicket" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISERTICKETODM" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISERTICKETODM_IDTICKET" ON "ClienteServicioTicketOrdenMantenimiento"("idTicket");

-- CreateIndex
CREATE INDEX "IDX_CLISERTICKETODM" ON "ClienteServicioTicketOrdenMantenimiento"("id");

-- AddForeignKey
ALTER TABLE "ClienteServicioEquipo" ADD CONSTRAINT "FK_CLISEREQUIPO_IDODM" FOREIGN KEY ("idOrdenMantenimiento") REFERENCES "ClienteServicioTicketOrdenMantenimiento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioTicketOrdenMantenimiento" ADD CONSTRAINT "FK_CLISERTICKETODM_IDTICKET" FOREIGN KEY ("idTicket") REFERENCES "ClienteServicioTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;
