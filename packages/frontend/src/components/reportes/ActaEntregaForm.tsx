'use client';
import { ClienteServicioActaEntrega, ClienteServicioEquipo, ClienteServicioTicket, ClienteServicioTicketAccion, equipo_estado_enum, equipo_tipo_enum } from '@types/typesSSO';
import React, { useEffect, useState } from 'react'
import InputB from '../ui/InputB';
import Input from '../ui/Input';
import Image from 'next/image';
import { OnlyDayMonth } from '@src/utils/common';
import dayjs from 'dayjs';
import Button from '../ui/Button';
import { DocumentTextIcon, PencilIcon, PlusIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import ComboBox from '../ui/ComboBox';
import SimpleSearchBar from '../ui/SimpleSearchBar';
import Link from 'next/link';
import ADEView from './ADEView';
import toast from 'react-hot-toast';
import axios, { AxiosError } from 'axios';

interface Props {
    ade?: ClienteServicioActaEntrega
    ticket: ClienteServicioTicket
    accion: ClienteServicioTicketAccion
    handleFeederRefresh: () => void
}

const ActaEntregaForm = ({ ade, ticket, handleFeederRefresh, accion } : Props) => {
const [instalador, setInstalador] = useState(ticket.ordenMantenimiento?.nombreInstalador || ade?.nombreInstalador || '');
const [lugarRecojo, setLugarRecojo] = useState(ticket.ordenMantenimiento?.lugarRecojo || ade?.lugarRecojo || accion.area);
const [equipos, setEquipos] = useState<Partial<ClienteServicioEquipo>[]>(ade?.equipos || []);
const [edit, setEditar] = useState(!ade);
const [tipoPorBuscar, setTipoPorBuscar] = useState(equipo_tipo_enum.MODEM);
const [actaEntrega, setActaComoEntrega] = useState(ade ? ade.entrega : true);
const [obs, setObs] = useState(ade?.observaciones || '');

useEffect(() => {
    setInstalador(ade?.nombreInstalador || ticket.ordenMantenimiento?.nombreInstalador ||  '');
    setLugarRecojo(ade?.lugarRecojo || ticket.ordenMantenimiento?.lugarRecojo || accion.area);
    setEquipos(ade?.equipos || []);
    setObs(ade?.observaciones || '');
}, [ade]);

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
const content = <div className='py-12 bg-white pdf-content' id='pdf-content'> 
    <div className='flex flex-col space-y-2 bg-sky-200'>

        <div className="flex items-center justify-around bg-white border-2 border-black">
            <Image width="120" height="70" src="/images/logo.png" alt="ABE Logo" />
            <h1 className="font-bold text-center uppercase">Acta de {actaEntrega ? 'Entrega' : 'Devolución'} de Equipos Nro. {ade?.id || '#'}</h1>
        </div>
        <div className="flex flex-col p-2 space-y-4 bg-white border-2 border-black">
          <label>Devolución de equipos <input className='mx-3 ml-2' type='checkbox' defaultChecked={!actaEntrega} onChange={()=>setActaComoEntrega(!actaEntrega)}/></label>
          <div className="grid grid-cols-5 gap-0 text-center border-2 border-black divide-x divide-y divide-black">
              <p className='bg-gray-300'>LUGAR</p>
              {!ticket.ordenMantenimiento 
                ? <InputB placeholder='Lugar' type='string' value={lugarRecojo} handleChange={setLugarRecojo} className='h-12 col-span-2'/>
                : <p className='col-span-2'>{lugarRecojo}</p>}
              <p className='bg-gray-300'>FECHA</p>
              <p>{dayjs(new Date()).format(OnlyDayMonth)}</p>
              <p className='bg-gray-300'>CLIENTE</p>
              <p className='col-span-2'>{ticket?.clienteServicio?.cliente?.razonSocial || ''}</p>
              <p className='bg-gray-300'>NIT</p>
              <p>{ticket?.clienteServicio?.cliente?.nroDocumentoFacturacion || ''}</p>
          </div>
          <div className="flex items-center">
              <h2 className='w-1/2 font-bold'>TICKET NRO. {ticket?.id || '#'}</h2>
              <div className="flex flex-col font-bold">
                  <p>Fecha de entrega <span className='text-xs font-medium'>{(ade 
                      ? new Date(ade.fechaModificacion) 
                      : new Date()).toLocaleString('es')}</span></p>
              </div>
          </div>
          <h3>Descripcion Ticket: {ticket?.descripcion}</h3>
          <div className="flex items-center justify-center mb-2 space-x-4">
          <p className='font-bold'>EMPRESA INSTALADORA:</p>
          {ticket.ordenMantenimiento ? <p className='text-xl'>{instalador}</p> 
          : <InputB placeholder='Instalador' type='string' value={instalador} handleChange={setInstalador}/>}
          </div>
        </div>
        <div className="flex flex-col p-2 text-xs bg-white border-2 border-black">
            <h4 className='mb-2 text-lg font-bold text-center uppercase'>Detalle de Equipos</h4>
            {ticket.ordenMantenimiento && <p className='w-full font-bold text-center'>
                {'Instalaciones solicita equipos'}: {ticket.ordenMantenimiento.descripcionEquipos}
            </p>}
            <div className="flex items-center justify-center space-x-3">
              <p className='w-1/4 mt-6 font-bold text-md'>Buscar desde BD</p>
              <ComboBox value={tipoPorBuscar} options={Object.values(equipo_tipo_enum)} postName='Tipo' setData={setTipoPorBuscar} className='w-1/4'/>
              <SimpleSearchBar searchKey='serial' postName="Equipo" setData={(equipo: ClienteServicioEquipo)=> agregarEquipo(equipo)}
              searchEndpoint={`/clienteServicios/equipos/${tipoPorBuscar}?serial`} viewProperty='mac'/>
            </div>
            <div className='grid grid-cols-8 my-6 text-center divide-x divide-y divide-black'>              
                <p className='font-bold bg-gray-300'>TIPO</p>
                <p className='font-bold bg-gray-300'>MARCA</p>
                <p className='font-bold bg-gray-300'>MODELO</p>
                <p className='col-span-2 font-bold bg-gray-300'>No. SERIE/MAC</p>
                <p className='font-bold bg-gray-300'>ESTADO</p>
                <p className='col-span-2 font-bold bg-gray-300'>OBSERV.</p>
            {equipos.map((equipo, i) => <>
                {equipo.verificado
                  ? <p>{equipo.tipo}</p>
                  : <InputB placeholder='Tipo' type='text' value={equipos[i].tipo} 
                  handleChange={(e: string) => {equipos[i].tipo = e; setEquipos([...equipos]);}} />
                }
                {equipo.verificado
                  ? <p>{equipo.marca}</p>
                  : <InputB placeholder='Marca' type='text' value={equipos[i].marca}
                      handleChange={(e: string) => {equipos[i].marca = e; setEquipos([...equipos]);}} />
                }
                {equipo.verificado
                  ? <p>{equipo.modelo}</p>
                  : <InputB placeholder='Modelo' type='text' value={equipos[i].modelo}
                      handleChange={(e: string) => {equipos[i].modelo = e; setEquipos([...equipos]);}} />
                }
                <div className="flex flex-col col-span-2 text-center">
                {equipo.verificado
                  ? <>
                      <p>{equipo.serial}</p>
                      <p>{equipo.mac}</p>
                    </>
                  : <>
                  <InputB placeholder='Serial' type='text' value={equipos[i].serial} 
                    handleChange={(e: string) => {
                      equipos[i].serial = e; 
                      if(equipos[i].serial?.includes(' ')) {toast.error('Serial no puede tener espacios'); return;}
                      setEquipos([...equipos]);}} />
                  <InputB placeholder='Mac' type='text' value={equipos[i].mac} 
                    handleChange={(e: string) => {equipos[i].mac = e; setEquipos([...equipos]);}} />
                  </>}
                </div>
                
                <ComboBox value={equipos[i].estado} options={Object.values(equipo_estado_enum)} postName='Estado' className='h-12'
                    setData={(e: equipo_estado_enum) => {equipos[i].estado = e; setEquipos([...equipos]);}} />
                <div className='flex col-span-2 pt-2'>
                    <InputB placeholder='Observaciones' type='text' value={equipos[i].observaciones}
                      handleChange={(e: string) => {equipos[i].observaciones = e; setEquipos([...equipos]);}} /> 
                    <XCircleIcon className='w-8 h-8 text-xl text-red-500' 
                      onClick={()=>{setEquipos([...equipos.filter(e => e.serial !== equipos[i].serial)]);}}  
                    />
                </div> 
            </>)}
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

  
  return edit 
  ? <Input className='flex flex-col w-full h-[80vh] overflow-x-auto bg-white'
    postName={`Acta de ${actaEntrega ? 'Entrega' : 'Devolución'} de Equipos`}
    handleClean={()=>{}}
    handleRefresh={()=>{setEditar(false); handleFeederRefresh();}}
    getBody={() => { 
        if(!equipos || equipos.length === 0) {toast.error('No se puede crear una acta sin equipos'); return;}
        const uniqueEquipos = equipos.reduce((acc, current) => {
          if(!acc.find((e: ClienteServicioEquipo) => e.serial === current.serial)) acc.push(current);
          else(toast.error('Serial duplicado eliminado'));
          return acc;
        }, []);
        if(uniqueEquipos.length !== equipos.length) {        
          setEquipos([...uniqueEquipos]);
          return null;
        }
        if(equipos.find(e => e.tipo === '' || e.marca === '' || e.serial === '')) {
          toast.error('Los campos tipo, marca y serial son obligatorios');
          return null;
        }
        return { observaciones: obs, equipos: uniqueEquipos, nombreInstalador: instalador, lugarRecojo: lugarRecojo, entrega: actaEntrega };
    }}
    endpoint={!!ade 
        //Actualiza ADE
        ? `ticketsAcciones/actaEntrega/${ade.id}` : 
        //Crea ADE
        `ticketsAcciones/${accion.id}/actaEntrega`}
    editar={!!ade}
    >
        {content}
  </Input>
  : <>
    <ADEView ticket={ticket} ade={ade}/>
    {ade && <div className="flex">
      <Link href={`/tickets/acciones/${accion.id}/ade`} target='_blank'>
        <Button title='Descargar PDF' Icon={DocumentTextIcon} onClick={() => {}} className='mt-4'/>
      </Link>
      {!accion.fechaRespuesta && <Button Icon={PencilIcon} title={`Editar Acta de ${actaEntrega ? 'Entrega' : 'Devolución'}`} onClick={() => setEditar(true)} className='mt-4'/>}
      {!accion.fechaRespuesta && <Button Icon={TrashIcon} title={`Editar Acta de ${actaEntrega ? 'Entrega' : 'Devolución'}`} titleConfirm='Esta seguro de anular esta acta de movimiento de equipos?' className='mt-4'
        onClick={() => {
          axios.delete(`/ticketsAcciones/actaEntrega/${ade.id}`).then(() => {
            toast.success('Acta anulada');
            handleFeederRefresh();
          }).catch((error: AxiosError) => {
            toast.error('No se pudo anular el acta. \n' + error.response?.data);
            console.error(error);
          })

        }} />}
    </div>}
  </>
};

export default ActaEntregaForm;
