import dayjs from 'dayjs';
import Image from 'next/image';
import React from 'react'
import InputB from '../ui/InputB';
import { ClienteServicioTicket, ClienteServicioTicketOrdenMantenimiento } from '@types/typesSSO';
import { OnlyDayMonth } from '@src/utils/common';

interface Props {
    ticket: ClienteServicioTicket, 
    odm: ClienteServicioTicketOrdenMantenimiento
}
const ODMView
 = ({ticket, odm}: Props) => {
    if(!ticket) return <p>No se encontro el ticket</p>
    if(!odm) return <p>No se encontro la ODM</p>
  return (<div className='px-6 py-6 bg-white pdf-content'>
    <div className='flex flex-col space-y-2 bg-sky-200'>
    <div className="flex items-center justify-around bg-white border-2 border-black">
        <Image width="120" height="70" src="/images/logo.png" alt="ABE Logo" />
        <h1 className="font-bold text-center uppercase">Orden de Mantenimiento</h1>
    </div>
    <div className="flex flex-col pl-2 space-y-2 bg-white border-2 border-black">
        <div className="flex items-center">
            <h2 className='w-1/2'><span className='font-bold'>DESCRIPCIÓN:</span><br/>{ticket.descripcion}</h2>
            <div className="flex flex-col font-bold">
                <p>ODM-Ticket No. <span>{ticket.id}-2023</span></p>                
                <p>Fecha asignación <span>{dayjs(ticket.ordenMantenimiento?.fechaCreacion).format(OnlyDayMonth)}</span></p>
            </div>
        </div>
        <div className="flex items-center justify-around py-4">
        <p className='font-bold'>EMPRESA INSTALADORA:</p>
        <p>{odm.nombreInstalador}</p>
        </div>
    </div>
    <div className="bg-white border-2 border-black">
        <h4 className='my-2 font-bold text-center uppercase'>Características del Mantenimiento</h4>
        <div className="grid h-56 grid-cols-2 m-6 border-2 border-black divide-x divide-y divide-black text-start">
            <p className='font-bold'>Servicio</p><p className='text-center'> {ticket.clienteServicio.nombreServicio}</p>
            <p className='font-bold'>Ticket</p><p className='text-center'>No. {ticket.id}/{ticket.nombreFlujo}</p>
            <p className='font-bold'>Dirección</p><p className='text-center'> {ticket.direccion || 'No especificado'}</p>
            {/*<p className='font-bold'>Localidad o Propiedad</p><p className='text-center'> {ticket.direccion || 'No especificado'}</p>*/}
            <p className='font-bold'>Latitud</p><p className='text-center'> {ticket.coordenadas?.split(',')[0]}</p>
            <p className='font-bold'>Longitud</p><p className='text-center'> {ticket.coordenadas?.split(',')[1]}</p>
            <p className='font-bold'>Nombre Cliente</p><p className='text-center'> {ticket.nombreContacto || ticket.clienteServicio?.cliente?.contactos[0]?.nombreCompleto || 'No especificado'}</p>
            <p className='font-bold'>Telefono contacto</p><p className='text-center'> {ticket.telefonoContacto || ticket.clienteServicio?.cliente?.contactos[0]?.telefono || 'No especificado'}</p>
        </div>
    </div>
    <div className="flex flex-col px-2 pb-4 space-x-2 bg-white border-2 border-black">
        <h4 className='my-2 font-bold text-center uppercase'>Más detalles del Mantenimiento: RSS No. {odm.detalles}</h4>
        <p>Lugar de recojo: {odm.lugarRecojo}</p>
        <p> </p>
        <p>Diagnostico Inicial: {odm.diagnostico}</p>
        <p>Equipos: {odm.equipos}</p>
        <div className="flex items-center h-8 px-2 py-4 my-4 space-x-2 border-2 border-gray-200 rounded-md">
            <label>Fecha visita:</label>
            <p>{dayjs(odm.fechaVisitaProgramada).format(OnlyDayMonth)}</p>
        </div>
        <p className='font-bold text-md'>Precio acordado (Bs.): {odm.precioAcordado}</p> 
    </div>
    <ul className="flex flex-col p-2 space-y-1 text-sm bg-white border-2 border-black">
        <li>El monto indicado será pagado por 
            <span className='font-bold'> {ticket.clienteServicio?.cliente?.razonSocial}</span> a la Empresa 
            <span className='font-bold'> {odm.nombreInstalador}</span>
        </li>
        <li>El plazo para realizar el mantenimiento es de 10 días calendario a partir de la fecha de asignación.</li>
        <li>El monto a cobrar se basa en la distancia al sitio.</li>
        <li>El instalador deberá cobrar el monto indicado en esta Orden de Mantenimiento.</li>
        <li>Todos los costos incluyen los impuestos de ley.</li>
        <li>El servicio tiene un tiempo de garantía de 3 meses a partir del Mantenimiento.</li>
        <li>Todos los equipos que fueron usados o se encontraron dañados en sitio deben ser devueltos a ABE en un plazo máximo de 15 días de calendario.</li>
    </ul>
</div></div>)
}

export default ODMView

