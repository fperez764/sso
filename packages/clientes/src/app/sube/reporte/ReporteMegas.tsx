"use client";
import { ClientePlan, Paquete, PaqueteContador } from "../../../types/typesSSO";
import Link from "next/link";
import { getPaquetesCliente, getPaquetesContador } from "@/app/api/route";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import ReporteContador from "./ReporteContador";

interface Props {
  mac: string
}

export default function ReporteMegas({ mac }: Props) {
  const [paquetes, setPaquetes] = useState<PaqueteContador[]>()
  const [sumaSaldo, setSumaSaldo] = useState(0);
  const [sumaTotal, setSumaTotal] = useState(0);

  const cargarPaquetes = async (mac: string) => {
    try {
      if(!mac) {toast.error('Plan no relacionado a una MAC. Por favor contacte a soporte.')}
      const res = await getPaquetesContador(mac);
      setPaquetes(res);
      if(res.length > 0){
        setSumaSaldo(res.reduce((a: number, b) => a + ((b.mb_asignados - b.mb_consumidos) || 0), 0));
        setSumaTotal(res.reduce((a: number, b) => a + (b.mb_asignados || 0), 0));
      }
    
    } catch (error) {
      console.error(error);
      setPaquetes([]);
    }
  }
  
  useEffect(() => {
    cargarPaquetes(mac);    
  }, [mac]);

  if(!paquetes || paquetes.length === 0) return <Link className='font-bold cursor-pointer underline hover:text-sky-500' href="pagos">
    Plan sin paquetes activos. Puede comprar paquetes de megas aca.
    </Link>

  return (
    <div className="flex p-6 flex-col">
      <p>Saldo Vigente (Megas) para el Modem {mac}</p>
      <h2 className="font-bold text-2xl">Estamos trabajando en la consulta de tu consumo.<br/>Esto no afecta a la calidad del servicio ni el saldo de tus megas.<br/>Gracias por tu paciencia, pronto estaremos de vuelta!</h2>
      {/* <p>Saldo Vigente (Megas) para el Modem {mac}</p>
      {}
      {paquetes?.length > 0 && <div className="border-2 border-gray-300 bg-gradient-to-r flex items-center from-sky-600 to-white rounded-md h-8  my-3">
        <p className="text-center w-full font-bold">{sumaSaldo}/{sumaTotal} MB</p>
      </div>}
      {paquetes?.length > 0 && paquetes?.map(paquete => 
      <div className="flex items-center space-x-3 justify-center" key={paquete.id}>
        <p className="font-bold w-40">{paquete.tipo_contabilizado}</p>
        <p className="font-bold w-40">{paquete?.extra?.descripcion}</p>
        <div  className="border-2 w-64 border-gray-300 bg-gradient-to-r flex items-center from-sky-600 to-white rounded-md h-8 my-4">
          <p className="text-center w-full font-bold">
            {paquete?.mb_asignados - paquete.mb_consumidos}/{paquete?.mb_asignados} MB
          </p>
        </div>
      </div>)} */}
      {/*paquetes.length > 0 && <ReporteContador mac={mac} desde={paquetes[0].fecha_inicio} hasta={paquetes[0].fecha_fin}/>*/}
    </div>
  );
}
