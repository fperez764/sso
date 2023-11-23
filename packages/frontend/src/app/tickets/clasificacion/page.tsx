import ODMView from '@src/components/reportes/ODMView'
import { ClienteServicioTicket, TicketClasificacion } from '@types/typesSSO'
import axios from 'axios'
import React from 'react'

const getTicketClasif = async (): Promise<TicketClasificacion[]> => {
  const res = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/flujosTickets/clasificaciones')
  return res.data
}

const ClasificacionPage
 = async () => {
  const ticketClasif = await getTicketClasif();
  return (
    <div className='grid w-2/3 grid-cols-3 p-6 gap-y-2 gap-x-0'>
      <p className='text-lg font-bold'>Tipo Ticket</p>
      <p className='text-lg font-bold'>Nombre Flujo</p>
      <p className='text-lg font-bold'>Clasificadores</p>
      {ticketClasif.map(clasif => <>
        <p>{clasif.tipo}</p>
        <p>{clasif.nombreFlujo}</p>
        <p>{clasif.clasificadores}</p>
      </>)}
    </div>
  )
}

export default ClasificacionPage

