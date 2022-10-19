import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '../components/menues/Sidebar';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Feeder from '../components/SS/Feeder';
import { useState } from 'react';
import ClienteCard from '../components/cliente/ClienteCard';
import { Cliente } from '../../types/typesSSO';
import Widgets from '../components/Widgets';
import ClienteWidget from '../components/cliente/ClienteWidget';

export default function Clientes() {
	const getClientes = async () => {
		const tGetClientes = toast.loading('Obtener clientes');
		let clientesRes = [];
		try {
			const res = await axios.get('/cliente');
			console.log(JSON.stringify(res));
			clientesRes = res.data;
			toast.success(`Se encontraron ${res.data.length} registros.`, { id: tGetClientes });
		} catch (e) {
			console.log('Error al cargar clientes' + e);
			return { clientes: { error:'No se pudieron recuperar clientes desde BD' } };	
		}
		setClientesABE(clientesRes);
	};

	const [clientesABE, setClientesABE] = useState<Cliente[]>([]);
	const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente|null>(null);
	return (
		<div>
			<Head>
				<title>Clientes</title>
			</Head>
			<Toaster /> 
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<Feeder>
					<NavBar title="Clientes" handleRefresh={getClientes} exportData={clientesABE}/>
					{clientesABE.map(cli => (
						<div key={cli.id} onClick={() => setClienteSeleccionado(cli)}>
							<ClienteCard cliente={cli} />
						</div>
					))}
				</Feeder>
				<Widgets>
						{clienteSeleccionado && <ClienteWidget cliente={clienteSeleccionado}/>}
				</Widgets> 
			</main>
		</div>
	);
}
