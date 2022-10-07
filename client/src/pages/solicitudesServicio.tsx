/** @format */

import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Feeder from '../components/Feeder';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { SolicitudServicio } from '../../types/types';
import SolicitudTimeline from '../components/SolicitudTimeline';

export default function solicitudesServicio() {
	const [solicitudes, setSolicitudes] = useState<SolicitudServicio[]>([]);
	const { data: session } = useSession();

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
					posts={solicitudes}
					handleNew={sendSS}
					handleRefresh={handleRefresh}
				/>
			</main>
		</div>
	);
}
