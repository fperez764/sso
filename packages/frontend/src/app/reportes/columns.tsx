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
        <div className='flex rounded-md cursor-pointer hover:bg-blue-100'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Creado
          <ArrowsUpDownIcon className='w-4 h-4 ml-2' />
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
        <div className='flex rounded-md cursor-pointer hover:bg-blue-100'
          onClick={() => {
            toast.success('Ordenara por el nombre de contacto');
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          <div className='flex flex-col'>
            <p>Contacto</p>
            <p className='text-xs font-bold'>Razon social cliente</p>
          </div>
          <ArrowsUpDownIcon className='w-4 h-4 ml-2' />
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
    accessorKey: 'tipo',
    header: 'Resuelto como',
  },
  {
    accessorKey: 'resuelto',
    header: ({ column }) => {
      return (
        <div className='flex rounded-md cursor-pointer hover:bg-blue-100'
          onClick={() => {
            toast.success('sort');
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Resuelto
          <ArrowsUpDownIcon className='w-4 h-4 ml-2' />
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
        <div className='flex rounded-md cursor-pointer hover:bg-blue-100'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Severidad
          <ArrowsUpDownIcon className='w-4 h-4 ml-2' />
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
        <div className='flex rounded-md cursor-pointer hover:bg-blue-100'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Latitud/Longitud
          <ArrowsUpDownIcon className='w-4 h-4 ml-2' />
        </div>
      )
    },
    cell: ({ row }) => {
      const latLong = row.getValue('coordenadas') as string;
      if(!latLong) return <p>''</p>;
      const latLongSplit = latLong.split(',');
      return <p>{latLongSplit[0]}<br/>{latLongSplit[1]}</p>
    } 
  },
  {
    accessorKey: 'porResponder',
    header: ({ column }) => {
      return (
        <div className='flex rounded-md cursor-pointer hover:bg-blue-100'
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc')
          }}
        >
          Area por responder
          <ArrowsUpDownIcon className='w-4 h-4 ml-2' />
        </div>
      )
    },
    cell: ({ row }) => <div className='uppercase'>{row.getValue('porResponder')?.area || 'N/A'}</div>,
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
