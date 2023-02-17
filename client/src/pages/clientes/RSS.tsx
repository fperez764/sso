import ClienteCard from '../../components/cliente/ClienteCard';
import { Cliente } from '../../../types/typesSSO';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import MainIndex from '../../components/MainIndex';
import NuevoClienteWidget from '../../components/cliente/NuevoClienteWidget';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../../components/menues/Sidebar';
import Feeder from '../../components/Feeder';
import NavBar from '../../components/NavBar';
import logger from '../../utils/logger';

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

const postName = 'Clientes';
const postEndpoint = '/clientes';
const filterKey = 'nombreCompleto';

export default function Clientes({ posts } : Props) {
	const feederChildren = ({ post }: PropsSS) => {
		return (
			<ClienteCard cliente={post} />
		);
	};

	const widgetChildren = ({ selectedPost }: PropsSS) => {
		return (
			<ClienteWidget cliente={selectedPost}/>
		);
	};

	const newWidgetChildren = ({ handleInputCancel, selectedPost }: PropsSS) => {
		return (<NuevoClienteWidget handleCancel={handleInputCancel} cliente={selectedPost}/>)
	};

	async function getCliente() {
		try {
			const data = fetch('http://localhost:3000/api/RSS/getClientesRSS');
			logger.debug(data);
		} catch (error) {
			logger.error(error);
		}
	}

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
				handleRefresh={getFacturas} 
				data={posts.datos} 
				setData={setResFacturas} 
				filterKey={['cliente', 'razonSocial']}
				filterKeyId = 'numeroFactura'
				>
				{datePeriodMenu}
				</NavBar>
				{resFacturas?.map((post: Factura) => (
					<div key={post.id} onClick={() => selectFactura(post)}>
						<FacturaCard factura={post}/>
					</div>
				)).reverse()}
			</Feeder>
			<Widgets>
				<div className='sticky top-0 z-50 bg-gray-100'>
				{facturaSeleccionada && <FacturaWidget factura={facturaSeleccionada}/>}
				</div>
				{clienteFactura && <ClienteWidget cliente={clienteFactura}/>}
			</Widgets> 
		</main>
		<button onClick={() => getCliente()} className="text-white bg-blue-300 rounded-full">DoClient</button>
		</div>
	);
}