'use client';
import { ClienteServicioTicket } from '@types/typesSSO';
import React, { useState } from 'react'
import InputB from '../ui/InputB';
import DatePicker from 'react-datepicker';
import Input from '../ui/Input';
import Image from 'next/image';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { OnlyDayMonth } from '@src/utils/common';

interface Props {
    ticket: ClienteServicioTicket,
    handleFeederRefresh: () => void
}

const downloadPDF = async (querySelector: string, title: string) => {
    const tDown = toast.loading('Descargando PDF...');
    const capture = document.querySelector('.pdf-content');
    if(!capture) return toast.error('capture no encontrado', {id: tDown});
    const canvas = await html2canvas(capture);
    const imgData = canvas.toDataURL('image/png', 1.0);
    const doc = new jsPDF('p', 'mm', 'a4');
    const componentWidth = doc.internal.pageSize.getWidth();
    const componentHeight = doc.internal.pageSize.getHeight();
    doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
    doc.save(title+ '.pdf');
    toast.success('PDF descargado.', {id: tDown});
};

const OrdenMantenimientoForm = ({ ticket, handleFeederRefresh } : Props) => {
    if(!ticket) return <>Ticket no especificado</>;
const [instalador, setInstalador] = useState(ticket.ordenMantenimiento?.nombreInstalador || '');
const [descripcion, setDescripcion] = useState(ticket.ordenMantenimiento?.diagnostico || ticket.descripcion);
const [infoAdicional, setInfoAdicional] = useState(ticket.ordenMantenimiento?.detalles || 0);
const [equipos, setEquipos] = useState(ticket.ordenMantenimiento?.equipos || ('Kit completo para servicio ' + ticket.clienteServicio?.nombreServicio));
const [lugarRecojo, setLugarRecojo] = useState(ticket.ordenMantenimiento?.lugarRecojo || '');
const [horasViaje, setHorasViaje] = useState(ticket.ordenMantenimiento?.horasViaje || 0);
const [precio, setPrecio] = useState(ticket.ordenMantenimiento?.precioAcordado || 0);
const [diaVisita, setDiaVisita] = useState(new Date(ticket.ordenMantenimiento?.fechaVisitaProgramada || ticket.fechaModificacion));
const [edit, setEditar] = useState(!ticket.ordenMantenimiento);

const content =     <div className='bg-white px-6 py-12 pdf-content'><div className='bg-sky-200 flex flex-col space-y-2'>
<div className="flex items-center justify-around bg-white border-2 border-black">
    <Image width="120" height="70" src="/images/logo.png" alt="ABE Logo" />
    <h1 className="text-center font-bold uppercase">Orden de Mantenimiento</h1>
</div>
<div className="flex flex-col border-2 bg-white border-black space-y-2 pl-2">
    <div className="flex items-center">
        <h2 className='w-1/2'><span className='font-bold'>DESCRIPCIÓN:</span><br/>{ticket.descripcion}</h2>
        <div className="flex flex-col font-bold">
            <p>ODM-Ticket No. <span>{ticket.id}-2023</span></p>                
            <p>Fecha asignación <span>{dayjs(ticket.ordenMantenimiento?.fechaCreacion || new Date()).format(OnlyDayMonth)}</span></p>
        </div>
    </div>
    <div className="flex justify-around items-center py-4">
    <p className='font-bold'>EMPRESA INSTALADORA:</p>
    {!edit ? <p>{instalador}</p> : <InputB placeholder='Instalador' type='string' value={instalador} handleChange={setInstalador}/>}
    </div>
</div>
<div className="border-2 border-black bg-white">
    <h4 className='font-bold text-center uppercase my-2'>Características del Mantenimiento</h4>
    <div className="m-6 border-2 h-56 border-black grid grid-cols-2 divide-x divide-y divide-black text-start">
        <p className='font-bold'>Servicio</p><p className='text-center'> {ticket.clienteServicio.nombreServicio}</p>
        <p className='font-bold'>Ticket</p><p className='text-center'>No. {ticket.id}/{ticket.nombreFlujo}</p>
        <p className='font-bold'>Dirección</p><p className='text-center'> {ticket.direccion || 'No especificado'}</p>
        {/*<p className='font-bold'>Localidad o Propiedad</p><p className='text-center'> {ticket.direccion || 'No especificado'}</p>*/}
        <p className='font-bold'>Latitud</p><p className='text-center'> {ticket.coordenadas?.split(',')[0]}</p>
        <p className='font-bold'>Longitud</p><p className='text-center'> {ticket.coordenadas?.split(',')[1]}</p>
        <p className='font-bold'>Nombre Cliente</p><p className='text-center'> {ticket.nombreContacto || ticket.clienteServicio?.cliente?.contactos[0]?.nombreCompleto || 'No especificado'}</p>
        <p className='font-bold'>Telefono contacto</p><p className='text-center'> {ticket.telefonoContacto || ticket.clienteServicio?.cliente?.contactos[0]?.telefono || 'No especificado'}</p>
    </div>
</div>
<div className="border-2 border-black bg-white flex flex-col space-x-2 px-2 pb-4">
<h4 className='font-bold text-center uppercase my-2'>Más detalles del Mantenimiento</h4>
    {!edit ? <p>Lugar de recojo: {lugarRecojo}</p> : <InputB placeholder='Lugar de recojo' type='string' value={lugarRecojo} handleChange={setLugarRecojo}/>}
    {!edit ? <p> </p> : <InputB placeholder='Horas de viaje' type='number' value={horasViaje} handleChange={setHorasViaje}/>}
    {!edit ? <p>Diagnostico Inicial: {descripcion}</p> : <InputB placeholder='Diagnostico Inicial' type='string' value={descripcion} handleChange={setDescripcion}/>}
    {!edit ? <p className='font-bold text-xl'>Nro. RSS: {infoAdicional}</p> : <InputB className='font-bold' placeholder='Nro. RSS' type='number' value={infoAdicional} handleChange={setInfoAdicional}/>}
    <h4 className='font-bold my-2'>Detalle de equipos para mantenimiento</h4>
    {!edit ? <p>Equipos: {equipos}</p> : <InputB placeholder='Equipos por entregar' type='string' value={equipos} handleChange={setEquipos}/>}
    <div className="flex border-2 my-4 items-center space-x-2 px-2 py-4  border-gray-200 h-8 rounded-md">
        <label>Fecha visita:</label>
        {!edit ? <p>{dayjs(diaVisita).format(OnlyDayMonth)}</p> : <DatePicker selected={diaVisita} onChange={(date) => setDiaVisita(date || diaVisita)}/>}
    </div>
    {!edit ? <p className='font-bold text-lg'>Precio acordado (Bs.): {precio}</p> : <InputB placeholder='Precio acordado (Bs.)' type='number' value={precio} handleChange={setPrecio}/>}
</div>
<ul className="flex flex-col bg-white border-2 border-black p-2 space-y-1">
    <li>El monto indicado será pagado por 
        <span className='font-bold'> {ticket.clienteServicio?.cliente?.razonSocial}</span> a la Empresa 
        <span className='font-bold'> {instalador}</span>
    </li>
    <li>El plazo para realizar el mantenimiento es de 10 días calendario a partir de la fecha de asignación.</li>
    <li>El monto a cobrar se basa en la distancia al sitio.</li>
    <li>El instalador deberá cobrar el monto indicado en esta Orden de Mantenimiento.</li>
    <li>Todos los costos incluyen los impuestos de ley.</li>
    <li>El servicio tiene un tiempo de garantía de 3 meses a partir del Mantenimiento.</li>
    <li>Todos los equipos que fueron usados o se encontraron dañados en sitio deben ser devueltos a ABE en un plazo máximo de 15 días de calendario.</li>
</ul>
</div></div>;

  const getBody = () => { 
    return { 
        nombreInstalador: instalador,
        lugarRecojo,
        horasViaje: horasViaje.toString(),
        precioAcordado: precio.toString(),
        fechaVisitaProgramada: diaVisita,
        diagnostico: descripcion,
        detalles: infoAdicional.toString(),
        equipos
    };
  };

  return (ticket.ordenMantenimiento && !edit) 
        ? <> 
            {content}
            <div className="flex">
                <Button title='Descargar PDF' onClick={() => downloadPDF('pdf-content', `ticket-${ticket.id}-odm.pdf`)} className='mt-4'/>
                <Button title='Editar Orden de Mantenimiento' onClick={() => setEditar(true)} className='mt-4'/>
            </div>
        </> 
        : <Input className='flex flex-col space-y-2 px-2 overflow-x-auto w-[100hv] h-[80vh]'
            postName='Orden Mantenimiento' editar={!!ticket.ordenMantenimiento}
            handleRefresh={()=> { setEditar(false); handleFeederRefresh(); } }
            handleClean={() => setEditar(false)}
            getBody={getBody}  endpoint={`tickets/${ticket.id}/ordenMantenimiento`}
            >
            {content}
        </Input>;
};

export default OrdenMantenimientoForm;
