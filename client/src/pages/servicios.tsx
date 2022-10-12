import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/menues/Sidebar';
import Widgets from '../components/Widgets';
import Table from '../components/Table';
import axios from 'axios';
import { Servicio } from '../../types/typesSSO';
import NavBar from '../components/NavBar';

export default function Servicios({ serviciosABE }: Servicio[] | undefined) {
	return (
		<div>
			<Head>
				<title>Servicios</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<div className="pl-4 xl:ml-[260px] border-l border-r border-gray-200  xl:min-w-[1226px] lg:min-w-[826px] sm:ml-[73px] flex-grow max-w-xl">
				<NavBar titulo="Servicios"/>
				{serviciosABE.error ? <p>{serviciosABE.error}</p> : <Table data={serviciosABE} />}
				</div>
			</main>
		</div>
	);
}
export async function getServerSideProps() {
	console.log('obtener Servicios');
	let serviciosABE;
    try {
        const res = await axios.get('/servicio');
		serviciosABE = res.data;
        console.log(serviciosABE);
    } catch (e) {
        console.log('Error al cargar Servicios' + e);
        return { props: { serviciosABE: { error:'No se pudieron cargar los servicios' } } };
    }
    return {
        props: { serviciosABE },
    };
}