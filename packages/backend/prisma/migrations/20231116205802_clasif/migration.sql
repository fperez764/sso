/*
  Warnings:

  - You are about to drop the column `detalle` on the `TicketClasificacion` table. All the data in the column will be lost.
  - Added the required column `clasificadores` to the `TicketClasificacion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ClienteServicioTicketAccion" ALTER COLUMN "orden" DROP NOT NULL;

-- AlterTable
ALTER TABLE "TicketClasificacion" DROP COLUMN "detalle",
ADD COLUMN     "clasificadores" VARCHAR NOT NULL,
ADD COLUMN     "nombreFlujo" TEXT;
