import { PlusIcon } from '@heroicons/react/24/outline';
import router from 'next/router';
import { toast } from 'react-hot-toast';
import { ClienteFactura } from '../../../types/typesABEFAC';

interface Props {
	cliente: ClienteFactura;
}

function ClienteFacturaCard({ cliente }: Props) {
	const mostrarCliente = async () => {
		toast.error(`Por implementar ir a /cliente/${cliente.idCuenta}`);
		//router.push(`cliente/${cliente.idCuenta}`);
	};
	return (
		<div className="ml-2 overflow-hidden cursor-pointer">
			{/*Header*/}
			<span className="text-[13px]">ID: {cliente.idCuenta}</span>
			<h4 className="font-bold text-[15px] sm:text-[16px] whitespace-nowrap hover:underline w-22" onClick={mostrarCliente}>
				{cliente.razonSocial || 'Razon Social'}
			</h4>
			<span className="text-sm sm:text-[15px] py-0">{`${cliente.tipoDocumento} : ${cliente.nroDocumento}`}</span>
		</div>
	);
}

export default ClienteFacturaCard;
