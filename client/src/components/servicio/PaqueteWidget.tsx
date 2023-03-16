import { Paquete, Roles } from '../../../types/typesSSO'
import { useState } from 'react'
import { CogIcon } from '@heroicons/react/24/outline';
import NuevoPaqueteWidget from './NuevoPaqueteWidget';
import { useAuthState } from '../../context/auth';

interface Props {
    paquete: Paquete,
}

function PaqueteWidget({paquete}: Props) {
    const { user } = useAuthState();
    const admin = user?.rol === Roles.ADMIN;
    
    const [mostrarMas, setMostrarMas] = useState(false);
    const [editarPaquete, setEditarPaquete] = useState(false);
    const css = 'justify-between rounded border-y border-x my-2 px-2 border-gray-500';


const editarPaqueteComponent = 
    <div className={css}>
        <NuevoPaqueteWidget paquete={paquete} handleCancelar={() => setEditarPaquete(false)}/>
    </div>
;

const paqueteComponent = 
    <div className={css + ' flex'} onClick={() => setMostrarMas(!mostrarMas)}>
        <div className="flex flex-col justify-center">
            <div className="flex space-x-1 text-lg">
                <h1>Paquete:</h1>
                <h2 className="font-bold">{paquete.nombre}</h2>
                <p className="text-sm pl-3 font-bold">{paquete.precio} Bs.</p>
            </div>
            <p>{paquete.descripcion}</p>
        </div>
        <div className="w-24 mr-2 text-sm">
            <h4 className="bg-green-300 rounded my-1">Regular: {paquete.mbRegular}</h4>
            <h4 className="bg-blue-200 rounded my-1">Bono: {paquete.mbBono}</h4>
            <h4 className="bg-orange-200 rounded my-1">Recargo: {paquete.mbRecargo}</h4>
        </div>
        {mostrarMas && admin && <div className='absolute right-5'>
            <CogIcon className='w-5 h-5' onClick={() => setEditarPaquete(true)}/>
        </div>}
    </div>
;

return (
editarPaquete 
    ? editarPaqueteComponent
    : paqueteComponent
)}

export default PaqueteWidget
