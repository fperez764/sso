-- CreateTable
CREATE TABLE "ClienteServicioActaEntregaEquipo" (
    "serial" VARCHAR NOT NULL,
    "estado" "equipo_estado_enum" NOT NULL DEFAULT 'NUEVO',
    "verificado" BOOLEAN NOT NULL DEFAULT true,
    "observaciones" VARCHAR,
    "idClienteServicio" INTEGER NOT NULL,
    "idActaEntrega" INTEGER NOT NULL,

    CONSTRAINT "PK_CLISERADEEQUIPO_IDADE_EQUIPOSERIAL" PRIMARY KEY ("idActaEntrega","serial")
);

-- CreateIndex
CREATE INDEX "IDX_CISERADEEQUIPO_SERIAL" ON "ClienteServicioActaEntregaEquipo"("serial");

-- AddForeignKey
ALTER TABLE "ClienteServicioActaEntregaEquipo" ADD CONSTRAINT "ClienteServicioActaEntregaEquipo_idActaEntrega_fkey" FOREIGN KEY ("idActaEntrega") REFERENCES "ClienteServicioActaEntrega"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
