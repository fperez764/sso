export const metadata = {
  title: 'Reportes',
  description: 'Reporte semanal de tickets SSO ABE'
}
import { ClienteServicioTicket, FlujoTicket, Users, flujo_ticket_tipo_enum, users_area_enum, users_dep_enum } from '@types/typesSSO';
import axios from 'axios';
import { DataTable } from './data-table';
import { columns } from './columns';

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
  const flujos = await getSSFlujos();
  const users = await getSSUsers();
  return (
    <div className="flex-col ml-20 pl-2">
        <h1 className="text-xl font-bold text-center">Tickets Dashboard:</h1>
        <h3 className="mt-2 text-center font-bold bg-sky-300 orange_gradient">
          {' '}
          Cantidad de tickets por fuente de creación de tickets
        </h3>
        <ul className="ml-2 px-2 flex space-x-3 grow">
          {Object.values(OrigenTicket).map((origen) => {
            const resueltos = tickets.filter((t) => t.origen === origen && t.resuelto === true).length;
            const noResueltos = tickets.filter((t) => t.origen === origen && t.resuelto === false).length;
            const data=[
              { 'Resueltos': resueltos },
              { 'NoResueltos': noResueltos }
            ];
            return(            
            <li key={origen} className="grow border-2 bg-gray-300 broder-black p-2 rounded-md">
              <p className='font-bold'>{origen}</p>
              <p>Resueltos {resueltos} </p>
              <p>No Resueltos {noResueltos} </p>
            </li>)
          })}
        </ul>
        <div className="flex flex-col">
          <h3 className="font-bold bg-sky-300 w-1/2">
            Cantidad de tickets pendientes por area
          </h3>
          {Object.values(users_area_enum).map((area) => (
            <div className="grid grid-cols-2 bg-gray-200 w-1/2" key={area}>
              <p className="font-bold">{area}</p>
              <p className="">{tickets.filter(t => t.porResponder?.area.includes(area)).length}</p>
            </div>
          ))}
          <h2 className="my-3 font-bold orange_gradient">
            Cantidad de tickets pendiente por usuario en tu unidad: COMERCIAL
          </h2>
          <div className="flex space-x-3 bg-gray-200">
            {users.filter(u => u.departamento === users_dep_enum.COMERCIAL).map(u => <p className="border-2 bg-gray-300 broder-black p-2">
              <span className="font-bold">{u.username}</span> <br />
              Resueltos {tickets.filter(t => t.resuelto && !!t.acciones.find(a => a.usuarioAsignado === u.username)).length} <br />
              No Resueltos {tickets.filter(t => !t.resuelto && !!t.acciones.find(a => a.usuarioAsignado === u.username)).length}
            </p>)}
          </div>

          <div className="ml-2 px-2 my-3 w-1/2">
            <div className="grid grid-cols-2 semi-bold bg-sky-300">
              <h3 className="font-bold bg-sky-300">
                Cantidad de tickets por nombreFlujo
              </h3>
              <p className="">24-31 Agosto</p>
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
