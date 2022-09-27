/** Devuelve la union de registros de todos los paquetes extra en ambas tablas MB_ADICIONAL,
 * DETALLE relacionados a un servicio de mas reciente a mas antiguo */
const allPaquetesDetalleQuery =
    'SELECT MAD.id, MAD.fecha_alta, MAD.fecha_baja, MAD.fecha, MAD.importe, MAD.mb, MAD.periodo, ' +
    'MAD.prestamo, MAD.codigo, MAD.consumido, MAD.mb_consumidos, MAD.servicio, MAD.detalle, DET.descripcion, ' +
    'DET.facturado, DET.login, DET.nro_autorizacion, DET.nro_factura FROM sch_operaciones.sube_cliente_servicio_periodo_' +
    'mb_adicional MAD full join sch_operaciones.sube_cliente_servicio_periodo_detalle DET ON MAD.detalle = DET.id WHERE ' +
    'MAD.servicio = $1 AND MAD.fecha_baja > $2 ORDER BY MAD.fecha_alta DESC';

/** Devuelve la lista de paquetes no Bono vigentes para una fecha relacionadas a un servicio por orden de compra (Mas proximo a vencer primero) */
const allPaquetesRegularesVigentesQuery =
    'SELECT MAD.id, MAD.fecha_alta, MAD.fecha_baja, MAD.fecha, MAD.importe, MAD.mb, ' +
    'MAD.periodo, MAD.prestamo, MAD.codigo, MAD.consumido, MAD.mb_consumidos, MAD.servicio, MAD.detalle, DET.descripcion ' +
    'FROM sch_operaciones.sube_cliente_servicio_periodo_mb_adicional MAD ' +
    'FULL JOIN sch_operaciones.sube_cliente_servicio_periodo_detalle DET ON MAD.detalle = DET.id ' +
    'WHERE MAD.servicio = $1 AND MAD.consumido = false AND $2 BETWEEN MAD.fecha_alta and MAD.fecha_baja ' +
    "AND DET.DESCRIPCION NOT LIKE 'Bono%' ORDER BY MAD.fecha_baja ASC LIMIT $3;";

/** Devuelve la lista de paquetes de Bono vigentes para una fecha relacionadas a un servicio por orden de compra (Mas proximo a vencer primero) */
const allPaquetesBonoVigentesQuery =
    'SELECT MAD.id, MAD.fecha_alta, MAD.fecha_baja, MAD.fecha, MAD.importe, MAD.mb, ' +
    'MAD.periodo, MAD.prestamo, MAD.codigo, MAD.consumido, MAD.mb_consumidos, MAD.servicio, MAD.detalle, DET.descripcion ' +
    'FROM sch_operaciones.sube_cliente_servicio_periodo_mb_adicional MAD ' +
    'FULL JOIN sch_operaciones.sube_cliente_servicio_periodo_detalle DET ON MAD.detalle = DET.id ' +
    'WHERE MAD.servicio = $1 AND MAD.consumido = false AND $2 BETWEEN MAD.fecha_alta and MAD.fecha_baja ' +
    "AND DET.DESCRIPCION LIKE 'Bono%' ORDER BY MAD.fecha_baja ASC LIMIT $3;";

/** Devuelve la lista de paquetes relacionados a un servicio donde la compra del paquete fue en un rango de fechas. (Mas proximo a vencer primero) */
const allPaquetesVigentesQuery =
    'SELECT id, fecha_alta, fecha_baja, fecha, importe, mb, periodo, prestamo, codigo, ' +
    'consumido, mb_consumidos, servicio, detalle FROM sch_operaciones.sube_cliente_servicio_periodo_mb_adicional ' +
    'WHERE servicio = $1 AND fecha_baja > $2 ORDER BY id;';

/** Devuelve un paquete segun su id */
const getPaqueteQuery =
    'SELECT id, fecha_alta, fecha_baja, fecha, importe, mb, periodo, prestamo, codigo, ' +
    'consumido, mb_consumidos, servicio, detalle FROM sch_operaciones.sube_cliente_servicio_periodo_mb_adicional ' +
    'WHERE id = $1';

/** Actualiza los campos @consumido (boolean), @mb_consumidos (+integer) de un registro con @id de la tabla de MB_ADICIONALES */
const updatePaqueteQuery =
    'UPDATE sch_operaciones.sube_cliente_servicio_periodo_mb_adicional ' +
    'SET consumido=$2, mb_consumidos=$3 WHERE id = $1 RETURNING *;';

/** Devuelve el registro con @id de la tabla DETALLE relacionado a un registro MB_ADICIONAL */
const detalleQuery =
    'SELECT id, fecha_alta, fecha_baja, fecha_ultima_modificacion, usr_alta, usr_baja, usr_ultima_modificacion, descripcion, mb, cliente_servicio_periodo, facturado, fecha, login, nro_autorizacion, nro_factura, codigo, importe ' +
    "FROM sch_operaciones.sube_cliente_servicio_periodo_detalle WHERE id = '$1'";

const insertPaqueteQuery =
    'INSERT INTO sch_operaciones.sube_cliente_servicio_periodo_mb_adicional(' +
    'fecha_alta, fecha_baja, fecha_ultima_modificacion, fecha, importe, mb, periodo, prestamo, codigo, consumido, mb_consumidos, servicio, detalle) ' +
    'VALUES ($1, $2, $1, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;';

export {
    insertPaqueteQuery,
    detalleQuery,
    updatePaqueteQuery,
    allPaquetesVigentesQuery,
    allPaquetesBonoVigentesQuery,
    allPaquetesRegularesVigentesQuery,
    getPaqueteQuery,
    allPaquetesDetalleQuery,
};
