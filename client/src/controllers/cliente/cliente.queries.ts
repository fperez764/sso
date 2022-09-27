const allClientesQuery =
    'SELECT id, fecha_creacion, usuario_creacion, fecha_baja, usuario_baja, nombres, apellidos, nro_documento, tipo_documento,' +
    'direccion, telefono, email, nit, razon_social, tipo_cliente FROM operaciones.cliente ORDER BY id DESC';

/** Devuelve un Cliente segun su id */
const getClienteQuery =
    'SELECT id, fecha_creacion, usuario_creacion, fecha_baja, usuario_baja, nombres, apellidos, nro_documento, tipo_documento,' +
    'direccion, telefono, email, nit, razon_social, tipo_cliente FROM operaciones.cliente WHERE id = $1';

const bajaClienteQuery =
    'UPDATE operaciones.cliente SET fecha_baja=$2, usuario_baja=$3 WHERE id = $1';
const updateClienteQuery =
    'UPDATE operaciones.cliente ' +
    'SET nombres=$2, apellidos=$3, nro_documento=$4, tipo_documento=$5, direccion=$6, telefono=$7, email=$8, nit=$9, razon_social=$10, tipo_cliente=$11';
('WHERE id = $1');

const insertClienteQuery =
    'INSERT INTO operaciones.cliente(id, fecha_creacion, usuario_creacion, fecha_baja, usuario_baja, ' +
    'nombres, apellidos, nro_documento, tipo_documento, direccion, telefono, email, nit, razon_social, tipo_cliente) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);';

export {
    insertClienteQuery,
    updateClienteQuery,
    bajaClienteQuery,
    getClienteQuery,
    allClientesQuery,
};
