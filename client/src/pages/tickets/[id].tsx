import { ClienteServicioTicket } from '../../../types/typesSSO';
import RespuestaWidget from '../../components/flujos/RespuestaWidget';
import SolicitudTicketCard from '../../components/flujos/SolicitudTicketCard';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import Head from 'next/head';
import Sidebar from '../../components/menues/Sidebar';
import Feeder from '../../components/Feeder';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useEffect, useState } from 'react';

const postName = 'Ticket';
const postEndpoint = '/tickets';

export default function TicketPage() {
	const [post, setPost] = useState<ClienteServicioTicket | null>();
	const [subPost, setSubPost] = useState();
	const [editSubPost, setEditSubPost] = useState(false);
	const router = useRouter();
	const { id } = router.query;

	useEffect(() => {
		handleRefresh();
	}, [router.isReady]);

	const handleRefresh = async () => {
		if(!id) return;
		const res = await axios.get(`${postEndpoint}/${id}`);
		setPost(res.data);
	};

	return (
		<div>
			<Head>
				<title>{postName}</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				{/*<Toaster />*/}
				<Sidebar />
				<Feeder>
					{post ? (
						<>
							<ClienteWidget post={post.clienteServicio.cliente} />
							<SolicitudTicketCard post={post} setSelectedSubPost={setSubPost} selectedSubPost={subPost || post.respuestas[0]} setEditSubPost={setEditSubPost} editSubPost={editSubPost} />
							{subPost ? (
								<>
									<RespuestaWidget respuesta={subPost} setShowEdit={setEditSubPost} showEdit={editSubPost} post={post} handleFeederRefresh={handleRefresh} />
								</>
							) : null}
						</>
					) : (
						<p>Cargando...{id}</p>
					)}
				</Feeder>
			</main>
		</div>
	);
}
