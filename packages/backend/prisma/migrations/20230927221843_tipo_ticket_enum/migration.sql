/*
  Warnings:

  - The `tipo` column on the `ClienteServicioTicket` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ticket_tipo_enum" AS ENUM ('SOPORTE_REMOTO', 'MANTENIMIENTO_EN_SITIO', 'MODIFICACION_SERVICIO', 'BAJA_SERVICIO');

-- AlterTable
ALTER TABLE "ClienteServicioTicket" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "ticket_tipo_enum";
