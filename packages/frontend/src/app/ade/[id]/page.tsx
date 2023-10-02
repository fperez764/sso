import ADEView from '@src/components/reportes/ADEView'
import { ClienteServicioTicket } from '@types/typesSSO'
import axios from 'axios'
import React from 'react'

interface pageProps {
    params: {id: string}
}

const getTicket = async (id: string): Promise<ClienteServicioTicket> => {
  const res = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/tickets/' + id)
  return res.data
}

const ADE
 = async ({params}: pageProps) => {
  const ticket = await getTicket(params.id);
  return (
    <div className='w-full h-[792px]'>
      <ADEView ticket={ticket} odm={ticket.ordenMantenimiento} />
    </div>
  )
}

export default ADE

