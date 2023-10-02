'use client';
import React, { useState } from 'react'
import Button from '../ui/Button'
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { ClienteServicioTicket, users_area_enum } from '@types/typesSSO';
import OrdenMantenimientoForm from './OrdenMantenimientoForm';
import ActaEntregaForm from './ActaEntregaForm';

interface Props {
    ticket: ClienteServicioTicket
    areaSeleccionada: string
    handleFeederRefresh: () => void
}


//TODO: Interface for each action.AREA/DEPARTMENT ex: instalaciones-> OrdenMantto; Activos-> ActaEntrega; ATENCION_CLIENTE->ClasificarTicket
const AccionesEspeciales = ({ ticket, areaSeleccionada, handleFeederRefresh }: Props) => {
    const [mostrar, setMostrar] = useState(false);
    if(!ticket) return null;
    return <div className='w-full'>
            {
            areaSeleccionada === users_area_enum.INSTALACIONES 
            ? (mostrar ? <OrdenMantenimientoForm ticket={ticket} handleFeederRefresh={handleFeederRefresh}/> : <Button title={(ticket.ordenMantenimiento ? 'Ver ': 'Generar') + ' ORDEN DE MANTENIMIENTO'}  Icon={DocumentTextIcon} onClick={()=> setMostrar(true)} />)
            : areaSeleccionada === users_area_enum.ALMACENES 
                ? (mostrar ? <ActaEntregaForm ticket={ticket} handleFeederRefresh={handleFeederRefresh}/> : <Button title={(ticket.ordenMantenimiento?.actaEntrega ? 'Ver ': 'Generar') + ' ACTA DE ENTREGA'}  Icon={DocumentTextIcon} onClick={()=> setMostrar(true)} />)
                : null
        }
    </div>;
};

export default AccionesEspeciales;
