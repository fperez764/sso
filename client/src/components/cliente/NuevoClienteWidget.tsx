/** @format */

import { SetStateAction, useReducer, useState } from 'react';
import { Cliente } from '../../../types/typesSSO';
import ComboBox from '../ComboBox';
import Input from '../Input';
import InputB from '../InputB';

interface Props {
	cliente?: Cliente | null;
}
export default function NuevoClienteWidget({ cliente }: Props) {
	const [errors, setErrors] = useState<any>({});
	const [nombreCompleto, setNombreCompleto] = useState(cliente?.nombreCompleto || '');
	const [nroDocumento, setNroDocumento] = useState(cliente?.nroDocumento || '');
	const [tipoDocumento, setTipoDocumento] = useState<string>(cliente?.tipoDocumentoFacturacion || 'NIT');
	const [razonSocial, setRazonSocial] = useState(cliente?.razonSocial || '');
	const [nroDocumentoFacturacion, setNroFacturacion] = useState(cliente?.nroDocumentoFacturacion || '');
	const [email, setEmail] = useState(cliente?.email || '');
	const [telefono, setTelefono] = useState(cliente?.telefono || '');
	const [direccion, setDireccion] = useState(cliente?.direccion || '');
	//TODO: Replace for usereducer dev.to/builderio/a-cure-for-react-usestate-hell-1ldi

	const [event, updateEvent] = useReducer(
		(prev: any, next: any) => {
			const newEvent = { ...prev, ...next };
			//Validation
			if (newEvent.dir.length > 100) {
				newEvent.dir = newEvent.dir.substring(0, 100);
			}
			return newEvent;
		},
		{ errors: {}, nombreCmpleto: '', nroDoc: '', tipoDoc: '', razonScial: '', nroFact: '', correo: '', fono: '', dir: '' },
	);

	const getBody = () => {
		return {
			nombreCompleto,
			nroDocumento,
			nroDocumentoFacturacion,
			tipoDocumento,
			telefono,
			email,
			razonSocial,
			direccion,
		};
	};

	const handleLimpiarForm = () => {
		setNombreCompleto('');
		setNroDocumento('');
		setTipoDocumento('');
		setRazonSocial('');
		setNroFacturacion('');
		setEmail('');
		setDireccion('');
	};

	type kEvent = { target: { value: SetStateAction<string> } };
	const postName = 'Cliente';
	const postEndpoint = '/clientes';

	return (
		<Input handleClean={handleLimpiarForm} postName={postName} editar={!!cliente} getBody={getBody} endpoint={postEndpoint} setErrors={setErrors}>
			<InputB value={nombreCompleto} handleChange={setNombreCompleto} placeholder="Nombre Completo" error={errors?.nombreCompleto} type="string" />
			<InputB value={nroDocumento} handleChange={setNroDocumento} placeholder="Nro. Documento" error={errors?.nroDocumento} type="number" />
			<InputB value={razonSocial} handleChange={setRazonSocial} placeholder="Razon Social" error={errors?.razonSocial} type="string" />
			<InputB value={nroDocumentoFacturacion} handleChange={setNroFacturacion} placeholder="Facturar al número:" error={errors?.nroDocumentoFacturacion} type="number" />
			<ComboBox setData={setTipoDocumento} value={tipoDocumento} options={['CI', 'NIT', 'CEX', 'OTRO']} postName="Tipo documento" />
			<InputB value={email} handleChange={setEmail} placeholder="Correo" error={errors?.email} type="email" />
			<InputB value={telefono} handleChange={setTelefono} placeholder="Telefono" error={errors?.telefono} type="number" />
			<InputB value={direccion} handleChange={setDireccion} placeholder="Dirección" error={errors?.direccion} type="string" />
		</Input>
	);
}
