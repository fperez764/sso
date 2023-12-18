"use client";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { getHub, getModemReporte, getReporteDia, getReporteHora } from "@src/app/api/modem/route";
import { Hubs } from "@types/typesContador";
import ExportContent from "../ui/ExportContent";

interface Props {
    mac: string
    desde: Date
    hasta: Date
}

type RegistroContador = {
  Desde: Date,
  Hasta: Date,
  Megas: number
  Bono: number, 
  Reducido: number, 
  NOQM: number
}
export default function ReporteContador({mac, desde, hasta}: Props) {
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [reporteDia, setReporteDia] = useState<any>(null);
  const [reporteHora, setReporteHora] = useState<any>(null);
  const [reporteResumen, setReporteResumen] = useState<any>(null);
  const [mostrarTipoReporte, setMostrarTipoReporte] = useState<'DIA'|'HORA'|'RESUMEN'>('DIA');

  useEffect(()=>{
    setReporteDia(null);
    setReporteHora(null);
    setReporteResumen(null);
  }, [desde, hasta, mac])

  const generarReporteContador =async (tipo: 'DIA'|'HORA'|'RESUMEN') => {
    setMostrarReporte(true);
    setMostrarTipoReporte(tipo);
    switch (tipo) {
        case 'DIA':
            if(!!reporteDia) return;
            try {
                const resCont = await getReporteDia(mac, desde, hasta);
                setReporteDia(resCont);        
            } catch (error) {
                toast.error('No se pudo obtener el reporte de tráfico por día, porfavor reintente o contacte a soporte');
            }                    
            break;
        case 'HORA':
            if(!!reporteHora) return;
            try {
              const resCont = await getReporteHora(mac, desde, hasta);
              setReporteHora(resCont);        
            } catch (error) {
                toast.error('No se pudo obtener el reporte de tráfico por hora, porfavor reintente o contacte a soporte');
            }        
        default:
            if(!!reporteResumen) return;
            try {
              const resCont = await getModemReporte(mac, desde, hasta);
                setReporteResumen(resCont);        
            } catch (error) {
                toast.error('No se pudo obtener el resumen del reporte de tráfico, porfavor reintente o contacte a soporte');
            }        
            break;
    }
  }
  if(!mac || !desde || !hasta) return <p className="font-bold text-red-500">Fechas y mac de reporte son requeridas: mac: {mac || 'No definida'}</p>;
  return (
    <div>
      {mostrarReporte && !!reporteResumen
      ? <div className="flex flex-col space-x-3 border-2 border-gray-300">
        <div className="flex p-2 space-x-1 font-bold rounded-md bg-sky-400">
            <h4 onClick={()=>generarReporteContador('DIA')} className={`p-2 ${mostrarTipoReporte === 'DIA' ? 'bg-gray-400': 'bg-sky-400'} cursor-pointer hover:bg-sky-200 rounded-tr-xl`}>Reporte Diario de consumo de megas</h4>
            <h4 onClick={()=>generarReporteContador('HORA')} className={`p-2 ${mostrarTipoReporte === 'HORA' ? 'bg-gray-400': 'bg-sky-400'} cursor-pointer hover:bg-sky-200 rounded-tr-xl`}>Reporte por Hora de consumo de megas</h4>
            <h4 onClick={()=>generarReporteContador('RESUMEN')} className={`p-2 ${mostrarTipoReporte === 'RESUMEN' ? 'bg-gray-400': 'bg-sky-400'} cursor-pointer hover:bg-sky-200 rounded-tr-xl`}>Resumen de consumo de megas</h4>
        </div>
        {reporteHora?.length > 0 && mostrarTipoReporte === 'HORA' && <ExportContent jsonContent={reporteHora} title={'porHora'} />} 
        {reporteDia?.length > 0 && mostrarTipoReporte === 'DIA' && <ExportContent jsonContent={reporteDia} title={'porDia'} />}
        {mostrarTipoReporte !== 'RESUMEN' && <div className="grid grid-cols-6 p-2 w-[80%] font-bold">
            <p>Desde</p>
            <p>Hasta</p>
            <p>Regular (MB)</p>
            <p>Bono (MB)</p>
            <p>Reducido (MB)</p>
            <p>NoQM (MB)</p>
        </div>}
        {reporteDia?.length > 0 && mostrarTipoReporte === 'DIA' && reporteDia.map((rDia: RegistroContador) => <div key={rDia.Desde.toString()} 
        className="grid grid-cols-6 p-2 w-[80%] border-2 border-slate-500">
            <p>{rDia.Desde.toString()}</p>
            <p>{rDia.Hasta.toString()}</p>
            <p>{rDia.Megas.toFixed(2)}</p>
            <p>{rDia.Bono.toFixed(2)}</p>
            <p>{rDia.Reducido.toFixed(2)}</p>
            <p>{rDia.NOQM.toFixed(2)}</p>
        </div>)}
        {reporteHora?.length > 0 && mostrarTipoReporte === 'HORA' && reporteHora.map((rHora: RegistroContador) => <div key={rHora.Desde.toString()} 
          className="grid grid-cols-6 p-2 w-[80%] border-2 border-slate-500">
              <p>{rHora.Desde.toString()}</p>
              <p>{rHora.Hasta.toString()}</p>
              <p>{rHora.Megas.toFixed(2)}</p>
              <p>{rHora.Bono.toFixed(2)}</p>
              <p>{rHora.Reducido.toFixed(2)}</p>
              <p>{rHora.NOQM.toFixed(2)}</p>
          </div>)}

        {!!reporteResumen && mostrarTipoReporte === 'RESUMEN' && <div className='flex flex-col w-full mt-3 space-y-3 font-semibold'>
          <p>Consumo Regular contabilizado de paquetes   = {reporteResumen.consumoTotalRegularMB.toFixed(2)} MB</p>
          <p>Consumo en horario nocturno: Bono ilimitado = {reporteResumen.consumoTotalBonoMB.toFixed(2)} MB</p>
          <p>Consumo libre con velocidad limitada        = {reporteResumen.consumoTotalReducidoMB.toFixed(2)} MB</p>
        </div>}
 
        </div>
        : <Button title='Generar reporte de tráfico' titleConfirm="Esto puede tomar algo de tiempo" onClick={() => generarReporteContador('RESUMEN')} className="bg-sky-600" />
      }
    </div>
  )
}