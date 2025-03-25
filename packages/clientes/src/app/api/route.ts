"use server";
import { PaqueteContador } from '@/types/typesSSO';
import { Cliente } from '@/types/typesTickets';
import axios from 'axios';
import { useEffect } from 'react';

function createApiInstance(baseUrl: string | undefined, bearer: string | undefined) {
    if(!baseUrl || !bearer){ 
      console.error('Failed to create instance with:'+baseUrl + '/' + bearer);
      return;
    }
    console.log('Creating instance with:'+baseUrl);
    const instance = axios.create({
      baseURL: baseUrl,
    });

  // Add interceptors to modify requests and responses
  instance.interceptors.request.use(config => {
    // Add Basic Authentication header
    config.headers.Authorization = bearer;
    return config;
  });
  instance.interceptors.response.use(response => {
    // Modify response data
    return response;
  }, error => {
    // Handle errors
    return Promise.reject(error);
  });

  return instance;
}

const contadorInstance = createApiInstance(process.env.CONTADOR_URL, process.env.CONTADOR_AUTH);
const pagosInstance = createApiInstance(process.env.PAGOS_URL, process.env.PAGOS_AUTH);
const ssoInstance = createApiInstance(process.env.SSO_URL, process.env.SSO_AUTH);

export const getClientes = async (nroDoc: string): Promise<Cliente> => {
  if(!nroDoc || nroDoc === '') throw new Error('Nro de documento es requerido');
  if(!ssoInstance) throw new Error('No hay instancia de SSO');
  const res = await ssoInstance.get(`/clientes/${nroDoc}`);
  console.log(process.env.SSO_URL + `/clientes/${nroDoc}`);
  const {finalizado, mensaje, datos} = res.data;
  if(!datos){ console.error('getClientes' + JSON.stringify(res)); throw new Error('Usuario no encontrado');}
  console.info(`Cliente ${nroDoc} encontrado: ${mensaje}`);
  return datos;
}

export const getPeriodosCliente = async (idPlan: string) => {
  if(!idPlan) throw new Error('No se encontro el id del plan.');
  if(!ssoInstance) throw new Error('No hay instancia de SSO');
  //http://192.168.238.54:3000/api/cliente-planes/1/periodosPagable
  const res = await ssoInstance.get(`/cliente-planes/${idPlan}/periodosPagable`);
  if(!res?.data?.datos) throw new Error('Algo salio mal. Porfavor contacte a soporte');
  return res.data.datos;
}

export const getPaquetesCliente = async (idClientePlan: string) => {
  if(!idClientePlan) throw new Error('No se encontro el id del plan.');
  if(!ssoInstance) throw new Error('No hay instancia de SSO');
  //http://192.168.238.54:3000/api/periodos/megasAdicionales?idClientePlan=1
  const res = await ssoInstance.get(`/periodos/megasAdicionales?idClientePlan=${idClientePlan}`);
  console.log(process.env.SSO_URL + `/periodos/megasAdicionales?idClientePlan=${idClientePlan}`);
  const {finalizado, mensaje, datos} = res.data;
  if(!datos){ console.error('getPaquetes' + JSON.stringify(res)); throw new Error('Cliente sin paquetes');}
  return datos;
}


export const getPaquetesPlan = async (idPlan: string) => {
  if(!idPlan) throw new Error('No se encontro el id del plan.');
  if(!ssoInstance) throw new Error('No hay instancia de SSO');
  //http://192.168.238.54:3000/api/servicios/5/planes?tipo=MEGA_ADICIONAL
  const res = await ssoInstance.get(`/servicios/${idPlan || '5'}/planes?tipo=MEGA_ADICIONAL`);
  console.log(process.env.SSO_URL + `/servicios/${idPlan || '5'}/planes?tipo=MEGA_ADICIONAL`);
  const {finalizado, mensaje, datos} = res.data;
  if(!datos){ console.error('getPaquetesPlan' + mensaje); throw new Error('Plan sin paquetes');}
  return res.data.datos;  
}

export const getCPT = async (body: any, url: string) => {
  if(!url) throw new Error('No se especifico la url (paquetes o periodos).');
  if(!ssoInstance) throw new Error('No hay instancia SSO');
  console.log(process.env.SSO_URL + url, body);
  const res = await ssoInstance.post(url, body);
  const {finalizado, mensaje, datos} = res.data;
  console.info('--getCPT---', mensaje);
  console.info('--getCPT--->', datos);
  if(!datos) throw new Error('Algo salio mal. Porfavor contacte a soporte');
  
  return datos;
}

export const getPaquetesContador = async (mac: string): Promise<PaqueteContador[]> => {
  if(!contadorInstance) throw new Error('No hay instancia del Contador');
  console.debug(process.env.CONTADOR_URL + `/paquetes/${mac}`);
  const res = await contadorInstance.get(`/paquetes/${mac}`);
  const {message, data} = res.data;
  console.log('getPaquetesContador ----- ', data);
  console.debug('getPaquetesContador', message);
  if(!data) throw new Error('Algo salio mal. Porfavor contacte a soporte');
  return data;
}

export const getReporte = async (mac: string, fechaInicio: Date, fechaFin: Date) => {
  if(!contadorInstance) throw new Error('No hay instancia del Contador');
  console.debug(process.env.CONTADOR_URL + `/reportes/dia/${mac}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  const res = await contadorInstance.get(`/reportes/${mac}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  return res.data;
}

export const getReporteDia = async (mac: string, fechaInicio: Date, fechaFin: Date) => {
  if(!contadorInstance) throw new Error('No hay instancia del Contador');
  console.debug(process.env.CONTADOR_URL + `/reportes/dia/${mac}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  const res = await contadorInstance.get(`/reportes/dia/${mac}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  return res.data;
}

export const getReporteHora = async (mac: string, fechaInicio: Date, fechaFin: Date) => {
  if(!contadorInstance) throw new Error('No hay instancia del Contador');
  console.debug(process.env.CONTADOR_URL + `/reportes/dia/${mac}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  const res = await contadorInstance.get(`/reportes/dia/${mac}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  return res.data;
}


// Segun https://pagosenlinea.abe.bo/abefac/abefac-apidoc/#/Cliente/ClienteController_listarFacturas idCuenta es el nroDoc del cliente
export const listarFacturas = async (nroDoc: string) => {
  console.log(`[listarFacturas] nroDoc: ${nroDoc}`);
  if(!nroDoc || nroDoc === '') throw new Error('Nro de documento es requerido');
  if(!pagosInstance) throw new Error('No hay instancia de Pagos');
  if(!ssoInstance) throw new Error('No hay instancia de SSO');
  const clientes = await ssoInstance?.get(`/clientes/${nroDoc}/simple`);
  const idCLiente = clientes?.data?.datos?.id;
  console.log('CLIENTES ------>> ', clientes?.data?.datos);
  //https://pagosenlinea.abe.bo/abefac/api/v1/facturas/108089
  //https://oss.abe.bo/ws/api/abefac/clientes/1/facturas
  const res = await pagosInstance?.get(`/clientes/${idCLiente}/facturas`);
  const {finalizado, mensaje, datos} = res.data;
  console.info('post', mensaje);
  console.log('------ ', datos);
  if(!datos) throw new Error('Algo salio mal. Porfavor contacte a soporte');   
  return datos;
}
