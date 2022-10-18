import {
    FolderIcon,
    HandRaisedIcon,
    KeyIcon,
    PencilIcon,
    TrashIcon,
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
    <div className="bg-gray-200 space-y-2">
        {/**Acciones Cliente */}
        <div className='flex h-12'>
            <Button Icon={PencilIcon} active={true} onClick={porImplementar} title='Modificar Cliente'/>
            <Button Icon={TrashIcon} active={true} onClick={porImplementar} title='Dar Cliente de Baja'/>
        </div>
        <div className="w-full flex p-1 ml-2 cursor-pointer xl:inline border-b border-gray-500 relative">
            {/*Info Personal*/}
            <div className="w-80 items-center space-x-1 whitespace-normal">
                <p className="text-[12px]">ID: {cliente.id} </p>
                <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline" onClick={porImplementar}>
                    {cliente.nombreCompleto || 'Nombre Completo'}
                </h4>
                <span className="text-sm sm:text-[15px] overflow-auto">
                    Documento: {cliente.nroDocumento ?? 'Documento no registrado'}
                </span>
                <p className="text-sm sm:text-[12px] overflow-hidden">
                    Dirección: {cliente.direccion ?? 'Dirección no registrada'}
                </p>
            </div>
            {/**Datos Facturacion*/}
            <div className="w-80
                ml-2 self-center">
                <h4>
                    Razon Social: {cliente.razonSocial}
                </h4>
                <span className="text-sm sm:text-[15px]">
                    NIT: {cliente.nit} : {cliente.tipoDocumento}
                </span>
                <p className="text-sm sm:text-[12px] overflow-hidden">
                    Correo facturación: {cliente.email ?? 'Dirección de correo no registrada'}
                </p>
            </div>
        </div>
        <div className='xl:flex xl:h-8 space-y-2'>
            <Button Icon={KeyIcon} active={true} onClick={porImplementar} title='Actualizar password Clientes'/>
            <Button Icon={FolderIcon} active={true} onClick={porImplementar} title='Agregar Documentos'/>
            <Button Icon={HandRaisedIcon} active={true} onClick={porImplementar} title='Agregar contactos'/>
        </div>
        {/**Datos Contacto*/}
        <div className="ml-2 self-center font-bold">
            <h4>
                Datos de Contacto: {cliente.telefono}
            </h4>
        </div>
        {/**Documentos*/}
        <div className="ml-2 self-center border-b border-gray-500">
            <h4 className='font-bold'>
                Documentos:
            </h4>
            <p className='flex items-center my-3'>
                CI: <img 
                className='w-8 h-8 ml-2'
                alt='Carnet de Identidad'
                src='https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' />
            </p>
        </div>        
        {/**Servicios*/}
        <div className="ml-2 self-center">
            <h4>
                Servicios: {cliente.direccion}
            </h4>
        </div>
        {/**Facturas*/}
        <div className="ml-2 self-center">
            <h4>
                Facturas: {cliente.telefono}
            </h4>
        </div>
        {/**Solicitudes de Servicios*/}
        <div className="ml-2 self-center">
            <h4>
                Solicitudes Servicio: {cliente.telefono}
            </h4>
        </div>
    </div>
);
}

export default ClienteWidget;
