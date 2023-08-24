/*
  Warnings:

  - You are about to drop the column `equipoSerial` on the `ClienteServicioEquipo` table. All the data in the column will be lost.
  - You are about to drop the column `flujo` on the `ClienteServicioTicket` table. All the data in the column will be lost.
  - You are about to drop the column `servicio` on the `FlujoSolicitud` table. All the data in the column will be lost.
  - You are about to drop the column `flujo` on the `FlujoTicketAcciones` table. All the data in the column will be lost.
  - You are about to drop the column `servicio` on the `ServicioPaquete` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idClienteServicio,serial]` on the table `ClienteServicioEquipo` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orden,nombreFlujo]` on the table `FlujoTicketAcciones` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre,nombreServicio]` on the table `ServicioPaquete` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `serial` to the `ClienteServicioEquipo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nombreServicio` to the `ServicioPaquete` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClienteServicio" DROP CONSTRAINT "FK_CLISER_IDCLIENTE";

-- DropForeignKey
ALTER TABLE "ClienteServicio" DROP CONSTRAINT "FK_CLISER_NOMBRESERVICIO";

-- DropForeignKey
ALTER TABLE "ClienteServicioEquipo" DROP CONSTRAINT "FK_CLISEREQUIPO_IDCLISER";

-- DropForeignKey
ALTER TABLE "ClienteServicioEvento" DROP CONSTRAINT "FK_CLISEREVENTO_IDCLISER";

-- DropForeignKey
ALTER TABLE "ClienteServicioModem" DROP CONSTRAINT "FK_CLISERMODEM_IDCLIENTESOLICITUDACCION";

-- DropForeignKey
ALTER TABLE "ClienteServicioModem" DROP CONSTRAINT "FK_CLISERMODEM_IDCLISER";

-- DropForeignKey
ALTER TABLE "ClienteServicioPeriodo" DROP CONSTRAINT "FK_CLISERPERIODO_IDCLISER";

-- DropForeignKey
ALTER TABLE "ClienteServicioTicket" DROP CONSTRAINT "FK_CLISERTICKET_NOMBREFLUJO";

-- DropForeignKey
ALTER TABLE "ClienteServicioTicketAccion" DROP CONSTRAINT "FK_CLISERTICKETACCION_IDTICKET";

-- DropForeignKey
ALTER TABLE "ClienteServicioTicketAccionComentario" DROP CONSTRAINT "FK_CLISERTICKETACCIONCOMENTARIO_IDTICKETACCION";

-- DropForeignKey
ALTER TABLE "ClienteSolicitud" DROP CONSTRAINT "FK_CLISOL_IDCLIENTE";

-- DropForeignKey
ALTER TABLE "ClienteSolicitud" DROP CONSTRAINT "FK_CLISOL_NOMBREFLUJO";

-- DropForeignKey
ALTER TABLE "ClienteSolicitudAccion" DROP CONSTRAINT "FK_CLISOLACCION_IDCLISOL";

-- DropForeignKey
ALTER TABLE "ClienteSolicitudAccionComentario" DROP CONSTRAINT "FK_CLISOLACCIONCOMENTARIO_IDCLISOLACCION";

-- DropForeignKey
ALTER TABLE "FlujoSolicitud" DROP CONSTRAINT "FK_FLUJOSOL_NOMBRESERVICIO";

-- DropForeignKey
ALTER TABLE "FlujoSolicitudAcciones" DROP CONSTRAINT "FK_FLUJOSOLACCIONES_NOMBREFLUJO";

-- DropForeignKey
ALTER TABLE "FlujoTicket" DROP CONSTRAINT "FK_FLUJOTICKET_NOMBRESERVICIO";

-- DropForeignKey
ALTER TABLE "FlujoTicketAcciones" DROP CONSTRAINT "FK_FLUJOTICKETACCIONES_NOMBREFLUJO";

-- DropForeignKey
ALTER TABLE "ServicioPaquete" DROP CONSTRAINT "ServicioPaquete_servicio_fkey";

-- DropIndex
DROP INDEX "IDX_CISEREQUIPO_SERIAL";

-- DropIndex
DROP INDEX "UQ_CLISEREQUIPO_SERIAL";

-- DropIndex
DROP INDEX "UQ_FLUJOTICKETACCIONES_ORDEN_NOMBREFLUJO";

-- DropIndex
DROP INDEX "UQ_SERVICIOPAQUETE_NOMBRE_NOMBRESERVICO";

-- AlterTable
ALTER TABLE "ClienteServicioEquipo" DROP COLUMN "equipoSerial",
ADD COLUMN     "serial" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "ClienteServicioTicket" DROP COLUMN "flujo",
ADD COLUMN     "nombreFlujo" VARCHAR;

-- AlterTable
ALTER TABLE "FlujoSolicitud" DROP COLUMN "servicio",
ADD COLUMN     "nombreServicio" VARCHAR;

-- AlterTable
ALTER TABLE "FlujoTicketAcciones" DROP COLUMN "flujo",
ADD COLUMN     "nombreFlujo" VARCHAR;

-- AlterTable
ALTER TABLE "ServicioPaquete" DROP COLUMN "servicio",
ADD COLUMN     "nombreServicio" VARCHAR NOT NULL;

-- CreateIndex
CREATE INDEX "IDX_CISEREQUIPO_SERIAL" ON "ClienteServicioEquipo"("serial");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISEREQUIPO_SERIAL" ON "ClienteServicioEquipo"("idClienteServicio", "serial");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_FLUJOTICKETACCIONES_ORDEN_NOMBREFLUJO" ON "FlujoTicketAcciones"("orden", "nombreFlujo");

-- CreateIndex
CREATE UNIQUE INDEX "UQ_SERVICIOPAQUETE_NOMBRE_NOMBRESERVICO" ON "ServicioPaquete"("nombre", "nombreServicio");

-- AddForeignKey
ALTER TABLE "ClienteServicio" ADD CONSTRAINT "FK_CLISER_IDCLIENTE" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicio" ADD CONSTRAINT "FK_CLISER_NOMBRESERVICIO" FOREIGN KEY ("nombreServicio") REFERENCES "Servicio"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioEvento" ADD CONSTRAINT "FK_CLISEREVENTO_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioEquipo" ADD CONSTRAINT "FK_CLISEREQUIPO_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioPeriodo" ADD CONSTRAINT "FK_CLISERPERIODO_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioTicket" ADD CONSTRAINT "FK_CLISERTICKET_NOMBREFLUJO" FOREIGN KEY ("nombreFlujo") REFERENCES "FlujoTicket"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSolicitud" ADD CONSTRAINT "FK_CLISOL_IDCLIENTE" FOREIGN KEY ("idCliente") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSolicitud" ADD CONSTRAINT "FK_CLISOL_NOMBREFLUJO" FOREIGN KEY ("nombreFlujo") REFERENCES "FlujoSolicitud"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicioPaquete" ADD CONSTRAINT "ServicioPaquete_nombreServicio_fkey" FOREIGN KEY ("nombreServicio") REFERENCES "Servicio"("nombre") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioTicketAccion" ADD CONSTRAINT "FK_CLISERTICKETACCION_IDTICKET" FOREIGN KEY ("idTicket") REFERENCES "ClienteServicioTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioTicketAccionComentario" ADD CONSTRAINT "FK_CLISERTICKETACCIONCOMENTARIO_IDTICKETACCION" FOREIGN KEY ("idTicketAccion") REFERENCES "ClienteServicioTicketAccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSolicitudAccion" ADD CONSTRAINT "FK_CLISOLACCION_IDCLISOL" FOREIGN KEY ("idClienteSolicitud") REFERENCES "ClienteSolicitud"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSolicitudAccionComentario" ADD CONSTRAINT "FK_CLISOLACCIONCOMENTARIO_IDCLISOLACCION" FOREIGN KEY ("idClienteSolicitudAccion") REFERENCES "ClienteSolicitudAccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlujoSolicitud" ADD CONSTRAINT "FK_FLUJOSOL_NOMBRESERVICIO" FOREIGN KEY ("nombreServicio") REFERENCES "Servicio"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlujoSolicitudAcciones" ADD CONSTRAINT "FK_FLUJOSOLACCIONES_NOMBREFLUJO" FOREIGN KEY ("nombreFlujo") REFERENCES "FlujoSolicitud"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlujoTicket" ADD CONSTRAINT "FK_FLUJOTICKET_NOMBRESERVICIO" FOREIGN KEY ("nombreServicio") REFERENCES "Servicio"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlujoTicketAcciones" ADD CONSTRAINT "FK_FLUJOTICKETACCIONES_NOMBREFLUJO" FOREIGN KEY ("nombreFlujo") REFERENCES "FlujoTicket"("nombre") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioModem" ADD CONSTRAINT "FK_CLISERMODEM_IDCLIENTESOLICITUDACCION" FOREIGN KEY ("idClienteSolicitudAccion") REFERENCES "ClienteSolicitudAccion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteServicioModem" ADD CONSTRAINT "FK_CLISERMODEM_IDCLISER" FOREIGN KEY ("idClienteServicio") REFERENCES "ClienteServicio"("id") ON DELETE CASCADE ON UPDATE CASCADE;
