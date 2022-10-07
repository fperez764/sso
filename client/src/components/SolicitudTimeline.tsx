import { SolicitudRespuesta } from "../../types/types";

export enum AreasAceptacion {
    INSTALADOR = 'INS',
    COMERCIAL = 'COM',
    DOCUMENTOS_COMERCIAL = 'DCOM',
    DOCUMENTOS_INSTALADOR = 'DINS',
    MODEM_ALMACEN = 'ALM',
    MODEM_INSTALADOR = 'MINS',
    INSTALADO = 'INSDO',
    ACTIVADO = 'ACT',
    DOCUMENTOS_ENTREGADOS = 'DNTR',
}

const EXAMPLE = [
    {
        fecha: '2019-12-05',
        estado: 'aprobado',
        descripcion: 'Solicitud Creada',
        key: 'ATENCION_CLIENTE',
        area: 'ATENCION_CLIENTES'
    },
    {
        fecha: '2020-01-21',
        estado: 'aprobado',
        descripcion: 'Comercial acepta la solicitud',
        key: 'COMERCIAL',
        area: 'COMERCIAL'
    },
    {
        fecha: '2020-02-25',
        estado: 'aprobado',
        descripcion: 'Comercial prepara contratos para el cliente',
      key: 'DOCUMENTOS_COMERCIAL',
      area: 'COMERCIAL'
    },
    {
        fecha: '2020-03-16',
        estado: 'rechazado',
        descripcion: 'Instalador recibe contratos de ABE',
        key: 'DOCUMENTOS_INSTALADOR',
        area: 'INSTALACIONES'
    },
    {
      fecha: '2020-04-19',
      estado: 'pendiente',
      descripcion: 'Almacenes alista equipos para instaladores',
      key: 'MODEM_ALMACEN',
      area: 'ALMACENES'
    },
    {
        fecha: '2020-04-19',
        estado: 'pendiente',
        descripcion: 'Almacenes entrega equipos a instaladores',
        key: 'MODEM_INSTALADOR',
        area: 'INSTALACIONES'
    },
    {
        fecha: '2020-05-23',
        estado: 'pendiente',
        descripcion: 'Equipos instalados',
        key: 'INSTALADO',
        area: 'OPERACIONES'
    },
    {
        fecha: '2020-05-23',
        estado: 'pendiente',
        descripcion: 'Equipos activados, servicio activo',
        key: 'ACTIVADO',
        area: 'INSTALACIONES'
    },  
    {
        fecha: '2020-05-23',
        estado: 'pendiente',
        descripcion: 'Contratos entregados a ABE por instalador',
        key: 'DOCUMENTOS_ENTREGADOS',
        area: 'COMERCIAL'
    }
  ];

type area = keyof typeof AreasAceptacion;
const areasKeys = Object.keys(AreasAceptacion) as Array<area>;
const areasKeyLast = EXAMPLE[EXAMPLE.length-1];
export default function SolicitudTimeline() {

    const getColorTimeline = (aceptado: string) => {
        switch (aceptado) {
            case 'aprobado':
                return 'green';
            case 'rechazado':
                return 'red';        
            default:
                return 'gray';
        }
    };
    const getColorProxRespuesta = (respuesta: SolicitudRespuesta) => {
        const curIndex = EXAMPLE.indexOf(respuesta);
        const estado = EXAMPLE.length === curIndex ? 'pendiente' : EXAMPLE[curIndex + 1].estado;
        return getColorTimeline(estado);
    };
  return (
    <div className="overflow-x-auto mt-4">
        <ol className="items-center sm:flex">
            {EXAMPLE.map(respuesta =>
            <li className="relative mb-6 sm:mb-0">
                <div className="flex items-center">
                    <div className={`flex mx-2 z-10 justify-center items-center w-6 h-6 bg-blue-200 rounded-full ring-0 ring-green-700 dark:bg-transparent sm:ring-8 dark:ring-${getColorTimeline(respuesta.estado)}-400 shrink-0`}>
                        <img
                            className="rounded-full h-11"
                            src={`/roles/${respuesta.area}.png`}
                            alt={respuesta.area || 'usuario-area'}
                        />
                    </div>
                    {respuesta != areasKeyLast && <div className={`hidden sm:flex w-full bg-green-400 h-0.5 dark:bg-${getColorProxRespuesta(respuesta)}-700`}/>}
                </div>
                <div className="mt-3 sm:pr-8">
                    <h3 className="text-lg font-semibold dark:text-gray-900 text-white">{respuesta.area}</h3>
                    <time className="block mb-2 text-sm font-normal leading-none dark:text-gray-400 text-gray-500">{respuesta.fecha}</time>
                    <p className="w-20 text-base font-normal dark:text-gray-500 text-gray-400">{respuesta.area}</p>
                </div>
            </li>
        )}
        </ol>
    </div>
  );
}