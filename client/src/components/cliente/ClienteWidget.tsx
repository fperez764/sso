import {
    ArrowDownIcon,
    ArrowLongUpIcon,
    EnvelopeIcon,
    FolderPlusIcon,
    IdentificationIcon,
    KeyIcon,
    MapPinIcon,
    PencilIcon,
    PhoneIcon,
    PlusIcon,
    TrashIcon,
    UserPlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Cliente, Roles } from '../../../types/typesSSO';
import { useAuthState } from '../../context/auth';
import {useState} from 'react';
import Button from '../Button';
import NuevoClienteWidget from './NuevoClienteWidget';
import ClienteServicioWidget from '../servicio/ClienteServicioWidget';

interface Props {
    cliente: Cliente;
    acciones?: boolean;
}

export default function ClienteWidget({ cliente, acciones } : Props) {
    const { user } = useAuthState();
    const puedeEditar = user?.rol === Roles.ADMIN;
    const [editar, setEditar] = useState(false);
    const porImplementar = async () => {
        toast.error(`Por implementar: url:/clientes/${cliente.nroDocumento}`);
    };
    const [verMas, setVerMas] = useState(false);


    return (
        editar ? <NuevoClienteWidget cliente={cliente} handleCancel={()=>setEditar(false)}/> :
        <div className="px-2 py-2 bg-gray-100 rounded-md">
                <h2 className="text-[14px]">ID Cliente: {cliente.id} </h2>
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline cursor-pointer" onClick={porImplementar}>
                        {cliente.nombreCompleto || 'Nombre Completo'}
                </h4>
            <div className="p-1 space-x-1 flex w-[80%] sm-w-full">
                {/*Info Personal*/}
                <div className="items-center w-1/2 whitespace-normal">
                    <p className='font-bold'>Datos de contacto:</p>
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
                    <div className="flex">
                        <PhoneIcon className='h-4'/>
                        <p className="text-sm sm:text-[12px] overflow-hidden ml-1">
                            {cliente.telefono ?? 'No registrado'}
                        </p>
                    </div>
                </div>
                {/**Datos Facturacion*/}
                <div className="w-1/2">
                    <h2 className='font-bold'>Datos facturación:</h2>
                    <h4 className="text-sm sm:text-[15px] whitespace-nowrap">
                        Razon Social: {cliente.razonSocial}
                    </h4>
                    <span className="text-sm sm:text-[15px]">
                        Facturar a {cliente.tipoDocumentoFacturacion}: {cliente.nroDocumentoFacturacion}
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
            {acciones && <div className='flex justify-center h-12 w-[80%] sm-w-full'>
                {puedeEditar ? <Button Icon={PencilIcon} onClick={()=>setEditar(true)}/>:null}
                <Button Icon={TrashIcon} onClick={porImplementar}/>
                <Button Icon={KeyIcon} onClick={porImplementar}/>
                {verMas ? <Button Icon={ArrowLongUpIcon} onClick={()=> setVerMas(false)}/> 
                :<Button Icon={PlusIcon} onClick={()=> setVerMas(true)}/>}
            </div>}
            {/**Solicitudes de Servicios*/}
            {verMas && 
            <div>
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
                {/**Actualizar datos Contacto*/}
                <div className="self-center font-bold border-b border-gray-500">
                    <Button Icon={UserPlusIcon} onClick={porImplementar} title='Agregar contactos'/>
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
                {/**Servicios*/}
                <div className="my-2 ml-2 border-b border-gray-500">
                    <h4 className='font-bold'>
                        Servicios:
                    </h4>
                    { 
                    cliente?.clienteServicios?.map(cliServicio=> {
                        const clienteServicio = cliServicio;
                        clienteServicio.cliente = cliente;
                        return <ClienteServicioWidget clienteServicio={clienteServicio}/>
                    }) 
                    }
                </div>
            </div>}      
        </div>
    );
}