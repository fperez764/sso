import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/menues/Sidebar';
import Widgets from '../components/Widgets';
import Table from '../components/Table';
import axios from 'axios';
import { Cliente } from '../../types/typesSSO';
import NavBar from '../components/NavBar';
import { RespuestaABEFAC } from '../../types/typesABEFAC';
import Feeder from '../components/SS/Feeder';
import FacturaCard from '../components/factura/FacturaCard';


export default function clientes({ resPagos }: RespuestaABEFAC | undefined) {
	const facturaManual = () =>{
        console.log('Por implementar');
    };
    const handleRefresh = () =>{
        console.log('Por implementar');
    };
    return (
		<div>
			<Head>
				<title>Clientes</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
                <Feeder 					titulo="Solicitudes de Servicio"
					accionNuevo="Nueva Factura"
					placeHolderNuevo="Datos factura manual"
					handleNew={facturaManual}
					handleRefresh={handleRefresh}
				>
					{resPagos.datos.map((post: any) => (
                        <>
                        <FacturaCard factura={post}/>
                        </>
					))}
                    {resPagos.error ? <p>{resPagos.error}</p> : <Table data={resPagos.datos}/>}
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
        const fechaInicial = new Date().setMonth(fechaFinal.getMonth() -1);
        const filtroFechas = '?fechaInicio=2022-10-01&fechaFin=2022-10-02';

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