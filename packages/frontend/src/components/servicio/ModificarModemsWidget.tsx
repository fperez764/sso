import { useState } from 'react';
import { ClienteServicio, ClienteServicioModem, users_rol_enum } from '../../../types/typesSSO';
import SelectComboBox from '../ui/SelectComboBox';
import Button from '../ui/Button';
import InputB from '../ui/InputB';
import { toast } from 'react-hot-toast';
import ModemViewWidget, { DataModem } from './ModemViewWidget';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import axios, { AxiosError } from 'axios';
import { useAuthState } from '@src/context/auth';

interface Props {
	clienteServicio: ClienteServicio;
	handleCancelar: () => void;
}



export default function ModificarModemsWidget({ clienteServicio, handleCancelar }: Props) {
	const { user } = useAuthState();
	const admin = user?.rol === users_rol_enum.ADMIN;
	const [modems, setModems] = useState<ClienteServicioModem[]>([]);
	const [macNueva, setMacNueva] = useState<string>('');
	const [modemVerificado, setModemVerificado] = useState(false);

	/**
	 * 
	 * @param infoMac Verifica si el modem tiene la el nombre del perfil para modems que pueden ser asignados (provisionados)
	 * a partir del JSON recuperado de contador.abe.bo 
	 * @returns 
	 */
	const verificar = (infoMac: JSON) => {
		if(JSON.stringify(infoMac).includes('FULL_ACCESS')){
			toast.success('Modem en preprovisión. Puede ser asignado.');
			setModemVerificado(true)
		}else{
			toast.error('Modem encontrado, pero no puede ser asignado.');
			setModemVerificado(false);
		}
	}

	const agregarModem = async () => {
		if(!macNueva) return toast.error('Mac invalida');
		if(!modemVerificado && !admin) return toast.error('Primero valide el modem con el hub.');
		const tModem = toast.loading('Asignando modem: ' + macNueva);
		try {
			const res = await axios.post(`clienteServicios/${clienteServicio.id}/modem`, {
				mac: macNueva,
				//coordenadas,
				//autoAdministrado
			});
			return toast.success('Modem asignado: ' + res.data, {id: tModem});				
		} catch (error: AxiosError) {
			return toast.error('Algo salio mal al asignar el modem: \n' + JSON.stringify(error.response?.data?.message || error), {id: tModem});							
		}		
	}

	const liberarModem = async () => {
		for(let i=0; i < modems.length; i++){
			const lModem = toast.loading('Liberar modem: ' + modems[i].mac);
			try {
			await axios.delete(`clienteServicios/${clienteServicio.id}/modem/${modems[i].mac}`);
			return toast.success(modems[i].mac + ' liberada', {id: lModem});				
			} catch (error: AxiosError) {
				return toast.error('Algo salio mal al librar el modem: \n' + JSON.stringify(error.response?.data?.message || error), {id: lModem});							
			}				
		}
		return toast.success('Se liberaron todos los modems seleccionados.');
	}
	
	return (
		<div className="flex flex-col items-start p-4 space-y-5 border-2 border-gray-300">
			{/*Dar de baja: Quitar*/}
			{clienteServicio.modems && clienteServicio.modems.length > 0 && (
				<div className="">
					<h4 className="font-bold">Dar de baja modems</h4>
					<p className="">Seleccione los modems ({clienteServicio?.modems.length}):</p>
					<SelectComboBox optionsValue={clienteServicio.modems.filter(m => !m.fechaBaja).map((m) => `${m.hub ?? ''}-${m.mac}: ${m.coordenadas ?? ''}`)} optionsObject={clienteServicio.modems} setData={setModems} />
					<Button title="Liberar modems" titleConfirm={`Se desvincularan los modems:\n${modems.map((m) => m.mac)}`} onClick={liberarModem} />
				</div>
			)}
			{/*Dar de alta: Agregar*/}
			<div>
				<h4 className="font-bold">Agregar modem</h4>
					<div className="flex flex-col space-x-3">
						<InputB placeholder="MAC" type="text" value={macNueva} handleChange={setMacNueva} />
						<p>Verificar mac desde hub:</p>
						<ModemViewWidget mac={macNueva} verificar={verificar}/>
					</div>
				{modemVerificado && <CheckCircleIcon className='w-8 h-8 bg-green-400 rounded-full'/>}
				{/*modemVerificado && <>
					<InputB placeholder={`Coordenadas (${process.env.NEXT_PUBLIC_COORDENADAS_ABE})`} 
					type="text" value={coordenadas} handleChange={setCoordenadas} />
				</>*/}
				{(modemVerificado || admin) && <Button
					className="mt-3"
					title="Agregar modem"
					onClick={agregarModem}
				/>}
			</div>
		</div>
	);
}
