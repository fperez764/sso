import { Cliente } from '../../../types/typesSSO';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../../components/menues/Sidebar';
import Feeder from '../../components/Feeder';
import NavBar from '../../components/NavBar';
import logger from '../../utils/logger';
import { useEffect, useState } from 'react';

interface PropsSS {
	post: Cliente;
	setSelectedSubPost: () => void;
	selectedPost: Cliente;
	handleInputCancel: () => void;
	errors: any;
}
interface Props{
    posts: any;
}


export default function Clientes({ posts } : Props) {
	const [clientes, setClientes] = useState({});
	async function getClientesRSS() {
		try {
			const data = await fetch('http://localhost:3000/api/RSS/getClientesRSS');
			console.log(data);
			setClientes(data);
		} catch (error) {
			logger.error(error);
		}
	}

	useEffect(() => {
		getClientesRSS();
	}, []);

	return (
		<div>
		<Head>
			<title>Clientes RSS</title>
		</Head>
		<Toaster />
		<main className="flex min-h-screen mx-auto">
			<Sidebar />
			<Feeder>
				<NavBar 
				title="Clientes" 
				handleRefresh={getClientesRSS} 
				data={clientes} 
				setData={()=>{}} 
				filterKey={['cliente', 'razonSocial']}
				filterKeyId = 'numeroFactura'
				/>
				{JSON.stringify(clientes)}
			</Feeder>
		</main>
		<button onClick={() => getClientesRSS()} className="text-white bg-blue-300 rounded-full">DoClient</button>
		</div>
	);
}