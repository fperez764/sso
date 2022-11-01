import Head from 'next/head';
import { toast, Toaster } from 'react-hot-toast';
import Sidebar from '../components/menues/Sidebar';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Feeder from '../components/SS/Feeder';
import { useEffect, useState } from 'react';
import ServicioCard from '../components/servicio/ServicioCard';
import { Servicio } from '../../types/typesSSO';
import Widgets from '../components/Widgets';
import ServicioWidget from '../components/servicio/ServicioWidget';
import CategoriaWidget from '../components/servicio/CategoriaWidget';

export default function ServiciosPage() {
	const getServicios = async () => {
		const tGetServicios = toast.loading('Obtener Servicios');
		let ServiciosRes = [];
		try {
			const res = await axios.get('/servicio');
			console.log(JSON.stringify(res));
			ServiciosRes = res.data;
			toast.success(`Se encontraron ${res.data.length} registros.`, { id: tGetServicios });
		} catch (e) {
			console.log('Error al cargar Servicios' + e);
			return { Servicios: { error:'No se pudieron recuperar Servicios desde BD' } };	
		}
		setServiciosABE(ServiciosRes);
	};

	useEffect(()=> { getServicios(); }, []);

	const [serviciosABE, setServiciosABE] = useState<Servicio[]>([]);
	const [servicioseleccionado, setServicioseleccionado] = useState<Servicio|null>(null);
	return (
		<div>
			<Head>
				<title>Servicios</title>
			</Head>
			<Toaster /> 
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<Feeder>
					<NavBar title="Servicios" handleRefresh={getServicios} exportData={serviciosABE} showKey='nombre'/>
					{serviciosABE.map(serv => (
						<div key={serv.id} onClick={() => setServicioseleccionado(serv)}>
							<ServicioCard servicio={serv} />
						</div>
					))}
				</Feeder>
				<Widgets>
						{servicioseleccionado && <>
						<CategoriaWidget categoria={servicioseleccionado.categoria} />
						<ServicioWidget servicio={servicioseleccionado} />
						</>}
				</Widgets> 
			</main>
		</div>
	);
}
