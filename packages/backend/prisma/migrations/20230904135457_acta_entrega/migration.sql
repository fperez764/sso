-- AlterTable
ALTER TABLE "ClienteServicioEquipo" ADD COLUMN     "idActaEntrega" INTEGER;

-- CreateTable
CREATE TABLE "ClienteServicioActaEntrega" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "nombreInstalador" VARCHAR NOT NULL,
    "lugarRecojo" VARCHAR NOT NULL,
    "observaciones" VARCHAR NOT NULL,
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "idODM" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISERADE" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_CLISERADE_IDODM" ON "ClienteServicioActaEntrega"("idODM");

-- CreateIndex
CREATE INDEX "IDX_CLISERADE" ON "ClienteServicioActaEntrega"("id");

-- AddForeignKey
ALTER TABLE "ClienteServicioEquipo" ADD CONSTRAINT "ClienteServicioEquipo_idActaEntrega_fkey" FOREIGN KEY ("idActaEntrega") REFERENCES "ClienteServicioActaEntrega"("id") ON DELETE SET NULL ON UPDATE CASCADE;
