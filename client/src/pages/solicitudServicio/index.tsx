/** @format */
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Feeder from '../../components/SS/Feeder';
import Sidebar from '../../components/menues/Sidebar';
import axios from 'axios';
import { SolicitudServicio } from '../../../types/typesSSO';
import SSCard from '../../components/SS/SSCard';
import { useAuthState } from '../../context/auth';
import Input from '../../components/SS/Input';
import NavBar from '../../components/NavBar';

export default function solicitudesServicio() {
	const [solicitudes, setSolicitudes] = useState<SolicitudServicio[]>([]);
	const { authenticated, user } = useAuthState();

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
		if (!user) return;
		const sSBody = {
			usuarioCreacion: user.username,
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
				<title>Solicitudes de Servicio</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<Feeder>
					<NavBar handleRefresh={handleRefresh} title="Solicitudes de Servicio" />
					<Input
						title="Solicitudes de Servicio"
						handleNew={sendSS}
						placeholder="Descripcion de nueva solicitud de servicio"
					/>
					{solicitudes.map((post: any) => (
						<SSCard post={post} key={post.id} />
					))}
				</Feeder>
			</main>
		</div>
	);
}
