'use client';
import React, { useState } from 'react'
import Button from '../ui/Button'
import { DocumentTextIcon } from '@heroicons/react/24/outline'
import ToastCard from '../ui/ToastCard';
import InputB from '../ui/InputB';
import { ClienteServicioTicket, users_area_enum } from '@types/typesSSO';
import toast from 'react-hot-toast';
import ComboBox from '../ui/ComboBox';
import { CheckIcon, PencilIcon } from 'lucide-react';
import OrdenMantenimientoForm from './OrdenMantenimientoForm';
import ActaEntregaForm from './ActaEntregaForm';

interface Props {
    ticket: ClienteServicioTicket
    areaSeleccionada: string
}
//TODO: Interface for each action.AREA/DEPARTMENT ex: instalaciones-> OrdenMantto; Activos-> ActaEntrega; ATENCION_CLIENTE->ClasificarTicket
const AccionesEspeciales = ({ ticket, areaSeleccionada }: Props) => {
    const [mostrar, setMostrar] = useState(false);
    const [tipoTicket, setTipoTicket] = useState('RECLAMO');

    return <div className='w-full'>
            {
            areaSeleccionada === users_area_enum.INSTALACIONES 
            ? (mostrar ? <OrdenMantenimientoForm ticket={ticket} /> : <Button title={(ticket.ordenMantenimiento ? 'Ver ': 'Generar') + ' ORDEN DE MANTENIMIENTO'}  Icon={DocumentTextIcon} onClick={()=> setMostrar(true)} />)
            : areaSeleccionada === users_area_enum.ALMACENES 
                ? (mostrar ? <ActaEntregaForm odm={ticket}/> : <Button title='Generar ACTA DE ENTREGA'  Icon={DocumentTextIcon} onClick={()=> setMostrar(true)} />)
                : !ticket.porResponder && areaSeleccionada === users_area_enum.ATENCION_CLIENTE 
                    ? <ComboBox options={['RECLAMO', 'MANTENIMIENTO', 'OTRO']} postName='Clasificar el ticket como' setData={setTipoTicket}/> 
                    : null
        }
    </div>;
};

export default AccionesEspeciales;
