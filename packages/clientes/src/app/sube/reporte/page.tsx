'use client'
import { useState } from "react";
import ReporteMegas from "./ReporteMegas";
import { useAuthState } from "@/context/auth";
import dayjs from "dayjs";
import ComboBox from "@/components/ui/ComboBox";
import ReporteContador from "./ReporteContador";

export default function ReporteConsumo() {
  const { user } = useAuthState();
  const [planSelec, setPlanSelec] = useState(user?.clientePlanes[0]);  


  const vistaPlan = (clientePlan: any) => {
    return <div >
      <h2 className="font-bold">{clientePlan.plan?.nombre}</h2>
      <h3>{clientePlan.clientePlanEquipos.id}</h3>
      <h3>{new Date(clientePlan.fechaAlta).toLocaleString('es')}</h3>
      <p>{clientePlan.clientePlanEquipos.equipo.extra.mac}</p>
      <p>{JSON.stringify(clientePlan)}</p>
    </div>
  }

  if(!planSelec) return <p className="font-bold">No pudimos determinar su plan. Por favor contacte soporte para regularizar su servicio.</p>
  return (
  <main className="w-full mt-3 space-y-2">
    <h1 className="font-bold text-xl">Reporte de consumo </h1>
    <h2 className="font-bold text-xl text-red-600">Estamos actualizando nuestro sistema, por lo que de momento no es posible ver el consumo de megas, sin embargo si se están asignando. Disculpe las molestias.</h2>
    
    <div className="flex border-2 border-gray-300 rounded-md p-6 flex-col space-y-3">
      {/* {user && user.clientePlanes.length > 1 
        ? <ComboBox value={planSelec.plan.nombre} options={user?.clientePlanes.map(cp => `${cp.id}: ${cp.plan.nombre}-${cp.mac}`)} setData={(option)=>setPlanSelec(user?.clientePlanes.find(cp => option.includes(cp.mac)))} postName='Seleccione el plan para el reporte'/>
        : <h2 className="font-bold text-lg">Plan {`${planSelec.id}: ${planSelec.plan.nombre}${planSelec.mac ? ('- MAC: '+planSelec.mac):''}`}</h2>
      }
      <p className="text-lg">
        Su fecha aniversario es el
        <span className="font-bold mx-1">{dayjs(new Date(planSelec.fechaAlta)).format('DD')}</span>
        de cada mes
      </p>
      {!!planSelec.mac && <ReporteMegas mac={planSelec.mac}/>}
      <p>
        Debe realizar el pago del siguiente periodo antes de su fecha
        aniversario<br/>Si usted no paga una de sus mensualidades, se cobrará un costo de
        rehabilitación de Bs. 70 adicionales a su siguiente pago mensual
      </p> */}

    </div>
  </main>
);}
