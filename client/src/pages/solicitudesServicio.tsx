/** @format */

import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Feeder from '../components/Feeder';
import Sidebar from '../components/Sidebar';

const posts = [
	{
		id: '1',
		name: 'Snoopy',
		username: 'joe.cool',
		userImg: 'https://upload.wikimedia.org/wikipedia/en/5/53/Snoopy_Peanuts.png',
		img: 'https://eldeber.com.bo/_next/image?url=https%3A%2F%2Fstatic.eldeber.com.bo%2FFiles%2FSizes%2F2020%2F10%2F4%2Fsnoopy-_204191699_760x520.jpg&w=640&q=75',
		text: 'Snoopy cumple 70 años',
		timestamp: '2022-09-09',
	},
	{
		id: '2',
		name: 'Carlitos',
		username: 'charlie.brown',
		userImg: 'https://charactersdb.com/wp-content/uploads/charlie-brown-peanuts-character.jpg',
		img: 'https://cdn.mos.cms.futurecdn.net/Tcozd4LBkhqZuf79iBP9J8-650-80.jpg.webp',
		text: 'Space',
		timestamp: '2022-09-07',
	},
];

export default function solicitudesServicio() {
	const [solicitudes, setSolicitudes] = useState([]);
	const { data: session } = useSession();

	const handleRefresh = async () => {
		const refreshToast = toast.loading('Actualizando...');
		//const solicitudes = await fetchSolicitudesServicio(Method.GET);
		setSolicitudes(solicitudes);
		toast.success('Solicitudes actualizadas', { id: refreshToast });
	};

	const sendSS = async () => {
		//const imageRef = ref('storage', `posts/${session?.user.name}/image`);
		// if (selectedFile) {
		//     await uploadString(imageRef, selectedFile, 'data_url');
		//     const downloadURL = await getDownloadURL(imageRed);
		//     await updateDoc(doc(db, 'posts', docRef.id), {
		//         image: downloadURL,
		//     });
		// }
		setTimeout(() => {
			console.log('test sendSS');
		}, 5000);
	};

	const postSS = async () => {
		if (!session) return;
		const sSBody = {
			usuario_creacion: session.user.name,
		};
		const result = await fetch('api/solicitudServicio', {
			body: JSON.stringify(sSBody),
			method: 'POST',
		});
		const json = await result.json();
	};

	return (
		<div>
			<Head>
				<title>Solicitudes de Servicio ABE</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<Feeder
					titulo="Solicitudes de Servicio"
					accionNuevo="Crear nuevo SS"
					placeHolderNuevo="Descripcion de nueva solicitud de servicio"
					posts={posts}
					handleNew={sendSS}
					handleRefresh={handleRefresh}
				/>
				<div className="top-0 z-10 flex items-center justify-center h-12 px-3 bg-white">
					<Link href="/auth/login">
						<a className="w-24 hollow blue boton">Inicia Sesion</a>
					</Link>
					<Link href="/auth/register">
						<a className="w-20 blue boton">Registrate</a>
					</Link>
				</div>
			</main>
		</div>
	);
}
