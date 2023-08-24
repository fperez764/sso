import { ClienteServicioModem } from '../../../types/typesSSO';
import ModemViewWidget from './ModemViewWidget';

interface Props {
    modems: ClienteServicioModem[];
}

export default function ModemsWidget({ modems }: Props) {
    if(!modems || modems.length < 1){
        return <p>Servicio sin modems asignados</p>
    }
  return (
    <div>
        <h4 className='text-lg font-bold'>{modems.length > 0 ? modems.length + ' Modem(s) asignados' : 'No tiene modems asignados'}</h4>
        {modems?.length > 0 ? (
            <ol className='overflow-y-scroll'>
                {modems.filter(modem => !modem.fechaBaja).map((modem) => (
                    <li className='w-full border-2 border-gray-400' key={modem.mac}>
                        <ModemViewWidget modem={modem}/>
                    </li>
                ))}
            </ol>
        ) : null}     
    </div>
  )
}
