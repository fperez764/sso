-- AlterTable
ALTER TABLE "ClienteServicioTicketOrdenMantenimiento"
ADD COLUMN "precioAcordado" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "horasViaje"
SET DEFAULT 0;