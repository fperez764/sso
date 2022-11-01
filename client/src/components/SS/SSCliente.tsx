import {
    PlusIcon,
} from '@heroicons/react/24/outline';
import { Cliente } from '../../../types/typesSSO';

interface Props {
    cliente: Cliente;
}

function SSCliente({ cliente } : Props) {
  return (
    <div className="p-3 cursor-pointer xl:inline">
    {/*Header*/}
    <div className="flex justify-between hover:bg-gray-200">
        {/**Cliente info */}
        <div className="items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[14px] hover:underline">
                {cliente?.nombreCompleto || 'Nombres Apellidos'}
            </h4>
            <span className="text-sm sm:text-[15px]">
                {cliente.tipoDocumento}: {cliente.nroDocumento}
            </span>
            <h3 className="hidden overflow-auto text-sm lg:flex">
                Dirección: {cliente.direccion}
            </h3>
            <h3 className="hidden text-sm font-bold lg:flex">
                Telefono: {cliente.telefono}
            </h3>
        </div>
        {/**Accion Cliente*/}
        {!cliente && <PlusIcon className="w-10 h-10 p-2 hoverEffect hover:bg-sky-100 hover:text-sky-500" />}
    </div>
</div>
);
}

export default SSCliente;
