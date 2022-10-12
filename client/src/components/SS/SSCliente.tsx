import {
    PlusIcon,
} from '@heroicons/react/24/outline';
import { Cliente } from '../../../types/types';

interface Props {
    cliente: Cliente;
}

function SSCliente({cliente} : Props) {
  return (
    <div className="p-3 border-b border-green-400 cursor-pointer w-2/6 xl:inline">
    {/*Header*/}
    <div className="flex justify-between">
        {/**Cliente info */}
        <div className="items-center space-x-1 whitespace-nowrap">
            <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                {cliente?.nombres || 'Nombres Apellidos'}
            </h4>
            <span className="text-sm sm:text-[15px]">
                {cliente ? `${cliente?.nroDocumento}:${cliente?.tipoDocumento}` : 'Nro. Doc.: Tipo Doc.'}
            </span>
            <h3 className="text-sm sm:text[18px] font-bold">
                {cliente?.tipoCliente || 'Tipo Cliente'}
            </h3>
        </div>
        {/**Accion Cliente*/}
        {!cliente && <PlusIcon className="w-10 h-10 p-2 hoverEffect hover:bg-sky-100 hover:text-sky-500" />}
    </div>
</div>
)
}

export default SSCliente
