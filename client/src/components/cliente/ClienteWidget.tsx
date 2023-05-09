/** @format */

import {
	ArrowDownIcon,
	ArrowLongUpIcon,
	EnvelopeIcon,
	FolderPlusIcon,
	IdentificationIcon,
	KeyIcon,
	MapPinIcon,
	PencilIcon,
	PhoneIcon,
	PlusIcon,
	TrashIcon,
	UserPlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Cliente, ClienteRSS, Persona, Roles } from '../../../types/typesSSO';
import { useAuthState } from '../../context/auth';
import { useEffect, useState } from 'react';
import Button from '../Button';
import NuevoClienteWidget from './NuevoClienteWidget';
import ClienteServicioWidget from '../servicio/ClienteServicioWidget';
import axios from 'axios';

interface Props {
	post: Cliente | ClienteRSS;
	acciones?: boolean;
}

export default function ClienteWidget({ post, acciones }: Props) {
	const { user } = useAuthState();
	const puedeEditar = user?.rol === Roles.ADMIN;
	const [editar, setEditar] = useState(false);
	const [cliente, setCliente] = useState(post);
	const porImplementar = async () => {
		toast.error(`Por implementar: url:/clientes/${sso ? cliente.nroDocumento : cliente.ci}`);
	};
	const [verMas, setVerMas] = useState(false);
	const sso = cliente && 'nombreCompleto' in cliente;

	useEffect(() => {
		if (!sso) getClienteSSO();
	}, []);

	useEffect(()=>{
		setCliente(post);
	},[post])

	const getClienteSSO = async () => {
		try {
			const res = await axios.get(`/clientes/${cliente.id}`);
			console.log(JSON.stringify(res));
			setCliente(res.data);
		} catch (error) {
			toast.error('Este cliente no tiene servicios asociados.\n' + JSON.stringify(error));
		}
	};

	if (!cliente) return <p>{JSON.stringify(post)}</p>;

	return editar && acciones && sso ? (
		<NuevoClienteWidget cliente={cliente} />
	) : (
		<div className="px-2 py-2 bg-gray-100 border-2 border-gray-200 rounded-md">
			<h2 className="text-xl font-bold">
				Cliente: {cliente.id} ({cliente.persona})
			</h2>
			<h4 className="font-bold text-[15px] sm:text-[16px] hover:underline cursor-pointer" onClick={porImplementar}>
				{(sso ? cliente.nombreCompleto : cliente.nombre) || 'Nombre Completo'}
			</h4>
			<div className="p-1 space-x-1 flex w-[80%] sm-w-full">
				{/*Info Personal*/}
				<div className="items-center w-1/2 whitespace-normal">
					<p className="font-bold">Datos de contacto:</p>
					{cliente.persona === Persona.EMPRESARIAL ? (
						<p>PERSONA: {JSON.stringify(cliente.persona)}</p>
					) : (
						<div className="flex">
							<IdentificationIcon className="h-4" />
							<span className="text-sm sm:text-[15px] overflow-auto ml-1">{(sso ? cliente.nroDocumento : cliente.ci) ?? 'Documento no registrado'}</span>
						</div>
					)}
					<div className="flex">
						<MapPinIcon className="h-4" />
						<p className="text-sm sm:text-[12px] overflow-hidden ml-1">{cliente.direccion ?? 'No registrada'}</p>
					</div>
					<div className="flex">
						<PhoneIcon className="h-4" />
						<p className="text-sm sm:text-[12px] overflow-hidden ml-1">{(sso ? cliente.telefono : cliente.fono_fijo) ?? 'No registrado'}</p>
					</div>
				</div>
				{/**Datos Facturacion*/}
				<div className="w-1/2">
					<h2 className="font-bold">Datos facturación:</h2>
					<h4 className="text-sm sm:text-[15px] whitespace-nowrap">Razon Social: {sso ? cliente.razonSocial : cliente.razon_social}</h4>
					<span className="text-sm sm:text-[15px]">
						Facturar a {sso ? cliente.tipoDocumentoFacturacion : cliente.tipo_documento}: {sso ? cliente.nroDocumentoFacturacion : cliente.nit}
					</span>
					<div className="flex">
						<EnvelopeIcon className="h-4" />

						<p className="text-sm sm:text-[12px] overflow-hidden ml-1">{cliente.email ?? 'Dirección de correo no registrada'}</p>
					</div>
				</div>
			</div>
			{/**Acciones Cliente */}
			{acciones && (
				<div className="flex justify-center h-12 w-[80%] sm-w-full">
					{puedeEditar ? <Button Icon={PencilIcon} onClick={() => setEditar(true)} /> : null}
					<Button Icon={TrashIcon} onClick={porImplementar} />
					<Button Icon={KeyIcon} onClick={porImplementar} />
					{verMas ? <Button Icon={ArrowLongUpIcon} onClick={() => setVerMas(false)} /> : <Button Icon={PlusIcon} onClick={() => setVerMas(true)} />}
				</div>
			)}
			{/**Solicitudes de Servicios*/}
			{verMas && (
				<div>
					<div className="my-2 ml-2 font-bold border-b border-gray-500">
						<h4>Solicitudes Servicio:</h4>
						<Button Icon={PlusIcon} onClick={porImplementar} title="Solicitud de Servicio" />
						{/**
                    {clienteSeleccionado && getSSCliente(clienteSeleccionado.id)
                        .map(sSCliente=> (<sSWidget solicitudS={sSCliente}/>)) 
                    */}
					</div>
					{/**Facturas*/}
					<div className="my-2 ml-2 font-bold border-b border-gray-500">
						<h4>Facturas:</h4>
						{/**
                    {clienteSeleccionado && getFacturasCliente(clienteSeleccionado.id)
                        .map(facturaCliente=> (<FacturaWidget factura={facturaCliente} resumida={true}/>)) 
                    */}
						<Button Icon={ArrowDownIcon} onClick={porImplementar} title="Reporte facturas" />
					</div>
					{/**Actualizar datos Contacto*/}
					<div className="self-center font-bold border-b border-gray-500">
						<Button Icon={UserPlusIcon} onClick={porImplementar} title="Agregar contactos" />
					</div>
					{/**Documentos*/}
					<div className="my-2 ml-2 font-bold border-b border-gray-500">
						<h4 className="font-bold">Documentos:</h4>
						<Button Icon={FolderPlusIcon} onClick={porImplementar} title="Agregar Documentos" />
					</div>
				</div>
			)}
			{/**Servicios*/}
			<div className="my-2 ml-2 border-b border-gray-500">
				<h4 className="font-bold">Servicios:</h4>
				{cliente?.clienteServicios?.map((cliServicio) => (
					<ClienteServicioWidget clienteServicio={cliServicio} />
				))}
			</div>
		</div>
	);
}
