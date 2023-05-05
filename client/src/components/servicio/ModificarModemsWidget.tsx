/** @format */

import { useState } from 'react';
import { ClienteServicio, ClienteServicioModem } from '../../../types/typesSSO';
import SelectComboBox from '../SelectComboBox';
import Button from '../Button';
import InputB from '../InputB';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface Props {
	clienteServicio: ClienteServicio;
	handleCancelar: () => void;
}

export default function ModificarModemsWidget({ clienteServicio, handleCancelar }: Props) {
	const [modems, setModems] = useState<ClienteServicioModem[]>([]);
	const [macsNuevas, setMacsNuevas] = useState<string[]>([]);

	return (
		<div className="flex flex-col items-start p-4 space-y-5 border-2 border-gray-300">
			{/*Dar de baja: Quitar*/}
			{clienteServicio.modems && clienteServicio.modems.length > 0 && (
				<div className="">
					<h4 className="font-bold">Dar de baja modems</h4>
					<p className="">Seleccione los modems ({clienteServicio?.modems.length}):</p>
					<SelectComboBox optionsValue={clienteServicio.modems.map((m) => `${m.hub}-${m.mac}: ${m.nombre}`)} optionsObject={clienteServicio.modems} setData={setModems} />
				</div>
			)}
			{/*Dar de alta: Agregar*/}
			<div>
				<h4 className="font-bold">Agregar modems</h4>
				<ol>
					{macsNuevas.length > 0 &&
						macsNuevas.map((mac) => (
							<li className="flex space-x-3">
								<InputB placeholder="MAC" type="text" value={mac} />
								<Button title="Buscar en hubs" onClick={() => toast.error('Buscar modem por mac en hubs por integrar:\n Se confirara que la MAC ingresada es correcta y existe en algún hub')} />
							</li>
						))}
				</ol>
				<Button
					className="mt-3"
					title="Agregar modem"
					onClick={() => {
						toast.success('agregar fila de input:mac');
						setMacsNuevas([...macsNuevas, '']);
					}}
				/>
			</div>
			<div className="flex items-center justify-center w-full">
				<Button title="Aceptar cambios" titleConfirm={`Se desvincularan los modems:\n${modems.map((m) => m.hub + m.mac)}`} onClick={() => toast.error('Por implementar: Modificar modems')} />
				<Button
					title="Cancelar"
					onClick={() => {
						setMacsNuevas([]);
						handleCancelar();
					}}
				/>
			</div>
		</div>
	);
}
