/*
  Warnings:

  - A unique constraint covering the columns `[nroDocumentoFacturacion,razonSocial]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nroDocumento,nombreCompleto]` on the table `ClienteContacto` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UQ_CLIENTE_RAZONSOCIAL";

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_nroDocumentoFacturacion_razonSocial_key" ON "Cliente"("nroDocumentoFacturacion", "razonSocial");

-- CreateIndex
CREATE UNIQUE INDEX "ClienteContacto_nroDocumento_nombreCompleto_key" ON "ClienteContacto"("nroDocumento", "nombreCompleto");
