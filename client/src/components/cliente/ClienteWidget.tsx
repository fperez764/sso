import {
    ArrowDownIcon,
    ArrowLongUpIcon,
    EnvelopeIcon,
    EyeIcon,
    FolderPlusIcon,
    HandRaisedIcon,
    IdentificationIcon,
    KeyIcon,
    MapPinIcon,
    PencilIcon,
    PlusIcon,
    TagIcon,
    TrashIcon,
    UserPlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Cliente } from '../../../types/typesSSO';
import { useAuthState } from '../../context/auth';
import {useState} from 'react';
import Button from '../Button';
import NuevoClienteWidget from './NuevoClienteWidget';
import { ClienteFactura } from '../../../types/typesABEFAC';
import ServicioWidget from '../servicio/ServicioWidget';
import ClienteServicioWidget from '../servicio/ClienteServicioWidget';

interface Props {
    cliente: Cliente;
}

export default function ClienteWidget({ cliente } : Props) {
    const { user } = useAuthState();
    const puedeEditar = user?.rol === 'admin';
    const [editar, setEditar] = useState(false);
    const porImplementar = async () => {
        toast.error('Por implementar');
    };
    const [verMas, setVerMas] = useState(false);


    return (
        editar ? <NuevoClienteWidget cliente={cliente} handleCancel={()=>setEditar(false)}/> :
        <div className="pl-2 bg-gray-100">
            <div className="relative w-full p-1 space-x-1 cursor-pointer md:flex">
                {/*Info Personal*/}
                <div className="items-center w-1/2 space-x-1 whitespace-normal">
                    <p className="text-[12px]">ID: {cliente.id} </p>
                    <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline" onClick={porImplementar}>
                        {cliente.nombreCompleto || 'Nombre Completo'}
                    </h4>
                    <div className="flex">
                        <IdentificationIcon className='h-4'/>
                        <span className="text-sm sm:text-[15px] overflow-auto ml-1">
                            {cliente.nroDocumento ?? 'Documento no registrado'}
                        </span>
                    </div>
                    <div className="flex">
                        <MapPinIcon className='h-4'/>
                        <p className="text-sm sm:text-[12px] overflow-hidden ml-1">
                            {cliente.direccion ?? 'No registrada'}
                        </p>
                    </div>
                </div>
                {/**Datos Facturacion*/}
                <div className="self-center w-1/2">
                    <h4 className="text-sm sm:text-[15px]">
                        Razon Social: {cliente.razonSocial}
                    </h4>
                    <span className="text-sm sm:text-[15px]">
                        Facturar a: {cliente.nroDocumentoFacturacion} : {cliente.tipoDocumentoFacturacion}
                    </span>
                    <div className="flex">
                        <EnvelopeIcon className='h-4'/>

                        <p className="text-sm sm:text-[12px] overflow-hidden ml-1">
                            {cliente.email ?? 'Dirección de correo no registrada'}
                        </p>
                    </div>
                </div>
            </div>
            {/**Acciones Cliente */}
            <div className='flex justify-center h-12 border-b border-gray-500'>
                {puedeEditar ? <Button Icon={PencilIcon} onClick={()=>setEditar(true)}/>:null}
                <Button Icon={TrashIcon} onClick={porImplementar}/>
                <Button Icon={KeyIcon} onClick={porImplementar}/>
                {verMas ? <Button Icon={ArrowLongUpIcon} onClick={()=> setVerMas(false)}/> 
                :<Button Icon={PlusIcon} onClick={()=> setVerMas(true)}/>}
            </div>
            {/**Solicitudes de Servicios*/}
            {verMas && <div>
            <div className="my-2 ml-2 font-bold border-b border-gray-500">
                <h4>
                    Solicitudes Servicio:
                </h4>
                <Button Icon={PlusIcon} onClick={porImplementar} title='Solicitud de Servicio'/>
                {/**
                {clienteSeleccionado && getSSCliente(clienteSeleccionado.id)
                    .map(sSCliente=> (<sSWidget solicitudS={sSCliente}/>)) 
                */}
            </div>
                    {/**Facturas*/}
                    <div className="my-2 ml-2 font-bold border-b border-gray-500">
                <h4>
                    Facturas:
                </h4>
                {/**
                {clienteSeleccionado && getFacturasCliente(clienteSeleccionado.id)
                    .map(facturaCliente=> (<FacturaWidget factura={facturaCliente} resumida={true}/>)) 
                */}
                <Button Icon={ArrowDownIcon} onClick={porImplementar} title='Reporte facturas'/>
            </div>
            {/**Datos Contacto*/}
            <div className="self-center my-2 ml-2 font-bold border-b border-gray-500">
                <h4>
                    Datos de Contacto: {cliente.telefono}
                </h4>        
                <div className='items-center space-y-2 xl:flex xl:h-8'>
                <Button Icon={UserPlusIcon} onClick={porImplementar} title='Agregar contactos'/>
                </div>
            </div>
            {/**Documentos*/}
            <div className="my-2 ml-2 font-bold border-b border-gray-500">
                <h4 className='font-bold'>
                    Documentos:
                </h4>
                <p className='flex items-center my-3'>
                    CI: <img 
                    className='w-8 h-8 ml-2'
                    alt='Carnet de Identidad'
                    src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' />
                </p>
                <Button Icon={FolderPlusIcon} onClick={porImplementar} title='Agregar Documentos'/>
            </div> 
            </div>}       
            {/**Servicios*/}
            <div className="my-2 ml-2 border-b border-gray-500">
                <h4 className='font-bold'>
                    Servicios:
                </h4>
                { 
                cliente?.clienteServicios?.map(cliServicio=> (<ClienteServicioWidget servicio={cliServicio.servicio}/>)) 
                }
            </div>
        </div>
    );
}