-- CreateTable
CREATE TABLE "TicketClasificacion" (
    "id" SERIAL NOT NULL,
    "fechaCreacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaModificacion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaBaja" TIMESTAMP(6),
    "usuarioCreacion" VARCHAR NOT NULL,
    "usuarioBaja" VARCHAR,
    "tipo" "ticket_tipo_enum" NOT NULL DEFAULT 'SOPORTE_REMOTO',
    "detalle" VARCHAR NOT NULL,

    CONSTRAINT "PK_TICKETCLASIFICACION" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "IDX_TICKETCLASIFICACION" ON "TicketClasificacion"("id");
