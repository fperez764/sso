'use client';
import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { listarFacturas } from "@/app/api/pagos/route";
import { pagosInstance } from "@/app/api/route";
import Link from "next/link";
import { useAuthState } from "@/context/auth";

const facturaExampl = {
  "finalizado": true,
  "mensaje": "Registro(s) obtenido(s) con exito!",
  "datos": [
    {
      "fechaCreacion": "2022-08-16T23:51:41.497Z",
      "id": "26a9bd8a-ceb9-463a-9b8c-4dc8e74ddcaa",
      "idOperacionPago": "108089",
      "sistema": "ABE",
      "montoTotal": "220.00",
      "pagado": true,
      "descripcion": "Compra de megas extra",
      "cuf": "C248030517A1CA71BB61C88DC2A2B12644A5781C86D25698C99B6D74",
      "numeroFactura": 3478,
      "urlPdf": "https://sufe.agetic.gob.bo/public/facturas_pdf/C248030517A1CA71BB61C88DC2A2B12644A5781C86D25698C99B6D74.pdf",
      "urlXml": "https://sufe.agetic.gob.bo/public/facturas_xml/C248030517A1CA71BB61C88DC2A2B12644A5781C86D25698C99B6D74.xml",
      "fechaEmision": "2022-08-16T23:53:22.000Z",
      "fechaAnulacion": "2022-08-17T18:07:32.000Z",
      "observacion": null,
      "estado": "ANULADO",
      "usuarioEmision": "PPTE",
      "usuarioAnulacion": "angelica.coca",
      "errorEnvio": null,
      "cliente": {
        "tipoDocumento": "CI",
        "nroDocumento": "7580108",
        "razonSocial": "MARIA FERNANDA SATTORI ROCA",
        "idCuenta": "2592"
      },
      "facturaDetalles": [
        {
          "codigo": "SER-00530",
          "descripcion": "Internet satelital SUBE - 10000 MB adicionales",
          "precioUnitario": "220.00",
          "cantidad": 1,
          "montoDescuento": "0.00"
        }
      ]
    }
  ]
}
function ReporteFacturas() {
  const [listFacturas, setListFacturas] = useState([]);  
  const { user } = useAuthState();
  const updateFacturas = async()=>{
    try {
      const facturasRes = await pagosInstance?.get(`/facturas/${user?.numeroDocumento}`);
      console.log(facturasRes);
      toast.success('Reporte de facturas actualizado ' + facturasRes?.data?.mensaje);
      setListFacturas(facturasRes?.data || facturaExampl);        
    } catch (error) {
      console.error(error);
      toast.error(`Algo salio mal al actualizar el reporte de facturas para ${user?.numeroDocumento}\n${error.message}`);
      setListFacturas(facturaExampl.datos);
    }
  }

  useEffect(() => {
    updateFacturas();
  },[])

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
        <p>Descripción</p>
        <p>Importe</p>
      </div>
      {listFacturas.length > 0 
      ? listFacturas.map(factura => <div key={factura.id}
      className="grid grid-cols-5 divide-x divide-gray-400 divide-y text-center rounded-md">
        <p className="space-x-4">
          <Link href={factura.urlPdf} className='cursor-pointer hover:text-sky-500 hover:underline'>PDF</Link>
          <Link href={factura.urlXml} className='cursor-pointer hover:underline hover:text-sky-500'>XML</Link>
        </p>
        <p>{factura.numeroFactura}</p>
        <p>{new Date(factura.fechaEmision).toLocaleString('es')}</p>
        <p>{factura.descripcion}</p>
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
