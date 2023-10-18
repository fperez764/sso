/*
  Warnings:

  - The values [INSTALADOR,CLIENTE] on the enum `users_area_enum` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[razonSocial]` on the table `Cliente` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idTicketAccion]` on the table `ClienteServicioActaEntrega` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "users_area_enum_new" AS ENUM ('NOC', 'ALMACENES', 'ALMACENES_LA_GUARDIA', 'ALMACENES_AMACHUMA', 'UTI', 'PROYECTOS', 'EMPRESARIAL', 'ATENCION_CLIENTE', 'SERVICIOS_BASICOS', 'INSTALACIONES', 'FACTURACION', 'AUXILIAR', 'EXT_INSTALADOR', 'EXT_CLIENTE');
ALTER TABLE "Users" ALTER COLUMN "area" DROP DEFAULT;
ALTER TABLE "Users" ALTER COLUMN "area" TYPE "users_area_enum_new" USING ("area"::text::"users_area_enum_new");
ALTER TYPE "users_area_enum" RENAME TO "users_area_enum_old";
ALTER TYPE "users_area_enum_new" RENAME TO "users_area_enum";
DROP TYPE "users_area_enum_old";
ALTER TABLE "Users" ALTER COLUMN "area" SET DEFAULT 'AUXILIAR';
COMMIT;

-- AlterTable
ALTER TABLE "ClienteServicioTicket" ALTER COLUMN "tipo" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLIENTE_RAZONSOCIAL" ON "Cliente"("razonSocial");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISERADE_IDTICKETACCION" ON "ClienteServicioActaEntrega"("idTicketAccion");

-- CreateIndex
CREATE INDEX "IDX_CLISERADE" ON "ClienteServicioActaEntrega"("id");

-- AddForeignKey
ALTER TABLE "ClienteServicioActaEntrega" ADD CONSTRAINT "FK_CLISERADE_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioActaEntrega" ADD CONSTRAINT "FK_CLISERADE_IDCLISERTICKETACCION" FOREIGN KEY ("idTicketAccion") REFERENCES "ClienteServicioTicketAccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioEquipo" ADD CONSTRAINT "ClienteServicioEquipo_idActaEntrega_fkey" FOREIGN KEY ("idActaEntrega") REFERENCES "ClienteServicioActaEntrega"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioTicket" ADD CONSTRAINT "FK_CLISERTICKET_NOMBREFLUJO" FOREIGN KEY ("nombreFlujo") REFERENCES "FlujoTicket"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlujoTicketAcciones" ADD CONSTRAINT "FK_FLUJOTICKETACCIONES_NOMBREFLUJO" FOREIGN KEY ("nombreFlujo") REFERENCES "FlujoTicket"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;
