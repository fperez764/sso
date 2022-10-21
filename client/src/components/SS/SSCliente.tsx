import {
    PlusIcon,
} from '@heroicons/react/24/outline';
import { Cliente } from '../../../types/typesSSO';

interface Props {
    cliente: Cliente;
}

function SSCliente({ cliente } : Props) {
  return (
    <div className="p-3 border-l border-gray-500  cursor-pointer w- xl:inline">
    {/*Header*/}
    <div className="flex justify-between">
        {/**Cliente info */}
        <div className="items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {cliente?.nombreCompleto || 'Nombres Apellidos'}
            </h4>
            <span className="text-sm sm:text-[15px]">
                {cliente.tipoDocumento}: {cliente.nroDocumento}
            </span>
            <h3 className="text-sm sm:text[18px] overflow-auto">
                Dirección: {cliente.direccion}
            </h3>
            <h3 className="text-sm sm:text[18px] font-bold">
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
