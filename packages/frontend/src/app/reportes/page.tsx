export const metadata = {
  title: 'Reportes',
  description: 'Reporte semanal de tickets SSO ABE'
}
import { ClienteServicioTicket, FlujoTicket, Users, users_area_enum, users_dep_enum } from '@types/typesSSO';
import axios from 'axios';
import { DataTable } from './data-table';
import { columns } from './columns';
import dayjs from 'dayjs';
import ResumenArea from '@src/components/reportes/ResumenArea';
import ResumenSemanal from '@src/components/reportes/ResumenSemanal';

type Props = {
  tickets: ClienteServicioTicket[];
};

async function getSSTickets(): Promise<ClienteServicioTicket[]>{
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/tickets?count=1000');
    return res.data;      
  } catch (error) {
    console.error(error);
    return [];
  }
}
async function getSSFlujos(): Promise<FlujoTicket[]>{
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/flujosTickets?count=1000');
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function getSSUsers(): Promise<Users[]>{
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/users');
    return res.data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

enum OrigenTicket {
	LINEA_GRATUITA = 'LINEA GRATUITA',
	WHATSAPP = 'WHATSAPP',
	CORREO = 'CORREO',
	VISITA_OFICINA = 'VISITA OFICINA',
	INSTALADOR = 'INSTALADOR',
	OTRO = 'OTRO',
}

export default async function Page(){ 
  const tickets = await getSSTickets();
  if(!tickets || tickets.length < 1) return <p>No se encontraron tickets. Porfavor contacte soporte</p>;
  const ticketsWeek = tickets.filter(t => new Date(t.fechaCreacion).getDate() >= (new Date().getDate() - new Date().getDay()));
  const flujos = await getSSFlujos();
  const users = await getSSUsers();
  return (
    <div className="flex-col pl-2 ml-10 text-black">
        <h1 className="text-xl font-bold text-center">Reporte de Tickets: Semana 
        {Math.floor(new Date().getDate()/7)*7}-{Math.ceil(new Date().getDate()/7)*7} {dayjs(new Date()).format('MMMM')}
        </h1>
        <h3 className="mt-2 font-bold text-center bg-sky-300 orange_gradient">
          {' '}
          Cantidad de tickets por fuente de creación de tickets esta semana
        </h3>
        <ul className="flex px-2 ml-2 space-x-3 grow">
          {Object.values(OrigenTicket).map((origen) => {
            const resueltos = ticketsWeek.filter((t) => t.origen === origen && t.resuelto === true).length;
            const pendientes = ticketsWeek.filter((t) => t.origen === origen && t.resuelto === false).length;
            const noResueltosTotal = tickets.filter((t) => t.origen === origen && t.resuelto === false).length;
            return(            
            <li key={origen} className="p-2 bg-gray-300 border-2 rounded-md grow broder-black whitespace-nowrap">
              <p className='font-bold'>{origen}</p>
              <p>Resueltos esta semana {resueltos}</p>
              <p>Pendientes abiertos esta semana {pendientes}</p>
              <p>Pendientes totales {noResueltosTotal} </p>
            </li>)
          })}
        </ul>
        <div className="flex flex-col">
          <ResumenSemanal allTickets={tickets}/>
          <ResumenArea tickets={tickets} weekTickets={ticketsWeek} users={users}/>
          <div className="w-1/2 px-2 my-3 ml-2">
            <div className="grid grid-cols-2 semi-bold bg-sky-300">
              <h3 className="font-bold bg-sky-300">
                Tipos de tickets<br/>(Nombre Flujo)
              </h3>
              <p className="">Cantidad no resueltos</p>
            </div>
            {flujos.map(f => f.nombre).map((dep) => (
              <div className="grid grid-cols-2 bg-gray-200" key={dep}>
                <p className="">{dep}</p>
                <p className="">{tickets.filter(t => t.nombreFlujo === dep).length}</p>
              </div>
            ))}
          </div>
        </div>
        <DataTable columns={columns} data={tickets} />
    </div>
  );
}
