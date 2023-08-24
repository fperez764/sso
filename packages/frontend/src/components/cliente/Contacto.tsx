import { IdentificationIcon, MapPinIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

interface Props {
	direccion?: string | null;
	telefono?: string | null;
	nombre?: string;
	nroDocumento?: string;
}

export default function Contacto({ direccion, telefono, nombre, nroDocumento }: Props) {
	return (
		<div>
			<p className="font-bold">Contacto Ticket:</p>
			{!!nombre && (
				<div className="flex">
					<UserIcon className="h-4" />
					<span className="text-sm sm:text-[15px] overflow-auto ml-1">{nombre}</span>
				</div>
			)}
			{!!nroDocumento &&
			<div className="flex">
				<IdentificationIcon className="h-4" />
				<span className="text-sm sm:text-[15px] overflow-auto ml-1">{nroDocumento || 'Documento no registrado'}</span>
			</div>}
			<div className="flex">
				<PhoneIcon className="h-4" />
				<p className="text-sm sm:text-[15px] overflow-hidden ml-1">{telefono || 'No registrado'}</p>
			</div>
			<div className="flex">
				<MapPinIcon className="h-4" />
				<p className="text-sm sm:text-[15px] overflow-hidden ml-1">{direccion ?? 'No registrada'}</p>
			</div>
		</div>
	);
}
