import ADEView from '@src/components/reportes/ADEView'
import { ClienteServicioTicketAccion } from '@types/typesSSO'
import axios, { AxiosError } from 'axios'
import React, { Suspense } from 'react'

interface pageProps {
    params: {id: string}
}

const getAccionOrError = async (id: string): Promise<ClienteServicioTicketAccion|string> => {
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/ticketsAcciones/' + id)
    return res.data      
  } catch (error: unknown) {
    if(error instanceof AxiosError)
    {console.error('accion error:', error.response?.data);
    return error.response?.data.message;}
    console.error('accion error:', error);
    return 'Algo salio mal al buscar la acción'
  }
}

const ADE
 = async ({params}: pageProps) => {
  const accionOrError = await getAccionOrError(params.id);
  if(typeof(accionOrError) === 'string') return <p>Error: {accionOrError}</p>
  return <Suspense fallback={<p>Id: Not loaded</p>}>
  <div className='w-full h-[792px]'>
      <ADEView ticket={accionOrError.clienteServicioTicket} ade={accionOrError.actaEntrega} />
  </div>
  </Suspense>
}

export default ADE

