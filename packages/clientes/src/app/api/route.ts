import axios from 'axios';

export default function createApiInstance(baseUrl: string | undefined, bearer: string | undefined) {
    if(!baseUrl || !bearer){ 
      console.error('Failed to create instance with:'+baseUrl + '/' + bearer);
      return;
    }
    console.info('createApiInstance: ' + baseUrl + '/' + bearer);
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

export const contadorInstance = createApiInstance(process.env.NEXT_PUBLIC_CONTADOR_URL, process.env.NEXT_PUBLIC_CONTADOR_AUTH);
export const pagosInstance = createApiInstance(process.env.NEXT_PUBLIC_PAGOS_URL, process.env.NEXT_PUBLIC_PAGOS_AUTH);
export const ssoInstance = createApiInstance(process.env.NEXT_PUBLIC_SSO_URL, process.env.NEXT_PUBLIC_SSO_AUTH);