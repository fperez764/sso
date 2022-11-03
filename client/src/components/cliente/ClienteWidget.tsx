import {
    ArrowDownIcon,
    FolderIcon,
    FolderPlusIcon,
    HandRaisedIcon,
    KeyIcon,
    PencilIcon,
    PlusIcon,
    TrashIcon,
    UserPlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Cliente } from '../../../types/typesSSO';
import Button from '../Button';

interface Props {
    cliente: Cliente;
}

function ClienteWidget({ cliente } : Props) {
    const porImplementar = async () => {
        toast.error('Por implementar');
    };
  return (
    <div className="pl-2 bg-gray-100">
        <h1 className="font-bold text-[17px] hover:underline">Cliente:</h1>
        <div className="relative w-full p-1 space-x-1 cursor-pointer md:flex">
            {/*Info Personal*/}
            <div className="items-center w-1/2 space-x-1 whitespace-normal">
                <p className="text-[12px]">ID: {cliente.id} </p>
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline" onClick={porImplementar}>
                    {cliente.nombreCompleto || 'Nombre Completo'}
                </h4>
                <span className="text-sm sm:text-[15px] overflow-auto">
                    Documento: {cliente.nroDocumento ?? 'Documento no registrado'}
                </span>
                <p className="text-sm sm:text-[12px] overflow-hidden">
                    Dirección: {cliente.direccion ?? 'No registrada'}
                </p>
            </div>
            {/**Datos Facturacion*/}
            <div className="self-center w-1/2">
                <h4 className="text-sm sm:text-[15px]">
                    Razon Social: {cliente.razonSocial}
                </h4>
                <span className="text-sm sm:text-[15px]">
                    NIT: {cliente.nit} : {cliente.tipoDocumento}
                </span>
                <p className="text-sm sm:text-[12px] overflow-hidden">
                    Correo: {cliente.email ?? 'Dirección de correo no registrada'}
                </p>
            </div>
        </div>
        {/**Acciones Cliente */}
        <div className='flex justify-center h-12 border-b border-gray-500'>
            <Button Icon={PencilIcon} onClick={porImplementar}/>
            <Button Icon={TrashIcon} onClick={porImplementar}/>
            <Button Icon={KeyIcon} onClick={porImplementar}/>
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
        {/**Servicios*/}
        <div className="my-2 ml-2 font-bold border-b border-gray-500">
            <h4>
                Servicios:
            </h4>
            {/**
            {clienteSeleccionado && getServiciosCliente(clienteSeleccionado.id)
                .map(serviciosCliente=> (<ServicioWidget servicio={servicioCliente}/>)) 
            */}
        </div>
        {/**Solicitudes de Servicios*/}
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
    </div>
);
}

export default ClienteWidget;
