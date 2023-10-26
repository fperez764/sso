import { NextResponse } from 'next/server'
import { getClientes } from '../route'
 
//get Servicio -> Modems -> Paquetes -> Megas
// get Estado de pagos -> Servicio/Periodo;Fecha Aniversario
export async function GET() {
  return NextResponse.json({ status: process.env.SSO_URL || 'SSO ABE no disponible' })
}