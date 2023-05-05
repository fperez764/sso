import { ClienteServicioModem } from '../../../types/typesSSO';
import ModemViewWidget from './ModemViewWidget';

interface Props {
    modems: ClienteServicioModem[];
}

export default function ModemsWidget({ modems }: Props) {
  return (
    <div>
        <h4 className="mb-2 text-lg font-bold">{modems.length > 0 ? modems.length + ' Modem(s) asignados' : 'No tiene modems asignados'}</h4>
        {modems?.length > 0 ? (
            <ol className="overflow-y-scroll">
                {modems.map((modem) => (
                    <li className="list-disc border-2 border-gray-400">
                        <ModemViewWidget modem={modem}/>
                    </li>
                ))}
            </ol>
        ) : null}     
    </div>
  )
}
