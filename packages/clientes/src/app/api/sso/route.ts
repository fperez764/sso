import { NextResponse } from 'next/server'
import { ssoInstance } from '../route'
 
//get Servicio -> Modems -> Paquetes -> Megas
// get Estado de pagos -> Servicio/Periodo;Fecha Aniversario
export async function GET() {
  return NextResponse.json({ message: ssoInstance ? process.env.SSO_URL: 'SSO ABE no disponible' })
}