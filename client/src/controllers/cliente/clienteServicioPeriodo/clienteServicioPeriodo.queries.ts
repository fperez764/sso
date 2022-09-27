const selectQuery =
    'SELECT id, fecha_alta, fecha_baja, fecha_ultima_modificacion, usr_alta, usr_baja, usr_ultima_modificacion, ' +
    'b_bono_consumido, b_baja_velocidad_consumido, b_normal_consumido, fecha_fin, fecha_inicio, mb_bono, mb_extra, mb_paquete, ' +
    'mb_periodo_anterior, cliente_servicio, sobre_paso_consumo, nro_autorizacion, nro_factura, doc_entry_pago, facturado, ' +
    'fecha_facturacion, fecha_pago, fecha_sobre_paso_consumo, login_facturacion, login_pago, pagado, cortado, mb_original, anulado, ' +
    'comentario_pago FROM sch_operaciones.sube_cliente_servicio_periodo WHERE id = $1;';

const updateQuery =
    'UPDATE sch_operaciones.sube_cliente_servicio_periodo ' +
    'SET id=?, fecha_alta=?, fecha_baja=?, fecha_ultima_modificacion=?, usr_alta=?, usr_baja=?, usr_ultima_modificacion=?, b_bono_consumido=?, b_baja_velocidad_consumido=?, b_normal_consumido=?, fecha_fin=?, fecha_inicio=?, mb_bono=?, mb_extra=?, mb_paquete=?, mb_periodo_anterior=?, cliente_servicio=?, sobre_paso_consumo=?, nro_autorizacion=?, nro_factura=?, doc_entry_pago=?, facturado=?, fecha_facturacion=?, fecha_pago=?, fecha_sobre_paso_consumo=?, login_facturacion=?, login_pago=?, pagado=?, cortado=?, mb_original=?, anulado=?, comentario_pago=? ' +
    'WHERE <condition>;';

const setSobrepasoConsumoByPeriodoQuery =
    'UPDATE sch_operaciones.sube_cliente_servicio_periodo ' +
    "SET fecha_ultima_modificacion=$2, sobre_paso_consumo='true', fecha_sobre_paso_consumo=$2 WHERE id = $1;";

const setSobrepasoConsumoByServicioQuery =
    'UPDATE sch_operaciones.sube_cliente_servicio_periodo ' +
    "SET fecha_ultima_modificacion=$2, sobre_paso_consumo='true', fecha_sobre_paso_consumo=$2 WHERE cliente_servicio = $1 AND fecha_inicio < $2 AND fecha_fin > $2 RETURNING id;";

const buscarPeriodoEnFecha =
    'SELECT id, fecha_alta, fecha_baja, fecha_ultima_modificacion, usr_alta, usr_baja, usr_ultima_modificacion, ' +
    'b_bono_consumido, b_baja_velocidad_consumido, b_normal_consumido, fecha_fin, fecha_inicio, mb_bono, mb_extra, mb_paquete, ' +
    'mb_periodo_anterior, cliente_servicio, sobre_paso_consumo, nro_autorizacion, nro_factura, doc_entry_pago, facturado, ' +
    'fecha_facturacion, fecha_pago, fecha_sobre_paso_consumo, login_facturacion, login_pago, pagado, cortado, mb_original, anulado, ' +
    'comentario_pago FROM sch_operaciones.sube_cliente_servicio_periodo WHERE cliente_servicio = $1 AND $2 BETWEEN fecha_inicio AND fecha_fin;';

export { setSobrepasoConsumoByServicioQuery, buscarPeriodoEnFecha };
