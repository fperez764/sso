/** @format */
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import Feeder from '../../components/SS/Feeder';
import Sidebar from '../../components/menues/Sidebar';
import axios from 'axios';
import { SolicitudServicio } from '../../../types/typesSSO';
import SSCard from '../../components/SS/SSCard';
import { useAuthState } from '../../context/auth';
import Input from '../../components/SS/Input';
import NavBar from '../../components/NavBar';
import { setServers } from 'dns';
import Widgets from '../../components/Widgets';
import ClienteWidget from '../../components/cliente/ClienteWidget';

export default function solicitudServicioPage() {
	const [solicitudes, setSolicitudes] = useState<SolicitudServicio[]>([]);
	const [sSseleccionado, setSSSeleccionado] = useState<SolicitudServicio | null>(null);
	const { authenticated, user } = useAuthState();
	const [input, setInput] = useState('');

	useEffect(() => {
		axios
			.get('/solicitudServicio')
			.then((res) => setSolicitudes(res.data))
			.catch((err) => console.log(err));
	}, []);

	const handleRefresh = async () => {
		const refreshToast = toast.loading('Actualizando...');
		//const solicitudes = await fetchSolicitudesServicio(Method.GET);
		setSolicitudes(solicitudes);
		toast.success('Solicitudes actualizadas', { id: refreshToast });
	};

	return (
		<div>
			<Head>
				<title>Solicitudes de Servicio</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Toaster />
				<Sidebar />
				<Feeder>
					<NavBar handleRefresh={handleRefresh} title="Solicitudes de Servicio" />
					<Input />
					{solicitudes.map((post: any) => (
						<div key={post.id} onClick={() => setSSSeleccionado(post)}>
							<SSCard post={post} />
						</div>
					))}
				</Feeder>
				<Widgets>
					{sSseleccionado && <ClienteWidget cliente={sSseleccionado.cliente} />}
					{/** TODO: por defecto si algun SS es seleccionado, muestra la ultima respuesta, si algun punto del timeline es seleccionado muestra esa respuesta */}
					{/** TODO: <SSWidget ss={sSseleccionado} que muestre los comentarios/> */}
				</Widgets>
			</main>
		</div>
	);
}
