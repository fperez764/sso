'use client';
import { ClienteServicioTicket, ClienteServicioTicketAccion } from '../../../../types/typesSSO';
import AccionWidget from '../../../components/flujos/AccionWidget';
import SolicitudTicketCard from '../../../components/flujos/SolicitudTicketCard';
import ClienteWidget from '../../../components/cliente/ClienteWidget';
import Head from 'next/head';
import Sidebar from '../../../components/menues/Sidebar';
import Feeder from '../../../components/Feeder';
import { useEffect, useState } from 'react';
import { getTicket } from '@src/app/api/tickets/tickets';

const postName = 'Ticket';
const postEndpoint = '/tickets';
const clienteEndpoint = '/cliente'
interface pageProps {
    params: {id: string}
}

export default function TicketPage({params}: pageProps) {
	const [ticket, setTicket] = useState<ClienteServicioTicket | null>();
	const [subPost, setSubPost] = useState<ClienteServicioTicketAccion|null>(null);
	const [editSubPost, setEditSubPost] = useState(false);


	const handleRefresh = async () => {
		if(!params.id) return;
		const resTicket = await getTicket(params.id);			
		setTicket(resTicket.data);
	};

	useEffect(() => {
		handleRefresh();
	},[params])

	return (
		<div>
			<Head>
				<title>{postName}</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<div className="px-6">
				<Feeder>
					{ticket ? (
						<>
							{ticket?.clienteServicio?.cliente && <ClienteWidget cliente={ticket?.clienteServicio?.cliente} handleFeedRefresh={handleRefresh}/>}
							<SolicitudTicketCard post={ticket} setSelectedSubPost={setSubPost} selectedSubPost={subPost} setEditSubPost={setEditSubPost} editSubPost={editSubPost} />
							{subPost ? (
								<>
									<AccionWidget cliente={ticket?.clienteServicio?.cliente} accion={subPost} setShowEdit={setEditSubPost} showEdit={editSubPost} ticket={ticket} handleFeederRefresh={handleRefresh} />
								</>
							) : null}
						</>
					) : (
						<p className='h-full'>Cargando...{params.id}</p>
					)}
				</Feeder>
				</div>
			</main>
		</div>
	);
}
