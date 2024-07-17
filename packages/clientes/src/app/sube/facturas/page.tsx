'use client';
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAuthState } from "@/context/auth";
import { Factura } from "@/types/typesABEFAC";
import { listarFacturas } from "@/app/api/route";

function ReporteFacturas() {
  const [listFacturas, setListFacturas] = useState<Factura[]>([]);  
  const { user } = useAuthState();
  console.log(' ======= ', user)
  const updateFacturas = async()=>{
    if(!user?.numeroDocumento) {toast.error('No se pudo actualizar el reporte de facturas'); return;}
    try {
      const facturasRes = await listarFacturas(user?.persona?.nroDocumento);
      toast.success(`Se encontraron ${facturasRes?.length} facturas para ${user?.persona?.nroDocumento}`);
      setListFacturas(facturasRes);        
    } catch (error) {
      console.error(error);
      toast.error(`Algo salio mal al actualizar el reporte de facturas para ${user?.persona?.nroDocumento}`);
    }
  }

  useEffect(() => {
    updateFacturas();
  },[user])

  return (
    <>
      <div className="flex p-6 space-x-4">
        <h1 className="font-bold my-4">Facturas Electrónicas: {listFacturas.length}</h1>
        <Button Icon={ArrowPathIcon} title='Actualizar' onClick={updateFacturas} />
      </div>
      <div className="grid grid-cols-5 divide-x divide-gray-400 divide-y border-2 border-gray-400 font-bold text-center rounded-md">
        <p>Descargar</p>
        <p>Número</p>
        <p>Fecha Emisión</p>
        <p>Importe</p>
      </div>
      {listFacturas.length > 0 
      ? listFacturas.map(factura => <div key={factura.id}
      className="grid grid-cols-5 divide-x divide-gray-400 divide-y text-center rounded-md">
        <p className="space-x-4">
          {factura.urlPdf && <Link href={factura.urlPdf} className='cursor-pointer hover:text-sky-500 hover:underline'>PDF</Link>}
          {factura.urlXml && <Link href={factura.urlXml} className='cursor-pointer hover:underline hover:text-sky-500'>XML</Link>}
        </p>
        <p>{factura.numeroFactura}</p>
        <p>{new Date(factura.fechaEmision).toLocaleString('es')}</p>
        <p>Bs. {factura.montoTotal}</p>        
      </div>) 
      : <p>Cliente sin facturas</p>}
            <div className="grid grid-cols-5 border-2 border-gray-400 font-bold text-center rounded-md">
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
      </div>
    </>
  );
}

export default ReporteFacturas;
