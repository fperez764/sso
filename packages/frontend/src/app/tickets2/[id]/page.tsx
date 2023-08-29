import { Cliente, ClienteServicioTicket, ClienteServicioTicketAccion } from '../../../../types/typesSSO';
import AccionWidget from '../../../components/flujos/AccionWidget';
import SolicitudTicketCard from '../../../components/flujos/SolicitudTicketCard';
import ClienteWidget from '../../../components/cliente/ClienteWidget';
import Head from 'next/head';
import Sidebar from '../../../components/menues/Sidebar';
import Feeder from '../../../components/Feeder';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const postName = 'Ticket';
const postEndpoint = '/tickets';
const clienteEndpoint = '/cliente'

export default function TicketPage() {
	const [ticket, setTicket] = useState<ClienteServicioTicket | null>();
	const [subPost, setSubPost] = useState<ClienteServicioTicketAccion|null>(null);
	const [editSubPost, setEditSubPost] = useState(false);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		handleRefresh();
	}, [router.isReady]);

	const handleRefresh = async () => {
		if(!id) return;
		const resTicket = await axios.get(`${postEndpoint}/${id}`);
		setTicket(resTicket.data);
	};

	return (
		<div>
			<Head>
				<title>{postName}</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				{/*<Toaster />*/}
				<Sidebar />
				<div className="px-6">
				<Feeder>
					{ticket ? (
						<>
							<ClienteWidget cliente={ticket.clienteServicio.cliente} handleFeedRefresh={handleRefresh}/>
							<SolicitudTicketCard post={ticket} setSelectedSubPost={setSubPost} selectedSubPost={subPost || ticket.acciones[0]} setEditSubPost={setEditSubPost} editSubPost={editSubPost} />
							{subPost ? (
								<>
									<AccionWidget cliente={ticket.clienteServicio.cliente} accion={subPost} setShowEdit={setEditSubPost} showEdit={editSubPost} post={ticket} handleFeederRefresh={handleRefresh} />
								</>
							) : null}
						</>
					) : (
						<p>Cargando...{id}</p>
					)}
				</Feeder>
				</div>
			</main>
		</div>
	);
}
