/** @format */

import { Cliente } from '../../../types/typesSSO';
import Head from 'next/head';
import Sidebar from '../../components/menues/Sidebar';
import Feeder from '../../components/Feeder';
import NavBar from '../../components/NavBar';

import { useEffect, useState } from 'react';
import ClienteCard from '../../components/cliente/ClienteCard';
import Widgets from '../../components/Widgets';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import { useAuthState } from '../../context/auth';
import NuevoClienteWidget from '../../components/cliente/NuevoClienteWidget';
import { XCircleIcon } from '@heroicons/react/24/outline';
import toastCard from '../../components/ToastCard';

interface Props {
	posts: any;
}

export default function Clientes({ posts }: Props) {
	const { user } = useAuthState();
	const [clientes, setClientes] = useState<Cliente[] | null>(null);
	const [selected, setSelected] = useState<Cliente | null>(null);
	const [showNew, setShowNew] = useState(false);
	const [blockClose, setBlockClose] = useState(false);
	async function getClientesRSS() {
		try {
			const data = await fetch('http://localhost:3000/api/RSS/getClientesRSS');
			const nClientes = await data.json();
			setClientes(nClientes);
		} catch (error) {
			console.error(error);
		}
	}
	const dialogoCerrarWidgets = () => {
		console.log('Bloquear: ' + blockClose);
		if (blockClose) {
			//Confirmar
			toastCard(<></>, 'Desea cerrar el panel de detalles? Perdera los cambios no guardados.', () => {
				setSelected(null);
				setShowNew(false);
			});
			return;
		}
		setSelected(null);
		setShowNew(false);
	};

	useEffect(() => {
		getClientesRSS();
	}, []);

	return (
		<div>
			<Head>
				<title>Clientes RSS</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<Feeder>
					<NavBar title="Clientes" handleRefresh={getClientesRSS} data={clientes} setData={setClientes} filterKey={['cliente', 'razon_social']} filterKeyId="numeroFactura" />
					{clientes &&
						clientes.map((cliente: any) => (
							<div key={cliente.id} onClick={() => setSelected(cliente)}>
								<ClienteCard cliente={cliente} />
							</div>
						))}
				</Feeder>
				{selected || showNew ? (
					<>
						<Widgets>
							{selected && !showNew ? <ClienteWidget post={selected} setBlockClose={setBlockClose} /> : null}
							{showNew && user ? <NuevoClienteWidget cliente={selected} setBlockClose={setBlockClose} /> : null}
						</Widgets>
						<XCircleIcon className={`absolute w-12 top-0 right-0 cursor-pointer ${blockClose ? 'text-red-400' : 'text-gray-400'}`} onClick={dialogoCerrarWidgets} />
					</>
				) : (
					<p className="w-32 p-2 mt-64 font-bold text-center text-gray-400">Seleccione algún elemento para ver sus detalles</p>
				)}
			</main>
			<button onClick={() => getClientesRSS()} className="text-white bg-blue-300 rounded-full">
				DoClient
			</button>
		</div>
	);
}
