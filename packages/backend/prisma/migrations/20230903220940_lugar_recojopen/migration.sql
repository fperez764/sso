/*
  Warnings:

  - Changed the type of `lugarRecojo` on the `ClienteServicioTicketOrdenMantenimiento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ClienteServicioTicketOrdenMantenimiento" DROP COLUMN "lugarRecojo",
ADD COLUMN     "lugarRecojo" VARCHAR NOT NULL;
