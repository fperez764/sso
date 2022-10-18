import { SolicitudServicio } from '../../../types/typesSSO';
import SSItemTimeline from './SSItemTimeline';
import SSCliente from './SSCliente';
import SSItem from './SSItem';
import SSServicio from './SSServicio';

interface Props {
    post: SolicitudServicio;
}

const EXAMPLE = [
    {
        id:1,
        fechaCreacion: '2019-12-05',
        estado: 'APROBADO',
        respuesta: 'Solicitud Creada',
        accion: 'ATENCION_CLIENTE',
        area: 'ATENCION_CLIENTES'
    },
    {
        id:2,
        fechaCreacion: '2020-01-21',
        estado: 'APROBADO',
        respuesta: 'Comercial acepta la solicitud',
        accion: 'COMERCIAL',
        area: 'COMERCIAL'
    },
    {
        id:3,
        fechaCreacion: '2020-02-25',
        estado: 'APROBADO',
        respuesta: 'Comercial prepara contratos para el cliente',
        accion: 'DOCUMENTOS_COMERCIAL',
      area: 'COMERCIAL'
    },
    {
        id: 4,
        fechaCreacion: '2020-03-16',
        estado: 'RECHAZADO',
        respuesta: 'Instalador recibe contratos de ABE',
        accion: 'DOCUMENTOS_INSTALADOR',
        area: 'INSTALACIONES'
    },
    {
        id:5,
      fechaCreacion: '',
      estado: 'PENDIENTE',
      respuesta: 'Almacenes alista equipos para instaladores',
        accion: 'MODEM_ALMACEN',
      area: 'ALMACENES'
    },
    {
        id:6,
        fechaCreacion: '',
        estado: 'PENDIENTE',
        respuesta: 'Almacenes entrega equipos a instaladores',
        accion: 'MODEM_INSTALADOR',
        area: 'INSTALACIONES'
    },
    {
        id:7,
        fechaCreacion: '',
        estado: 'PENDIENTE',
        respuesta: 'Equipos instalados',
        accion: 'INSTALADO',
        area: 'OPERACIONES'
    },
    {
        id:8,
        fechaCreacion: '',
        estado: 'PENDIENTE',
        respuesta: 'Equipos activados, servicio activo',
        accion: 'ACTIVADO',
        area: 'INSTALACIONES'
    },  
    {
        id:9,
        fechaCreacion: '',
        estado: 'PENDIENTE',
        respuesta: 'Contratos entregados a ABE por instalador',
        accion: 'DOCUMENTOS_ENTREGADOS',
        area: 'COMERCIAL'
    },
  ];


/**
 * TODO: Componente para una solicitud de servicio, mostrando {id, fechaCreacion creacion, usuario creacion, sistema, prepagado y descripcion}
 * ? TODO: Se pintara en un recuadro verde (si todos sus estados son aceptados), rojo si algun estado es rechazado -> Revisar logica de rechazo
 * ? TODO: Tendra como un timeline mostrando los estados aceptado:rechazado:observacion con un popup del comentario, usuario, fecha de cada estado
 * ? comercial-instalador-documentosIns-docsComercial-modemAlmacen-modemInstalador-instalado-activado-docEntregado
 * ? mostrara un miniEstado del servicio (activado? tickets?)
 * ? mostrara un enlace al cliente
 * @param param0
 * @returns
 */
function SSCard({ post }: Props) {
    return (
        <div className="p-3 border-b border-blue-300">
            <div className="flex cursor-pointer">
                <SSItem post={post}/>
                {/*Servicio*/}
                <SSServicio servicio={post.servicio} />
                {/*Cliente*/}
                <SSCliente cliente={post.cliente}/>
            </div>
            <SSItemTimeline respuestas={EXAMPLE}/> 
        </div>
    );
}

export default SSCard;
