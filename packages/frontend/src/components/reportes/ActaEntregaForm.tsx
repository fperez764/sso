'use client';
import { ClienteServicioEquipo, ClienteServicioTicket, equipo_estado_enum, equipo_tipo_enum } from '@types/typesSSO';
import React, { useEffect, useRef, useState } from 'react'
import InputB from '../ui/InputB';
import DatePicker from 'react-datepicker';
import Input from '../ui/Input';
import Image from 'next/image';
import { OnlyDayMonth, downloadPDF } from '@src/utils/common';
import dayjs from 'dayjs';
import Button from '../ui/Button';
import { PlusIcon } from '@heroicons/react/24/outline';
import ComboBox from '../ui/ComboBox';
import { XCircleIcon } from 'lucide-react';
import SimpleSearchBar from '../ui/SimpleSearchBar';
import Link from 'next/link';

interface Props {
    ticket: ClienteServicioTicket
    handleFeederRefresh: () => void
}

const ActaEntregaForm = ({ ticket, handleFeederRefresh } : Props) => {
if(!ticket || !ticket.ordenMantenimiento) return <h2 className='my-6 font-bold text-center w-80'>Ticket sin ORDEN DE MANTENIMIENTO Generar ODM primero</h2>;
const [instalador, setInstalador] = useState(ticket.ordenMantenimiento.nombreInstalador || '');
const [equipos, setEquipos] = useState<Partial<ClienteServicioEquipo>[]>(ticket?.ordenMantenimiento?.actaEntrega?.equipos || []);
const [edit, setEditar] = useState(!ticket?.ordenMantenimiento?.actaEntrega);
const [tipoPorBuscar, setTipoPorBuscar] = useState(equipo_tipo_enum.MODEM);
const [obs, setObs] = useState(ticket?.ordenMantenimiento?.actaEntrega?.observaciones || '');

useEffect(() => {
    setInstalador(ticket.ordenMantenimiento?.nombreInstalador || '');
    setEquipos(ticket.ordenMantenimiento?.actaEntrega?.equipos || []);
    setObs(ticket.ordenMantenimiento?.actaEntrega?.observaciones || '');
}, [ticket]);

const agregarEquipo = (equipo: ClienteServicioEquipo|null) => {
    setEquipos([...equipos, 
        {
            tipo: equipo?.tipo || '',
            marca: equipo?.marca || '',
            modelo: equipo?.modelo || '',
            serial: equipo?.serial || '',
            mac: equipo?.mac || '',
            estado: equipo_estado_enum.NUEVO,
            observaciones: ''
        }]);
}

//{/*w-[612px] h-[791px]*/}
const content = <div className='px-8 py-12 bg-white pdf-content' id='pdf-content'> 
    <div className='flex flex-col space-y-2 bg-sky-200'>

        <div className="flex items-center justify-around bg-white border-2 border-black">
            <Image width="120" height="70" src="/images/logo.png" alt="ABE Logo" />
            <h1 className="font-bold text-center uppercase">Acta de Entrega de Equipos</h1>
        </div>
        <div className="flex flex-col p-2 space-y-4 bg-white border-2 border-black">
            <div className="grid grid-cols-5 gap-0 text-center border-2 border-black divide-x divide-y divide-black">
                <p className='bg-gray-300'>LUGAR</p>
                <p className='col-span-2'>{ticket.ordenMantenimiento?.lugarRecojo}</p>
                <p className='bg-gray-300'>FECHA</p>
                <p>{dayjs(new Date()).format(OnlyDayMonth)}</p>
                <p className='bg-gray-300'>CLIENTE</p>
                <p className='col-span-2'>{ticket.clienteServicio.cliente.razonSocial}</p>
                <p className='bg-gray-300'>NIT</p>
                <p>{ticket.clienteServicio?.cliente?.nroDocumentoFacturacion}</p>
            </div>
            <div className="flex items-center">
                <h2 className='w-1/2'><span className='font-bold'>DESCRIPCIÓN:</span><br/>{ticket.descripcion}</h2>
                <div className="flex flex-col font-bold">
                    <p>Ticket {ticket.id} - ODM No. {ticket.ordenMantenimiento.id}-2023</p>                
                    <p>RSS: {ticket.ordenMantenimiento.detalles}</p>                
                    <p>Fecha asignación <span className='font-medium'>{(ticket ? new Date(ticket.fechaCreacion) : new Date()).toLocaleString('es')}</span></p>
                </div>
            </div>
            <div className="flex items-center justify-center mb-2 space-x-4">
            <p className='font-bold'>EMPRESA INSTALADORA:</p>
            {ticket ? <p className='text-xl'>{instalador}</p> : <InputB placeholder='Instalador' type='string' value={instalador} handleChange={setInstalador}/>}
            </div>
        </div>
        <div className="flex flex-col p-2 text-xs bg-white border-2 border-black">
            <h4 className='mb-2 text-lg font-bold text-center uppercase'>Detalle de Equipos</h4>
            <p className='w-full font-bold text-center'>{edit ? 'Instalaciones solicita e' : 'E'}quipos: {ticket.ordenMantenimiento.equipos}</p>
            {edit && <div className="flex items-center justify-center space-x-3">
              <p className='w-full mt-6 font-bold text-md'>Buscar desde BD</p>
              <ComboBox value={tipoPorBuscar} options={Object.values(equipo_tipo_enum)} postName='Tipo' setData={setTipoPorBuscar} className='w-32'/>
              <SimpleSearchBar searchKey='serial' postName="Equipo" setData={(equipo: ClienteServicioEquipo)=> agregarEquipo(equipo)}
              searchEndpoint={`/clienteServicios/equipos/${tipoPorBuscar}?serial`} viewProperty='mac'/>
            </div>}
            <div className='grid grid-cols-8 my-6 text-center divide-x divide-y divide-black'>              
                <p className='font-bold bg-gray-300'>TIPO</p>
                <p className='font-bold bg-gray-300'>MARCA</p>
                <p className='font-bold bg-gray-300'>MODELO</p>
                <p className='col-span-2 font-bold bg-gray-300'>No. SERIE/MAC</p>
                <p className='font-bold bg-gray-300'>ESTADO</p>
                <p className='col-span-2 font-bold bg-gray-300'>OBSERV.</p>
            {equipos.map((equipo, i) => <>
                {(edit && !equipo.id) 
                  ? <InputB placeholder='Tipo' type='text' value={equipos[i].tipo}
                      handleChange={(e: string) => {equipos[i].tipo = e; setEquipos([...equipos]);}} />
                  :<p>{equipo.tipo}</p>}

                {(edit && !equipo.id) ? <InputB placeholder='Marca' type='text' value={equipos[i].marca}
                      handleChange={(e: string) => {equipos[i].marca = e; setEquipos([...equipos]);}} />
                :<p>{equipo.marca}</p>}

                {(edit && !equipo.id) ? <InputB placeholder='Modelo' type='text' value={equipos[i].modelo}
                      handleChange={(e: string) => {equipos[i].modelo = e; setEquipos([...equipos]);}} />
                :<p>{equipo.modelo}</p>}
                {(edit && !equipo.id) ? <InputB className='col-span-2 text-center' placeholder='Serial/Mac' type='text' value={`${equipos[i].serial}/${equipos[i].mac}`} 
                      handleChange={(e: string) => {equipos[i].serial = e.split('/')[0]; equipos[i].mac = e.split('/')[1]; setEquipos([...equipos]);}} />
                :
                <div className="flex flex-col col-span-2"><p>{equipo.serial}</p><p>{equipo.mac}</p></div>}
                
                {edit ? <ComboBox options={Object.values(equipo_estado_enum)} postName='Estado' className='h-12'
                    setData={(e: equipo_estado_enum) => {equipos[i].estado = e; setEquipos([...equipos]);}} />
                    : <p className=''>{equipo.estado}</p>}
                
                {edit 
                  ? <div className='flex col-span-2 pt-2'>
                    <InputB placeholder='Observaciones' type='text' value={equipos[i].observaciones}
                      handleChange={(e: string) => {equipos[i].observaciones = e; setEquipos([...equipos]);}} /> 
                    <XCircleIcon className='w-8 h-8 text-xl text-red-500' 
                      onClick={()=>{setEquipos([...equipos.filter(e => e.serial !== equipos[i].serial)]);}}  
                    />
                  </div>
                  : <p className=''>{equipo.observaciones}</p>}
            </>
            )}
            </div>
            {edit && <Button Icon={PlusIcon} title='Agregar Equipos Manualmente' onClick={() => agregarEquipo(null)}/>}
            {edit ? <InputB placeholder='Observaciones' type='text' value={obs} handleChange={setObs}/> : <p>Observaciones: {obs}</p>}
        </div>
        {!edit && <ul className="flex flex-col p-2 space-y-1 bg-white border-2 border-black">
            <li>El cliente ha verificado el funcionamiento correcto de los equipos. Asimismo, se compromete a tomar las medidas necesarias de protección para evitar cualquier tipo de daño a los equipos.</li>
            <li>En señal de conformidad, se firmara al pie del presente documento.</li>
            <div className='flex justify-between px-2 py-12 text-sm font-bold'>
                <p className='w-1/4 text-center border-t-2 border-black'>ALMACENES ABE</p>
                <div className="flex flex-col w-1/4">
                    <p className='text-center border-t-2 border-black'>EMPRESA INSTALADORA</p>
                    <p>Nombre:</p>
                    <p>C.I.:</p>
                    <p>EMPRESA:</p>
                </div>
                <div className="flex flex-col w-1/4">
                    <p className='text-center border-t-2 border-black'>CLIENTE</p>
                    <p>Nombre:</p>
                    <p>C.I.:</p>
                </div>
            </div>
        </ul>}
    </div>
</div>;

    if(!ticket.ordenMantenimiento) return <p className='text-xl font-bold'>No se puede generar acta de entrega sin orden de mantenimiento. Solicite al area de instalaciones generar este documento primero.</p>
  
  return (ticket.ordenMantenimiento.actaEntrega && !edit) ?
  <>
    {content}
    <div className="flex">
        <Link href={`/ade/${ticket.id}`} target='_blank'>
          <Button title='Descargar PDF' onClick={() => downloadPDF('pdf-content', `ticket-${ticket.id}-odm.pdf`)} className='mt-4'/>
        </Link>
        <Button title='Editar Orden de Mantenimiento' onClick={() => setEditar(true)} className='mt-4'/>
    </div>
  </>
  : <Input className='flex flex-col w-[100vh] h-[80vh] overflow-x-auto bg-white'
    postName='Acta de Entrega de Equipos'
    handleClean={()=>{}}
    handleRefresh={()=>{setEditar(false)}}
    getBody={() => { 
        return { observaciones: obs, equipos: equipos };
    }}
    endpoint={`tickets/${ticket.id}/actaEntrega`}
    editar={!!ticket.ordenMantenimiento.actaEntrega}
    >
        {content}
    </Input>;
};

export default ActaEntregaForm;