const queryServicioPorModem = "SELECT id FROM sch_operaciones.sube_cliente_servicio WHERE modem = $1;";

const queryModemPorServicio = "SELECT modem FROM sch_operaciones.sube_cliente_servicio WHERE id = $1;";

const queryExcepcionesContabilizarPorModem = "SELECT SERVICIO.id, SERVICIO.mantenimiento, SERVICIO.baja_definitiva, MODEM.newtec_id," +
    "MODEM.bloqueado_por_falta_pago, MODEM.newtec_locked, MODEM.qm_managed, MODEM.cliente, MODEM.newtec_description " +
    "FROM sch_operaciones.sube_cliente_servicio SERVICIO RIGHT JOIN sch_operaciones.sube_modem_newtec MODEM " +
    "ON SERVICIO.modem = MODEM.id WHERE MODEM.id = $1;";

const updateServicioToCorte = "UPDATE sch_operaciones.sube_cliente_servicio" +
    " SET motivo_baja=$1, fecha_registro_baja=$2, mantenimiento=$3 WHERE id = $4 RETURNING *;"

export {
    queryExcepcionesContabilizarPorModem, 
    queryServicioPorModem, 
    updateServicioToCorte, 
    queryModemPorServicio,
};