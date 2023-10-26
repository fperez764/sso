import { NextResponse } from 'next/server'

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
      'Authorization': process.env.PAGOS_AUTH || '', 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
  })
  const facturas = await res.json()
 
  return NextResponse.json({ product: facturas })
}