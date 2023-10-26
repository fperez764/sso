import axios from 'axios';

export default function createApiInstance(baseUrl: string | undefined, bearer: string | undefined) {
    if(!baseUrl || !bearer){ 
      console.error('Failed to create instance with:'+baseUrl + '/' + bearer);
      return;
    }
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

const pagosInstance = createApiInstance(process.env.NEXT_PUBLIC_PAGOS_URL, process.env.NEXT_PUBLIC_PAGOS_AUTH);
const ssoInstance = createApiInstance(process.env.NEXT_PUBLIC_SSO_URL, process.env.NEXT_PUBLIC_SSO_AUTH);
const contadorInstance = createApiInstance(process.env.NEXT_PUBLIC_CONTADOR_URL, process.env.NEXT_PUBLIC_CONTADOR_AUTH);

export const getCliente = async(nroDoc: string) => {
  if(!nroDoc || nroDoc === '') {console.error('getCliente: nroDoc invalido: ' + nroDoc); return;}
  if(!ssoInstance) {console.error('getCliente: No hay instancia de SSO'); return;}
  const res = await ssoInstance.get(`/clientes/${nroDoc}`);
  return res.data;
}

