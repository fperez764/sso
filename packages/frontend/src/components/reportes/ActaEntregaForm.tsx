'use client';
import { ClienteServicioodm } from '@types/typesSSO';
import React, { useState } from 'react'
import InputB from '../ui/InputB';
import DatePicker from 'react-datepicker';
import Input from '../ui/Input';
import Image from 'next/image';
import { OnlyDayMonth } from '@src/utils/common';
import dayjs from 'dayjs';

interface Props {
    odm: any
}

const ActaEntregaForm = ({ odm } : Props) => {
if(!odm) return <h2 className='text-center font-bold w-80'>odm sin ORDEN DE MANTENIMIENTO Generar ODM primero</h2>;
const [instalador, setInstalador] = useState('');
const [descripcion, setDescripcion] = useState(odm.descripcion);
const [equipos, setEquipos] = useState('');
const [lugarRecojo, setLugarRecojo] = useState('');
const [horasViaje, setHorasViaje] = useState(0);
const [diaVisita, setDiaVisita] = useState(new Date());

  return <Input className='flex flex-col w-[100vh] h-[80vh] overflow-x-auto bg-white'
    postName='Acta de Entrega de Equipos'
    handleClean={()=>{}}
    getBody={() => { 
        return { instalador, descripcion, equipos, lugarRecojo, horasViaje, diaVisita };
    }}
    endpoint='odms/ordenMantenimiento'
  >
    <div className='pdf-content bg-white px-12 py-12'>
    <div className='bg-sky-200 flex flex-col space-y-2'>
        <div className="flex items-center justify-around bg-white border-2 border-black">
            <Image width="120" height="70" src="/images/logo.png" alt="ABE Logo" />
            <h1 className="text-center font-bold uppercase">Acta de Entrega de Equipos</h1>
        </div>
        <div className="flex flex-col border-2 bg-white border-black space-y-2 p-2">
            <div className="grid grid-cols-4 h-16 gap-0 divide-x divide-y divide-black border-2 border-black text-center">
                <p className='bg-gray-300'>LUGAR</p>
                <p>{lugarRecojo}</p>
                <p className='bg-gray-300'>FECHA</p>
                <p>{dayjs(new Date()).format(OnlyDayMonth)}</p>
                <p className='bg-gray-300'>CLIENTE</p>
                <p>{odm.clienteServicio?.cliente?.razonSocial || odm.nombreContacto}</p>
                <p className='bg-gray-300'>NIT</p>
                <p>{odm.clienteServicio?.cliente?.nroDocumentoFacturacion}</p>
            </div>
            <div className="flex items-center">
                <h2 className='w-1/2'><span className='font-bold'>DESCRIPCIÓN:</span><br/>{odm.descripcion}</h2>
                <div className="flex flex-col font-bold">
                    <p>ODM-odm No. <span>{odm.id}-2023</span></p>                
                    <p>Fecha asignación <span>{(odm ? odm.fechaCreacion : new Date()).toLocaleString('es')}</span></p>
                </div>
            </div>
            <div className="flex justify-around items-center mb-2">
            <p className='font-bold'>EMPRESA INSTALADORA:</p>
            {odm ? <p>{instalador}</p> : <InputB placeholder='Instalador' type='string' value={instalador} handleChange={setInstalador}/>}
            </div>
        </div>
        <div className="p-2 border-2 border-black flex flex-col bg-white">
            <h4 className='font-bold text-center uppercase mb-2'>Detalle de Equipos</h4>
            <div className='border-2 divide-x divide-black border-black h-16 grid grid-cols-6 text-center'>
                <p className='font-bold bg-gray-300'>TIPO EQUIPO</p>
                <p className='font-bold bg-gray-300'>MARCA</p>
                <p className='font-bold bg-gray-300'>MODELO</p>
                <p className='font-bold bg-gray-300'>No. SERIE/MAC</p>
                <p className='font-bold bg-gray-300'>ESTADO</p>
                <p className='font-bold bg-gray-300'>OBSERV.</p>
            </div>
            <div className='divide-x divide-y border-x-2 border-black divide-black grid grid-cols-6 text-center'>
                <p>Modem Satelital</p>
                <p>Anatel</p>
                <p>MDM2210</p>
                <p>-</p>
                <p>NUEVO</p>
                <p>-</p>
                <p>ILB-LNB</p>
                <p>Newtec</p>
                <p>ILB2220</p>
                <p>-</p>
                <p>NUEVO</p>
                <p>-</p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
                <p></p>
            </div>
        </div>
        <ul className="flex flex-col bg-white border-2 border-black p-2 space-y-1">
            <li>El cliente ha verificado el funcionamiento correcto de los equipos. Asimismo, se compromete a tomar las medidas necesarias de protección para evitar cualquier tipo de daño a los equipos.</li>
            <li>En señal de conformidad, se firmara al pie del presente documento.</li>
            <div className='py-12 px-2 flex font-bold text-sm justify-between'>
                <p className='border-t-2 border-black w-1/4  text-center'>ALMACENES ABE</p>
                <div className="flex flex-col w-1/4">
                    <p className='border-t-2 border-black  text-center'>EMPRESA INSTALADORA</p>
                    <p>Nombre:</p>
                    <p>C.I.:</p>
                    <p>EMPRESA:</p>
                </div>
                <div className="flex flex-col w-1/4">
                    <p className='border-t-2 border-black text-center'>CLIENTE</p>
                    <p>Nombre:</p>
                    <p>C.I.:</p>
                </div>
            </div>
        </ul>
    </div>
    {/*<ComboBox setData={setInstalador} postName='Instalador' searchEndpoint='/instaladores' filterKey='nombreCompleto'/> */}
    </div>    
    </Input>;
};

export default ActaEntregaForm;
