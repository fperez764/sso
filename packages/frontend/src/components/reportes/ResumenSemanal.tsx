import { AreaPendienteHistorial, ClienteServicioTicket, users_area_enum } from "@types/typesSSO";
import axios from "axios";
import dayjs from "dayjs";

interface Props {
    allTickets: ClienteServicioTicket[]
}

async function getHistorial(): Promise<AreaPendienteHistorial[]>{
  try {
    const res = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/ticketsAcciones/historialAccionesPendientes');
    return res.data;      
  } catch (error) {
    console.error(error);
    return [];
  }
}
  
export default async function ResumenSemanal({allTickets}: Props) {
  const historial = await getHistorial();  
  if(!historial || historial.length === 0) return <p>No se pudo recuperar historial de areas de tickets pendientes. Porfavor contacte al administrador</p>
  const fechas = historial.filter(h => h.area === users_area_enum.ATENCION_CLIENTE).map(h => h.fechaRegistro);
  const areas = Object.values(users_area_enum);
  return <div>
    <h3 className="w-1/2 font-bold bg-sky-300">
        Cantidad de tickets pendientes por area
    </h3>
    <div className="grid grid-cols-7 px-3 font-bold text-center bg-gray-200">
    <>
        <h4 className='col-span-2 bg-slate-300'>Area</h4>
        {fechas.map((fecha, i) => <p className={`text-white bg-slate-${600 - i*100}`}>{dayjs(new Date(fecha)).format('DD-MM-YY')}</p>)}
        <p>Pendientes totales</p>
    </>
    {areas.map(area => <>
        <p className='col-span-2 ml-6 text-start'>{area}</p>
        {fechas.map(fecha => <p key={fecha.toString()} className="font-semibold">{historial.find(h => h.area === area && h.fechaRegistro === fecha)?.totalPendientes}</p>)}
        <p>{allTickets.filter(t => t.porResponder?.area === area && !t.resuelto).length}</p>
    </>)}
    </div>
  </div>}
