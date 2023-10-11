import ODMView from '@src/components/reportes/ODMView'
import { ClienteServicioTicket } from '@types/typesSSO'
import { AxiosError } from 'axios'
import React, { Suspense } from 'react'

interface pageProps {
    params: {id: string}
}

const getTicketOrError = async (id: string): Promise<ClienteServicioTicket|string> => {
  try{
    const res = await fetch(process.env.NEXT_PUBLIC_SERVER_URL + '/tickets/' + id, {cache: 'no-cache'})
    return await res.json();
  } catch (error: unknown) {
    if(error instanceof AxiosError)
    {console.error('accion error:', error.response?.data);
    return error.response?.data.message;}
    console.error('accion error:', error);
    return 'Algo salio mal al buscar el ticket'
  }
}

const ODM
 = async ({params}: pageProps) => {
  const ticketOrError = await getTicketOrError(params.id);
  if(typeof(ticketOrError) === 'string') return <p>Error: {ticketOrError}</p>
  return <Suspense fallback={<p>Id: Not loaded</p>}>
    <div className='w-full h-[792px]'>
      <ODMView ticket={ticketOrError} odm={ticketOrError.ordenMantenimiento} />
    </div>
    </Suspense>
}

export default ODM

