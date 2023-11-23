'use client';

import { ClienteServicioTicket, Users, users_area_enum, users_dep_enum } from "@types/typesSSO";
import ComboBox from "../ui/ComboBox";
import { useState } from "react";

interface Props {
    users: Users[];
    tickets: ClienteServicioTicket[];
    weekTickets: ClienteServicioTicket[];
}

export default function ResumenArea({users, tickets, weekTickets}: Props) {
  const [unidad, setUnidad] = useState();
  return <>
    <h2 className="flex items-center my-3 space-x-3">
    <span className="text-xl font-bold">Cantidad de tickets pendiente por usuario por Unidad:</span><ComboBox options={Object.values(users_dep_enum)} postName='Unidad' setData={setUnidad}/>
    </h2>
    <div className="flex space-x-3 ml-6 bg-gray-200 overflow-x-auto w-[80%] ">
    <p className="sticky left-0 p-2 bg-gray-300 border-2 broder-black whitespace-nowrap">
        <span className="font-bold">Usuario</span> <br />
        Respondidos esta semana:<br />
        Respondidos Resueltos:<br />
        Asignados Pendientes:
    </p>
    {users.filter(u => u.departamento === unidad).map(u => <p className="p-2 bg-gray-300 border-2 broder-black whitespace-nowrap">
        <span className="font-bold">{u.username}</span> <br />
        {tickets.filter(t => t.acciones.find(a => a.usuarioAsignado === u.username && a.respuesta)).length} <br />
        {tickets.filter(t => t.resuelto && !!t.acciones.find(a => a.usuarioAsignado === u.username)).length} <br />
        {tickets.filter(t => !t.resuelto && !!t.acciones.find(a => a.usuarioAsignado === u.username)).length}
    </p>)}
    </div>
      
</>}
