import axios from 'axios';
import React, { Suspense, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import ClienteWidget from '@src/components/cliente/ClienteWidget';
import { Cliente } from '@types/typesSSO';
import Loading from '@src/components/ui/Loading';

interface pageProps {
  params: {id: string}
}

const getCliente = async (id: string): Promise<Cliente> => {
  const res = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/clientes/' + id)
  return res.data
}

const ClientePage = async ({params}: pageProps) => {
  const cliente = await getCliente(params.id);
  return (
    <Suspense fallback={<>Cargando datos del cliente...<Loading /></>}><div>
      {cliente && <ClienteWidget cliente = {cliente}/>}
    </div></Suspense>
  );
}

export default ClientePage;
