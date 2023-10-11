'use client';
import {
	ArrowDownIcon,
	ArrowLongUpIcon,
	FolderPlusIcon,
	PlusIcon,
	UserPlusIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import { Cliente, cliente_persona_enum, users_rol_enum } from '../../../types/typesSSO';
import { useAuthState } from '../../context/auth';
import { useEffect, useState } from 'react';
import Button from '../ui/Button';
import NuevoClienteWidget from './NuevoClienteWidget';
import ClienteServicioWidget from '../servicio/ClienteServicioWidget';
import Icons from '../ui/Icons';
import NuevoClienteServicioWidget from '../servicio/NuevoClienteServicioWidget';
import ClienteInfo from './ClienteInfo';
import { eliminarCliente, getCliente } from '@src/app/api/clientes/clientes';

interface Props {
	cliente: Cliente;
	handleFeedRefresh?: ()=>void;
}

export default function ClienteWidget({ cliente: post, handleFeedRefresh }: Props) {
	const { user } = useAuthState();
	const admin = user?.rol === users_rol_enum.ADMIN;
	const notFuncionario = user?.rol !== users_rol_enum.FUNCIONARIO;
	const [editar, setEditar] = useState(false);
	const [cliente, setCliente] = useState(post);
	const [nuevoServicio, setNuevoServicio] = useState(false);
	const porImplementar = async () => {
		toast.error(`Por implementar: url:/clientes/${cliente?.contactos[0]?.nroDocumento}`);
	};
	const [verMas, setVerMas] = useState(false);

	useEffect(() => {
		refreshCliente();
	}, [post, editar]);
	
	const refreshCliente = async()=>{ 
		setCliente(await getCliente(post.id) || post);
	}


	if (!cliente) return <p>Cliente invalido</p>;
	if(cliente.usuarioBaja) return <p className='bg-red-500'>Cliente eliminado</p>
	return <div className="px-2 py-2 bg-gray-100 border-2 border-gray-200 rounded-md">
		<div className="p-1 space-x-1 flex w-[80%] sm-w-full">
			<ClienteInfo cliente={cliente}/> 
		</div>
		{/**Acciones Cliente */}
		<Icons
			name="Cliente"
			handleEdit={() => {
				setEditar(true);
			}}
			handleNullify={() => {
				if(!confirm(`Seguro que desea eliminar al cliente ${cliente.razonSocial} con id ${cliente.id}`))
					return;
				eliminarCliente(cliente.id);
				!!handleFeedRefresh && handleFeedRefresh();
			}}
			handleCancelEdit={() => {
				setEditar(false);
			}}
		/>
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
				<ClienteServicioWidget  key={cliServicio.id} clienteServicio={cliServicio} />
			))}
			{notFuncionario && <Button onClick={()=>setNuevoServicio(!nuevoServicio)} Icon={nuevoServicio ? ArrowLongUpIcon : PlusIcon } title={nuevoServicio ? 'Cancelar': 'Agregar Servicio'} className='mt-6 mb-2'/>}
		</div>
		{editar && <NuevoClienteWidget cliente={cliente} setShowNew={setEditar}/>}
		{nuevoServicio && <NuevoClienteServicioWidget cliente={post} handleRefresh={handleFeedRefresh}/>}
	</div>
}
