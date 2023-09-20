import { NextResponse } from 'next/server'
import { contadorInstance } from '../route'

const getReporte = async (mac: number, fechaInicio: Date, fechaFin: Date) => {
  if(!contadorInstance) return;
  contadorInstance.get(`/trafico?mac=${mac}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
}

export async function GET() {
  return NextResponse.json({ message: contadorInstance ? process.env.CONTADOR_URL: 'Contador ABE no disponible' })

}