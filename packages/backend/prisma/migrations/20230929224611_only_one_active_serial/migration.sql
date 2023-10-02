/*
  Warnings:

  - A unique constraint covering the columns `[serial]` on the table `ClienteServicioEquipo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UQ_CLISEREQUIPO_SERIAL";

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISEREQUIPO_SERIAL" ON "ClienteServicioEquipo"("serial");
