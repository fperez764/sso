/*
  Warnings:

  - You are about to drop the column `reclamo` on the `ClienteServicioTicket` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ClienteServicioTicket" DROP COLUMN "reclamo",
ADD COLUMN     "tipo" VARCHAR;

-- AlterTable
ALTER TABLE "ClienteServicioTicketOrdenMantenimiento" ALTER COLUMN "equipos" SET DATA TYPE VARCHAR;
