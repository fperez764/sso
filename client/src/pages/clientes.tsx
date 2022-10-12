import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/menues/Sidebar';
import Widgets from '../components/Widgets';
import Table from '../components/Table';
import axios from 'axios';
import { Cliente } from '../../types/typesSSO';
import NavBar from '../components/NavBar';

export default function clientes({ clientesABE }: Cliente[]) {
	return (
		<div>
			<Head>
				<title>Clientes</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<div className="pl-4 xl:ml-[260px] border-l border-r border-gray-200  xl:min-w-[1226px] lg:min-w-[826px] sm:ml-[73px] flex-grow max-w-xl">
					<NavBar titulo="Clientes"/>
					{clientesABE.error ? <p>{clientesABE.error}</p> : <Table data={clientesABE} />}
				</div>
			</main>
		</div>
	);
}
export async function getServerSideProps() {
	console.log('obtener clientes');
	let clientesABE;
    try {
        const res = await axios.get('/cliente');
		clientesABE = res.data;
    } catch (e) {
        console.log('Error al cargar clientes' + e);
		return { props: { clientesABE: { error:'No se pudieron cargar los servicios' } } };

    }
    return {
        props: { clientesABE },
    };
}