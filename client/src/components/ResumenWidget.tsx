import React, { useEffect, useState } from 'react'
import { useAuthState } from '../context/auth';
import { ClienteServicioTicket, Respuesta } from '../../types/typesSSO';
import axios from 'axios';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface RespuestaTicket extends Respuesta {
  ticket: ClienteServicioTicket
}   

function ResumenWidget() {
    const { user } = useAuthState();
    const [tickets, setTickets] = useState<ClienteServicioTicket[]>([]);
    const [showMore, setShowMore] = useState(false);

    useEffect(()=>{
      getTickets();
    },[])

    const getTickets = async () => {
      try {
        const res = await axios.get('/resumenTickets');
        console.log(res.data);
        setTickets(res.data);
      } catch (error) {
        console.error(error);        
      }
    }
  return (<div className='flex flex-col bg-gray-100 rounded-lg'>
    <h2 className='m-3 text-xl font-bold'>Resumen</h2>
    <div className='m-2 border-2 border-blue-300 rounded-lg'>
      <div className='flex justify-between h-12' onClick={()=>setShowMore(!showMore)}>
        <div className='flex items-center ml-2 space-x-2'>
          <h3 className='text-lg font-bold'>Tickets con respuestas no leídas</h3>
          <h3 className='w-6 h-6 text-lg font-bold text-center text-white bg-red-400 rounded-lg'>{tickets.length}</h3>
        </div>
        {showMore ? <ChevronUpIcon/>:<ChevronDownIcon/>}
      </div>
      {showMore && <ol className='w-full bg-gray-200'>
        {tickets.map(t => 
        <li className='pl-3 border-2 border-blue-400 rounded-lg'>
          <p className='font-bold'>{`Ticket: ${t.id} - ${t.descripcion}`}</p>
          <h4>Resp asignadas no respondidas: {t.respuestas.filter(r=>r.usuarioAsignado?.username === user?.username).length}</h4>
          <ol className='pl-5 list-decimal'>
            {t.respuestas.map(r=>
              <li className='whitespace-nowrap'>{`${r.accion} -> ${r.usuarioAsignado.username}`}</li>)}
          </ol>
        </li>)}
      </ol>}        
    </div>
  </div>)
}

export default ResumenWidget
