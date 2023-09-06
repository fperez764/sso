import axios from 'axios';
import { useState, SetStateAction, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Cliente, ClienteServicio, Servicio } from '../../../types/typesSSO';
import ComboBox from '../ui/ComboBox';
import Input from '../ui/Input';
import InputB from '../ui/InputB';

interface Props {
	clienteServicio?: ClienteServicio;
	cliente: Cliente;
	handleRefresh?: () => void;
}

export default function NuevoClienteServicioWidget({ clienteServicio, cliente, handleRefresh }: Props) {
	const postName = 'Cliente-Servicio';
	const endpoint = '/clienteServicios/' + (clienteServicio?.id || '');

	const [nombreServicio, setNombreServicio] = useState<Servicio | undefined>(clienteServicio?.servicio || undefined);
	const [errors, setErrors] = useState<any>(null);
	const [activo, setActivo] = useState(true);
	const [contrato, setContrato] = useState(true);
	const [instalador, setInstalador] = useState('');

	const handleClean = () =>{
		setInstalador('');
		setActivo(false);
		setContrato(false);
	}
	const getBody = () => {
		if (!nombreServicio) {
			toast.error('Categoria no definida');
			return {};
		}
		return {
			nombreServicio: nombreServicio,
			activo, //Si se selecciona activo se crea un evento de activaci[on]
			contrato, //TODO: Agregar una forma de agregar documento: contrato 
			instalador,	//TODO: Cambiar de texto de entrada a un combo con los instaladores registrados
			idCliente: cliente.id
		};
	};

	return (
		<Input handleClean={handleClean} handleRefresh={handleRefresh} postName={postName} getBody={getBody} endpoint={endpoint} setErrors={setErrors} editar={!nombreServicio}>
			<div className='flex flex-col space-y-2'>
			<ComboBox setData={setNombreServicio} filterKey="nombre" postName="Servicio" searchEndpoint={`/servicios/`} />
			<InputB placeholder="Instalador" type="string" value={instalador} handleChange={setInstalador} errors={errors} />
			<label className='ml-2'>{contrato ? 'Contrato' : 'Sin contrato'}
				<input className='mx-3 ml-2' type='checkbox' defaultChecked={!!contrato} onChange={()=>setContrato(!contrato)}/>
			</label>
			<label className='ml-2'>{activo ? 'Activo' : 'Inactivo'}
				<input className="mx-3 ml-2" type="checkbox" defaultChecked={activo} onChange={() => setActivo(!activo)} />
			</label>
			</div>
		</Input>
	);
}
