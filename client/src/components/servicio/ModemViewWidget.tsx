import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuthState } from "../../context/auth";
import { useState } from "react";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import InputB from "../InputB";
import { ClienteServicioModem } from "../../../types/typesSSO";

interface DataModem {
    mac: string
    nombre: string
    descripcion: string
    plan: string
    estadoModem?: string
    estadoBloqueo: string
    managedgroup?: string
    subscriber?: string
    adminstate?: string
}

interface Props{
    modem:ClienteServicioModem
}

const ModemViewWidget = ({modem}: Props) => {
    const [dataModem, setDataModem] = useState<DataModem>();
    const { user } = useAuthState(); 
    const getInfoHub = async (mac: string) => {
        try {
            const res = await axios.get(`http://localhost:3000/api/modem/${mac}`);
            toast.success(res.data.message);
            setDataModem(res.data.data);                
        } catch (error: any) {
            toast.error(error.response?.data.message || 'Algo salio mal');
        }
      }
    
  return (<div className='flex mt-4 space-x-4'>
        <h4 className="">{modem.mac}</h4>
        {user && <ArrowRightCircleIcon className="w-6 h-6 cursor-pointer" onClick={() => getInfoHub(modem.mac)} />}
        {!!dataModem && <div className="overflow-x-scroll grow whitespace-nowrap">
            <InputB placeholder='Nombre' value={dataModem.nombre} disabled />
            <InputB placeholder='Descripcion' value={dataModem.descripcion} disabled />
            <InputB placeholder='Plan' value={dataModem.plan} disabled />
            <InputB placeholder='Estado' value={dataModem.estadoBloqueo ? 'Bloqueado' : 'Desbloqueado'} disabled/>
        </div>}
  </div>)
}

export default ModemViewWidget
