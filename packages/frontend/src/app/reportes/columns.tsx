'use client';

import { ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import Button from '@src/components/ui/Button';
import FlujoTimelineReporte from '@src/components/flujos/FlujoTimelineReporte';
import { getColorSeveridad } from '@src/utils/common';
import { ColumnDef } from '@tanstack/react-table';
import { Cliente, ClienteServicio, ClienteServicioTicket, ClienteServicioTicketAccion } from '@types/typesSSO';
import toast from 'react-hot-toast';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<ClienteServicioTicket>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'fechaCreacion',
    header: ({ column }) => {
      return (
        <div className='flex cursor-pointer hover:bg-blue-100 rounded-md'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Creado
          <ArrowsUpDownIcon className='ml-2 h-4 w-4' />
        </div>
      )
    },
    cell: ({ row }) => {
      const fecha = new Date(row.getValue('fechaCreacion'));
      return <p>{fecha.toLocaleDateString('es')}</p>
    }

  },
  {
    accessorKey: 'nombreContacto',
    header: ({ column }) => {
      return (
        <div className='flex cursor-pointer hover:bg-blue-100 rounded-md'
          onClick={() => {
            toast.success('Ordenara por el nombre de contacto');
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          <div className='flex flex-col'>
            <p>Contacto</p>
            <p className='text-xs font-bold'>Razon social cliente</p>
          </div>
          <ArrowsUpDownIcon className='ml-2 h-4 w-4' />
        </div>
      )
    },
    cell: ({ row }) => {
      const ticket = row.original as ClienteServicioTicket;
      const nombreContacto = row.getValue('nombreContacto') as String;
      const clienteNombre = ticket.clienteServicio.cliente.contactos[0].nombreCompleto;
      return <div className='flex flex-col'>
        <p>{nombreContacto}</p>
        {nombreContacto !== clienteNombre && <p className='text-xs font-bold'>{clienteNombre}</p>}
      </div>}
  },
  {
    accessorKey: 'origen',
    header: 'Origen',
  },
  {
    accessorKey: 'reclamo',
    header: 'Resuelto como',
  },
  {
    accessorKey: 'resuelto',
    header: ({ column }) => {
      return (
        <div className='flex cursor-pointer hover:bg-blue-100 rounded-md'
          onClick={() => {
            toast.success('sort');
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Resuelto
          <ArrowsUpDownIcon className='ml-2 h-4 w-4' />
        </div>
      )
    },
    cell: ({ row }) => {
      const resuelto = row.original.resuelto;
      return <p className={`text-center p-3 rounded-md ${resuelto ? 'bg-green-400' : 'bg-red-400'}`}>{resuelto ? 'Si' : 'No'}</p>
    }

  },
  {
    accessorKey: 'descripcion',
    header: 'Descripcion',
  },
  {
    accessorKey: 'severidad',
    header: ({ column }) => {
      return (
        <div className='flex cursor-pointer hover:bg-blue-100 rounded-md'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Severidad
          <ArrowsUpDownIcon className='ml-2 h-4 w-4' />
        </div>
      )
    },
    cell: ({ row }) => {
      const severidad = row.getValue('severidad') as String;
      const css = getColorSeveridad(row.original);
      return <p className={'text-center p-3 rounded-md bg-'+css}>{severidad}</p>
    }
  },
  {
    accessorKey: 'coordenadas',
    header: ({ column }) => {
      return (
        <div className='flex cursor-pointer hover:bg-blue-100 rounded-md'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Latitud/Longitud
          <ArrowsUpDownIcon className='ml-2 h-4 w-4' />
        </div>
      )
    },
    cell: ({ row }) => {
      const latLong = row.getValue('coordenadas') as string;
      const latLongSplit = latLong.split(',');
      return <p>{latLongSplit[0]}<br/>{latLongSplit[1]}</p>
    } 
  },
  {
    accessorKey: 'areaPorResponder',
    header: ({ column }) => {
      return (
        <div className='flex cursor-pointer hover:bg-blue-100 rounded-md'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Area por responder
          <ArrowsUpDownIcon className='ml-2 h-4 w-4' />
        </div>
      )
    },
    cell: ({ row }) => <div className='uppercase'>{row.getValue('areaPorResponder')}</div>,
  },
  {
    accessorKey: 'acciones',
    header: 'Tiempos de resolución',
    cell: ({ row }) => {
      const acciones = row.getValue('acciones') as ClienteServicioTicketAccion[];
      return <FlujoTimelineReporte accionesTicket={acciones}/> 
    } 
  },
];
