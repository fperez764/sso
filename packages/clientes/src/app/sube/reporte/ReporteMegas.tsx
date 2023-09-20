import toast from "react-hot-toast";
import { ClientePlan, Paquete } from "../../../types/typesSSO";
import { ssoInstance } from "@/app/api/route";
import Link from "next/link";

interface Props {
  clientePlan: ClientePlan
}

const cargarPaquetes = async (idClientePlan: number) : Promise<Paquete[]> => {
  try {
    if(!idClientePlan) return [];
    //http://192.168.238.54:3000/api/periodos/megasAdicionales?idClientePlan=1
    const res = await fetch(process.env.NEXT_PUBLIC_SSO_URL + `periodos/megasAdicionales?idClientePlan=${idClientePlan}`);
    const resPaquetes = await res.json();
    console.log('paquetes', resPaquetes);
    return resPaquetes?.datos;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ReporteMegas({ clientePlan }: Props) {
  const paquetes = await cargarPaquetes(clientePlan.id);
  if(paquetes.length === 0) return <Link className='font-bold cursor-pointer underline hover:text-sky-500' href="pagos">
    Plan sin paquetes activos. Puede comprar paquetes de megas aca.
    </Link>
  let sumaSaldo = 0;
  let sumaTotal = 0;
  if(paquetes.length > 0){
    sumaSaldo = paquetes.reduce((a, b) => a + parseInt(b.clientePlanPeriodoDetalles[0].extra.saldo.toString()), 0) || 0;
    sumaTotal = paquetes.reduce((a, b) => a + parseInt(b.clientePlanPeriodoDetalles[0].extra.cantidad.toString()), 0) || 0;
  }

  return (
    <div className="flex p-6 flex-col">
      <p>Saldo Vigente (Megas) para el Modem {clientePlan.mac}</p>
      {}
      {paquetes?.length > 0 && <div className="border-2 border-gray-300 bg-gradient-to-r flex items-center from-sky-600 to-white rounded-md h-8  my-3">
        <p className="text-center w-full font-bold">{sumaSaldo}/{sumaTotal} MB</p>
      </div>}
      {paquetes?.length > 0 && paquetes?.map(paquete => 
      <div className="flex items-center space-x-3 justify-center" key={paquete.id}>
        <p className="font-bold w-40">{paquete.tipo}</p>
        <div  className="border-2 w-64 border-gray-300 bg-gradient-to-r flex items-center from-sky-600 to-white rounded-md h-8 my-4">
          <p className="text-center w-full font-bold">
            {paquete.clientePlanPeriodoDetalles[0].extra.saldo}/{paquete.clientePlanPeriodoDetalles[0].extra.cantidad} MB
          </p>
        </div>
      </div>)}
    </div>
  );
}
