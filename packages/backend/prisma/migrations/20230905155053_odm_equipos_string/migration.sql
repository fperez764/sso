/*
Warnings:

- Added the required column `equipos` to the `ClienteServicioTicketOrdenMantenimiento` table without a default value. This is not possible if the table is not empty.

 */
-- DropForeignKey
ALTER TABLE "ClienteServicioEquipo"
DROP CONSTRAINT "FK_CLISEREQUIPO_IDODM";

-- AlterTable
ALTER TABLE "ClienteServicioTicketOrdenMantenimiento"
ADD COLUMN "equipos" TEXT NOT NULL;