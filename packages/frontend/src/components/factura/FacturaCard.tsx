import { ArrowPathIcon, CheckIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Factura } from '../../../types/typesABEFAC';
import ClienteFacturaCard from './ClienteFacturaCard';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import axios from 'axios';
import { DateMonth } from '../../utils/common';

dayjs.locale(es);
dayjs.extend(relativeTime);
interface Props {
	factura: Factura;
}

const apiInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_CLIENT_API || 'http://localhost:3000/api',
	timeout: 10000,
});

export default function FacturaCard({ factura }: Props) {
	const refresh = async () => {
		const waitFactura = toast.loading('Actualizando');
		try {
			const res = await axios.get(`/factura/${factura.idOperacion}`);
			factura = res.data.datos;
			toast.success('Se actualizo', { id: waitFactura });
		} catch (error) {
			toast.error('Hubo un problema al buscar la factura ' + error, { id: waitFactura });
		}
	};
	const anular = async () => {
		try {
			const res = await apiInstance.get(`/factura/${factura.idOperacion}`);
			factura = res.data.datos;
			toast.success('Se anulo la factura correctamente.');
		} catch (error) {
			toast.error('No se pudo anular la factura ' + error);
		}
	};
	const pagar = async () => {
		const tPagarFactura = toast.loading('Marcando factura como pagada');
		try {
			const res = await axios.get(`/factura/${factura.idOperacion}`);
			factura = res.data.datos;
			toast.success('Se marco la factura como pagada.', { id: tPagarFactura });
		} catch (error) {
			toast.error('Hubo un problema al pagar la factura ' + error, { id: tPagarFactura });
		}
	};

	return (
		<div className={`flex h-20 bg-gray-100 border-b ml-1 border-gray-400 ${factura.usuarioAnulacion && 'bg-red-500'}`}>
			{/*Acciones + infor principal */}
			<div className="flex w-64 mr-1 overflow-x-hidden">
				<div className="flex flex-col w-6 h-16">
					<ArrowPathIcon className="w-5 h-5 hoverEffect" onClick={refresh} />
					{!factura.pagado && <CheckIcon className="w-5 h-5 hoverEffect hover:text-green-500" onClick={pagar} />}
					{!factura.fechaAnulacion && <TrashIcon className="w-5 h-5 hoverEffect hover:text-red-500" onClick={anular} />}
				</div>
				<div className="items-center ml-1 space-x-1 text-sm cursor-pointer whitespace-nowrap">
					<a href={factura.urlPdf} target="_blank">
						<h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
							No.: {factura.numeroFactura} - {dayjs(factura.fechaEmision).format(DateMonth)}
						</h4>
					</a>
					<h4 className="text-[15px] overflow-hidden cursor-pointer">idOp: {factura.idOperacion}</h4>
				</div>
			</div>
			{/* Informacion extra de la factura */}
			<div className="hidden w-96 xl:inline ">
				<div className="flex w-[] space-x-2 h-12 text-gray-800 text-[16px]">
					<h3 className="w-2/3 overflow-hidden">{factura?.descripcion || 'Descripción'}</h3>
					<h3 className="w-1/3 font-bold">{factura?.facturaDetalles[0].codigo || 'Descripción'}</h3>
				</div>
				<h4 className="font-bold text-[14px] hover:underline">montoTotal: {factura.montoTotal}</h4>
			</div>
			{/** Estados de factura: Emision y pago */}
			<div className="flex flex-col items-center mx-1 font-bold w-36">
				<h3 className={`text-[15px] sm:text-[16px] ${factura.estado.includes('EXITO') ? 'bg-green-400' : 'bg-red-400'}`}>{factura.estado.replace('_EXITO', '').replace('EMITIDO_O', 'O')}</h3>
				<h3 className={`${factura.pagado ? 'bg-green-400' : 'bg-red-400'} mt-1 self-center text-sm`}>{factura?.pagado ? 'Pagada' : 'Por pagar'}</h3>
			</div>
			<div className="overflow-x-hidden w-96">
				<ClienteFacturaCard cliente={factura.cliente} />
			</div>
		</div>
	);
}
