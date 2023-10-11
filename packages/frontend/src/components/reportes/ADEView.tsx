import dayjs from 'dayjs';
import Image from 'next/image';
import React from 'react'
import InputB from '../ui/InputB';
import { ClienteServicioActaEntrega, ClienteServicioTicket, ClienteServicioTicketOrdenMantenimiento } from '@types/typesSSO';
import { OnlyDayMonth } from '@src/utils/common';

interface Props {
    ticket: ClienteServicioTicket, 
    ade?: ClienteServicioActaEntrega
}
const ADEView
 = ({ticket, ade}: Props) => {
    if(!ticket) return <p>No se encontro el ticket</p>
    if(!ade) return <p>No se encontro un acta de entrega para la acción relacionada al ticket {ticket.id}</p>
  return (<div className='px-8 py-12 bg-white pdf-content' id='pdf-content'> 
  <div className='flex flex-col space-y-2 bg-sky-200'>

      <div className="flex items-center justify-around bg-white border-2 border-black">
          <Image width="120" height="70" src="/images/logo.png" alt="ABE Logo" />
          <h1 className="font-bold text-center uppercase">Acta de Entrega de Equipos</h1>
      </div>
      <div className="flex flex-col p-2 space-y-4 bg-white border-2 border-black">
          <div className="grid grid-cols-5 gap-0 text-center border-2 border-black divide-x divide-y divide-black">
              <p className='bg-gray-300'>LUGAR</p>
              <p className='col-span-2'>{ade.lugarRecojo}</p>
              <p className='bg-gray-300'>FECHA</p>
              <p>{dayjs(new Date()).format(OnlyDayMonth)}</p>
              <p className='bg-gray-300'>CLIENTE</p>
              <p className='col-span-2'>{ticket.clienteServicio.cliente.razonSocial}</p>
              <p className='bg-gray-300'>NIT</p>
              <p>{ticket.clienteServicio?.cliente?.nroDocumentoFacturacion}</p>
          </div>
          <div className="flex items-center">
              <h2 className='w-1/2'><span className='font-bold'>DESCRIPCIÓN:</span><br/>{ticket.descripcion}</h2>
              <div className="flex flex-col font-bold">
                  <p>Ticket {ticket.id} - ODM No. {ticket.ordenMantenimiento.id}-2023</p>                
                  <p>RSS: {ticket.ordenMantenimiento.detalles}</p>                
                  <p>Fecha entrega <span className='font-medium'>{(new Date(ade.fechaModificacion)).toLocaleString('es')}
                  </span></p>
              </div>
          </div>
          <div className="flex items-center justify-center mb-2 space-x-4">
          <p className='font-bold'>EMPRESA INSTALADORA:</p>
          <p className='text-xl'>{ade.nombreInstalador}</p>
          </div>
      </div>
      <div className="flex flex-col p-2 text-xs bg-white border-2 border-black">
          <h4 className='mb-2 text-lg font-bold text-center uppercase'>Detalle de Equipos</h4>
          {ticket.ordenMantenimiento && <p className='w-full font-bold text-center'>Equipos solicitados: {ticket.ordenMantenimiento.equipos}</p>}
          <div className='grid grid-cols-8 my-6 text-center divide-x divide-y divide-black'>              
              <p className='font-bold bg-gray-300'>TIPO</p>
              <p className='font-bold bg-gray-300'>MARCA</p>
              <p className='font-bold bg-gray-300'>MODELO</p>
              <p className='col-span-2 font-bold bg-gray-300'>No. SERIE/MAC</p>
              <p className='font-bold bg-gray-300'>ESTADO</p>
              <p className='col-span-2 font-bold bg-gray-300'>OBSERV.</p>
          {ade.equipos.map((equipo, i) => <>
              <p>{equipo.tipo}</p>
              <p>{equipo.marca}</p>
              <p>{equipo.modelo}</p>
              <div className="flex flex-col col-span-2"><p>{equipo.serial}</p><p>{equipo.mac}</p></div>
              <p className=''>{equipo.estado}</p>
              <p className='col-span-2'>{equipo.observaciones}</p>
          </>
          )}
          </div>
          <p>Observaciones: {ade.observaciones}</p>
      </div>
      <ul className="flex flex-col p-2 space-y-1 bg-white border-2 border-black">
          <li>El cliente ha verificado el funcionamiento correcto de los equipos. Asimismo, se compromete a tomar las medidas necesarias de protección para evitar cualquier tipo de daño a los equipos.</li>
          <li>En señal de conformidad, se firmara al pie del presente documento.</li>
          <div className='flex justify-between px-2 py-12 text-sm font-bold'>
              <p className='w-1/4 text-center border-t-2 border-black'>ALMACENES ABE</p>
              <div className="flex flex-col w-1/4">
                  <p className='text-center border-t-2 border-black'>EMPRESA INSTALADORA</p>
                  <p>Nombre:</p>
                  <p>C.I.:</p>
                  <p>EMPRESA:</p>
              </div>
              <div className="flex flex-col w-1/4">
                  <p className='text-center border-t-2 border-black'>CLIENTE</p>
                  <p>Nombre:</p>
                  <p>C.I.:</p>
              </div>
          </div>
      </ul>
  </div>
</div>)
}

export default ADEView

