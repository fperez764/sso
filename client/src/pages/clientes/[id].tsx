import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Cliente } from '../../../types/typesSSO';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import logger from '../../utils/logger';


function ClientePage(idCliente : string) {
  const [cliente, setCliente] = useState<Cliente|null>(null);
  const getCliente = async () => {
    const tGetClientes = toast.loading('Obtener clientes');
    let clientesRes = [];
    try {
        const res = await axios.get(`/cliente/${idCliente}`);
        logger.debug(JSON.stringify(res));
        clientesRes = res.data;
        toast.success(`Se encontraron ${res.data.length} registros.`, { id: tGetClientes });
    } catch (e) {
        logger.error('Error al cargar clientes' + e);
        return { clientes: { error:'No se pudieron recuperar clientes desde BD' } };	
    }
    setCliente(clientesRes);
};
  useEffect(()=>{
    getCliente();       
  }, []);

  return (
    <div>
        {cliente && <ClienteWidget cliente = {cliente}/>}
    </div>
  );
}

export default ClientePage;
