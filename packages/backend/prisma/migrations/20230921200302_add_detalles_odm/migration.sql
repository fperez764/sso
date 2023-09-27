-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.
ALTER TYPE "users_area_enum" ADD VALUE 'INSTALADOR';

ALTER TYPE "users_area_enum" ADD VALUE 'CLIENTE';

-- AlterTable
ALTER TABLE "ClienteServicio"
ADD COLUMN "coordenadas" VARCHAR;

-- AlterTable
ALTER TABLE "ClienteServicioTicketOrdenMantenimiento"
ADD COLUMN "detalles" VARCHAR;