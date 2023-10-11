'use client';
import { useState } from 'react';
import { Cliente, cliente_persona_enum, cliente_tipodocumentofacturacion_enum } from '../../../types/typesSSO';
import ComboBox from '../ui/ComboBox';
import InputB from '../ui/InputB';
import Input from '../ui/Input';

interface Props {
	cliente?: Cliente | null;
	setShowNew: any;
}
export default function NuevoClienteWidget({ cliente, setShowNew }: Props) {
	const [errors, setErrors] = useState<string[]>([]);
	const [nombreCompleto, setNombreCompleto] = useState(cliente?.contactos[0]?.nombreCompleto || '');
	const [nroDocumento, setNroDocumento] = useState(cliente?.contactos[0]?.nroDocumento || '');
	const [tipoDocumentoFacturacion, setTipoDocumento] = useState<string>(cliente?.tipoDocumentoFacturacion || cliente_tipodocumentofacturacion_enum.NIT);
	const [tipo, setTipoCliente] = useState<string>(cliente?.tipo || cliente_persona_enum.NATURAL);
	const [razonSocial, setRazonSocial] = useState(cliente?.razonSocial || '');
	const [nroDocumentoFacturacion, setNroFacturacion] = useState(cliente?.nroDocumentoFacturacion || '');
	const [email, setEmail] = useState(cliente?.contactos[0]?.email || '');
	const [telefono, setTelefono] = useState(cliente?.contactos[0]?.telefono || '');
	const [direccion, setDireccion] = useState(cliente?.contactos[0]?.direccion || '');
	//TODO: Replace for usereducer dev.to/builderio/a-cure-for-react-usestate-hell-1ldi

	const getBody = () => {
		return {
			nroDocumentoFacturacion,
			tipoDocumentoFacturacion,
			razonSocial,
			tipo,
			nombreCompleto,
			nroDocumento,
			telefono,
			email,
			direccion,	
		};
	};

	const handleLimpiarForm = () => {
		setErrors([]);
		setNombreCompleto(cliente?.contactos[0]?.nombreCompleto || '');
		setNroDocumento(cliente?.contactos[0]?.nroDocumento || '');
		setTipoDocumento(cliente?.tipoDocumentoFacturacion || cliente_tipodocumentofacturacion_enum.NIT);
		setTipoCliente(cliente?.tipo || cliente_persona_enum.NATURAL);
		setRazonSocial(cliente?.razonSocial || '');
		setNroFacturacion(cliente?.nroDocumentoFacturacion || '');
		setEmail(cliente?.contactos[0]?.email || '');
		setTelefono(cliente?.contactos[0]?.telefono || '');
		setDireccion(cliente?.contactos[0]?.direccion || '');
	};

	const postName = 'Cliente';
	const postEndpoint = '/clientes/' + (cliente?.id || '');

	return (
		<Input handleClean={handleLimpiarForm} setShowNew={setShowNew} postName={postName} editar={!!cliente} getBody={getBody} endpoint={postEndpoint} setErrors={setErrors}>
			<p className='mt-2 font-bold'>Contacto Principal</p>
			<InputB value={nombreCompleto} handleChange={setNombreCompleto} placeholder="Nombre Completo" errors={errors} type="string" />
			<InputB value={nroDocumento} handleChange={setNroDocumento} placeholder="Nro. Documento" errors={errors} type="number" />
			<InputB value={email} handleChange={setEmail} placeholder="Correo" errors={errors} type="email" />
			<InputB value={telefono} handleChange={setTelefono} placeholder="Telefono" errors={errors} type="number" />
			<InputB value={direccion} handleChange={setDireccion} placeholder="Dirección" errors={errors} type="string" />
			<p className='mt-2 font-bold'>Datos Facturación</p>
			<InputB value={razonSocial} handleChange={setRazonSocial} placeholder="Razon Social" errors={errors} type="string" />
			<InputB value={nroDocumentoFacturacion} handleChange={setNroFacturacion} placeholder="Nro. Documento Facturación:" errors={errors} type="number" />
			<ComboBox setData={setTipoDocumento} value={tipoDocumentoFacturacion} options={Object.values(cliente_tipodocumentofacturacion_enum)} postName="Tipo documento" />
			<ComboBox setData={setTipoCliente} value={tipoDocumentoFacturacion} options={Object.values(cliente_persona_enum)} postName="Tipo Cliente" />
		</Input>
	);
}
