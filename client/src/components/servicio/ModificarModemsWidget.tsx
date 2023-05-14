/** @format */

import { useState } from 'react';
import { ClienteServicio, ClienteServicioModem } from '../../../types/typesSSO';
import SelectComboBox from '../SelectComboBox';
import Button from '../Button';
import InputB from '../InputB';
import { toast } from 'react-hot-toast';
import ModemViewWidget from './ModemViewWidget';

interface Props {
	clienteServicio: ClienteServicio;
	handleCancelar: () => void;
}

export default function ModificarModemsWidget({ clienteServicio, handleCancelar }: Props) {
	const [modems, setModems] = useState<ClienteServicioModem[]>([]);
	const [macNueva, setMacNueva] = useState<string>('');
	const [mostrarInfoModem, setMostarInfoModem] = useState(false);

	return (
		<div className="flex flex-col items-start p-4 space-y-5 border-2 border-gray-300">
			{/*Dar de baja: Quitar*/}
			{clienteServicio.modems && clienteServicio.modems.length > 0 && (
				<div className="">
					<h4 className="font-bold">Dar de baja modems</h4>
					<p className="">Seleccione los modems ({clienteServicio?.modems.length}):</p>
					<SelectComboBox optionsValue={clienteServicio.modems.map((m) => `${m.hub}-${m.mac}: ${m.nombre}`)} optionsObject={clienteServicio.modems} setData={setModems} />
					<Button title="Liberar modems" titleConfirm={`Se desvincularan los modems:\n${modems.map((m) => m.hub + m.mac)}`} onClick={() => toast.error('Por implementar: Modificar modems')} />
				</div>
			)}
			{/*Dar de alta: Agregar*/}
			<div>
				<h4 className="font-bold">Agregar modem</h4>
					<li className="flex space-x-3">
						<InputB placeholder="MAC" type="text" value={macNueva} handleChange={setMacNueva} />
						<Button title="Buscar en hubs" onClick={() => setMostarInfoModem(true)} />
						{mostrarInfoModem && <ModemViewWidget mac={macNueva}/>}
					</li>
				<Button
					className="mt-3"
					title="Agregar modem"
					onClick={() => {
						toast.success('agregar fila de input:mac');
					}}
				/>
			</div>
		</div>
	);
}
