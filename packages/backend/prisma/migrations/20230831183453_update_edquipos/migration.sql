/*
Warnings:

- Added the required column `modelo` to the `ClienteServicioEquipo` table without a default value. This is not possible if the table is not empty.
- Added the required column `tipo` to the `ClienteServicioEquipo` table without a default value. This is not possible if the table is not empty.

 */
-- AlterTable
ALTER TABLE "ClienteServicioEquipo"
ADD COLUMN "mac" VARCHAR,
ADD COLUMN "modelo" VARCHAR NOT NULL,
ADD COLUMN "tipo" VARCHAR NOT NULL;