"use client";
import { contadorInstance } from "@/app/api/route";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { useState } from "react";
import dayjs from "dayjs";

interface Props {
    mac: string
}

type RegistroContador = {
  Desde: Date,
  Hasta: Date,
  Megas: number
}
export default function ReporteContador({mac}: Props) {
  const [mostrarReporte, setMostrarReporte] = useState(false);
  const [reporteDia, setReporteDia] = useState<any>(null);
  const [reporteHora, setReporteHora] = useState<any>(null);
  const [reporteResumen, setReporteResumen] = useState<any>(null);
  const [mostrarTipoReporte, setMostrarTipoReporte] = useState<'DIA'|'HORA'|'RESUMEN'>('DIA');

  const generarReporteDiaContador =async (tipo: 'DIA'|'HORA'|'RESUMEN') => {
    setMostrarReporte(true);
    setMostrarTipoReporte(tipo);
    switch (tipo) {
        case 'DIA':
            if(!!reporteDia) return;
            try {
                const resCont = await contadorInstance?.get(`/reportes/dia/${mac}`);
                setReporteDia(resCont?.data);        
            } catch (error) {
                toast.error('No se pudo obtener el reporte de tráfico por día, porfavor reintente o contacte a soporte');
            }                    
            break;
        case 'HORA':
            if(!!reporteHora) return;
            try {
                const resCont = await contadorInstance?.get(`/reportes/hora/${mac}`);
                setReporteHora(resCont?.data);        
            } catch (error) {
                toast.error('No se pudo obtener el reporte de tráfico por hora, porfavor reintente o contacte a soporte');
            }        
        default:
            if(!!reporteResumen) return;
            try {
                const resCont = await contadorInstance?.get(`/reportes/${mac}`);
                setReporteResumen(resCont?.data);        
            } catch (error) {
                toast.error('No se pudo obtener el resumen del reporte de tráfico, porfavor reintente o contacte a soporte');
            }        
            break;
    }
  }
    
  return (
    <div>
      {mostrarReporte 
      ? <div className="border-2 border-gray-300 flex flex-col  space-x-3">
        <div className="font-bold p-2 bg-sky-400 rounded-md flex space-x-1">
            <h4 onClick={()=>generarReporteDiaContador('DIA')} className=" cursor-pointer hover:bg-sky-200 bg-gray-400 p-2 rounded-tr-xl">Reporte Diario de consumo de megas</h4>
            <h4 onClick={()=>generarReporteDiaContador('HORA')} className=" cursor-pointer hover:bg-sky-200 bg-gray-400 p-2 rounded-tr-xl">Reporte por Hora de consumo de megas</h4>
            <h4 onClick={()=>generarReporteDiaContador('RESUMEN')} className=" cursor-pointer hover:bg-sky-200 bg-gray-400 p-2 rounded-tr-xl">Resumen de consumo de megas</h4>
        </div>
        {mostrarTipoReporte !== 'RESUMEN' && <div className="grid grid-cols-3 p-2 w-[80%] font-bold">
            <p>Desde</p>
            <p>Hasta</p>
            <p>Consumo</p>
        </div>}
        {reporteDia?.length > 0 && mostrarTipoReporte === 'DIA' && reporteDia.map((rDia: RegistroContador) => <div key={rDia.Desde} 
        className="grid grid-cols-3 p-2 w-[80%]">
            <p>{dayjs(rDia.Desde).format('DD/MM/YYYY')}</p>
            <p>{dayjs(rDia.Hasta).format('DD/MM/YYYY')}</p>
            <p>{rDia.Megas.toFixed(2)}</p>
        </div>)}
        {reporteHora?.length > 0 && mostrarTipoReporte === 'HORA' && reporteHora.map((rHora: RegistroContador) => <div key={rHora.Desde} 
        className="grid grid-cols-3 p-2 w-[80%]">
            <p>{dayjs(rHora.Desde).format('DD/MM/YYYY')}</p>
            <p>{dayjs(rHora.Hasta).format('DD/MM/YYYY')}</p>
            <p>{rHora.Megas.toFixed(2)}</p>
        </div>)}
        {!!reporteResumen && mostrarTipoReporte === 'RESUMEN' && <div className='grid grid-cols-2 w-[80%]'>
            {/*JSON.stringify(reporteResumen)*/}
            <p>Consumo Regular contabilizados de tu saldo de megas = </p><p>{reporteResumen.consumoTotalRegularMB.toFixed(2)} MB</p>
            <p>Consumo en horario nocturno: Bono Ilimitado = </p><p>{reporteResumen.consumoTotalBonoMB.toFixed(2)} MB</p>
            <p>Consumo no contabilizado de tu saldo de megas con velocidad limitada = </p><p>{reporteResumen.consumoTotalReducidoMB.toFixed(2)} MB</p>
        </div>}
 
        </div>
        : <Button title='Generar reporte de tráfico' titleConfirm="Esto puede tomar algo de tiempo" onClick={() => generarReporteDiaContador('DIA')} className="bg-sky-600" />
      }
    </div>
  )
}