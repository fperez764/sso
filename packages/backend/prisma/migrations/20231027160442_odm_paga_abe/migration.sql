/*
  Warnings:

  - You are about to drop the column `equipos` on the `ClienteServicioTicketOrdenMantenimiento` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idActaEntrega,serial]` on the table `ClienteServicioActaEntregaEquipo` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `descripcionEquipos` to the `ClienteServicioTicketOrdenMantenimiento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClienteServicioTicketOrdenMantenimiento" DROP COLUMN "equipos",
ADD COLUMN     "descripcionEquipos" VARCHAR NOT NULL,
ADD COLUMN     "pagaCliente" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "ClienteServicioActaEntregaEquipo_idActaEntrega_serial_key" ON "ClienteServicioActaEntregaEquipo"("idActaEntrega", "serial");
