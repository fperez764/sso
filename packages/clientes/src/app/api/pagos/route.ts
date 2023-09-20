import { NextResponse } from 'next/server'
import createApiInstance, { pagosInstance } from '../route';



// Segun https://pagosenlinea.abe.bo/abefac/abefac-apidoc/#/Cliente/ClienteController_listarFacturas idCuenta es el nroDoc del cliente
export const listarFacturas = async (nroDocCliente: string) => {
  console.log('Buscar facturas de cliente ' + nroDocCliente);
  const pagosInstance = createApiInstance(process.env.PAGOS_URL, process.env.PAGOS_AUTH);
  console.log(pagosInstance);
  if(!pagosInstance) {
    console.error('No hay instancia de pagos');
    return;
  }
  //https://pagosenlinea.abe.bo/abefac/api/v1/facturas/108089
  const facturas = await pagosInstance?.get(`/facturas/${nroDocCliente || '108089'}`);
  return facturas?.data;
}

//pagarPeriodo(idServicio || idPeriodo) -> Genera CPT para pago
//pagar un año de servicio(idServicio || idPeriodo) -> Genera CPT para pago
//comprar paquete [1GB, 5GB, 10GB](idServicio || idPeriodo) -> Genera CPT para pago
//Prestarse 1GB(idServicio || idPeriodo) -> Registra prestame en Base de Datos

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  console.log(request);
  const id = searchParams.get('id')
  const res = await fetch(`${process.env.PAGOS_URL}${id}`, {
    next: { revalidate: 6 },
    headers: {
      'Content-Type': 'application/json',
      'API-Key': process.env.PAGOS_AUTH,
    },
  })
  const facturas = await res.json()
 
  return NextResponse.json({ product: facturas })
}