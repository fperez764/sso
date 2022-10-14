import Head from 'next/head';
import Sidebar from '../components/menues/Sidebar';
import axios from 'axios';
import { RespuestaABEFAC } from '../../types/typesABEFAC';
import Feeder from '../components/SS/Feeder';
import FacturaCard from '../components/factura/FacturaCard';
import NavBar from '../components/NavBar';
import { toast, Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale(es);
dayjs.extend(relativeTime);

export default function clientes({ resPagos }: RespuestaABEFAC | undefined) {
	const facturaManual = () =>{
        toast.error('Por implementar');
    };
    const handleRefresh = () =>{
        toast.error('Por implementar');
    };
    return (
		<div>
			<Head>
				<title>Clientes</title>
			</Head>
            <Toaster />
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
                <Feeder>
                    <NavBar titulo="Reporte Facturación" handleRefresh={handleRefresh} exportData={resPagos}/>
					{resPagos.datos.map((post: any) => (
                        <>
                        <FacturaCard factura={post}/>
                        </>
					)).reverse()}
				</Feeder>

			</main>
		</div>
	);
}

export async function getServerSideProps() {
	console.log('obtener facturas');
	let resPagos = {};
    try {
        const fechaFinal = new Date();
        const fechaInicial = new Date().setDate(fechaFinal.getDate() -1);
        const filtroFechas = `?fechaInicio=${
            dayjs(fechaInicial).format('YYYY-MM-DD')
        }&fechaFin=${dayjs(fechaFinal).format('YYYY-MM-DD')}`;

        const instance = axios.create({
            baseURL: process.env.FACTURACION_URL_BASE,
            timeout: 10000,
            headers: { 'Authorization': 'Bearer '+ process.env.FACTURACION_TOKEN },
        });
        
        const res = await instance.get(process.env.FACTURACION_GET_FACTURAS + filtroFechas);
        console.log(res);
		resPagos = res.data;
    } catch (e) {
        console.log('Error al cargar facturas: ' + e);
        return { props: { resPagos: { error:'No se pudieron cargar los servicios' } } };
    }
    return {
        props: { resPagos },
    };
}