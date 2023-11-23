/*
  Warnings:

  - You are about to drop the column `fechaFin` on the `AreaPendienteHistorial` table. All the data in the column will be lost.
  - You are about to drop the column `fechaInicio` on the `AreaPendienteHistorial` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AreaPendienteHistorial" DROP COLUMN "fechaFin",
DROP COLUMN "fechaInicio",
ADD COLUMN     "fechaRegistro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;
