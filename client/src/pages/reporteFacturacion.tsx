import { useSession } from 'next-auth/react';
import Head from 'next/head';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/menues/Sidebar';
import Widgets from '../components/Widgets';
import Table from '../components/Table';
import axios from 'axios';
import { Cliente } from '../../types/types';
import NavBar from '../components/NavBar';


interface RespuestaPagos{
    finalizado: boolean;
    codigo: number;
    timestamp: string;
    mensaje: string;
    datos: Facturas[];
}

interface Facturas{
    fechaCreacion: string;
    id: string;
    idOperacionPago: string;
    sistema: string;
    montoTotal: number;
    pagado: boolean;
    descripcion: string;
    cuf: string | undefined;
    numeroFactura: number | undefined;
    urlPdf: string | undefined;
    urlXml: string | undefined;
    fechaEmision: string;
    fechaAnulacion: string | undefined;
    observacion: string | undefined;
    estado: string;
    usuarioEmision: string;
    usuarioAnulacion: string | undefined;
    errorEnvio: string | undefined;
    cliente: ClienteFactura;
    facturaDetalles: FacturaDetalles[];
}

interface ClienteFactura{
        tipoDocumento: string;
        nroDocumento: string;
        razonSocial: string;
        idCuenta: number;
}
interface FacturaDetalles{
      codigo: string;
}


export default function clientes({ resPagos }: RespuestaPagos | undefined) {
	return (
		<div>
			<Head>
				<title>Clientes</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<div className="pl-4 xl:ml-[260px] border-l border-r border-gray-200  xl:min-w-[1226px] lg:min-w-[826px] sm:ml-[73px] flex-grow max-w-xl">
				    <NavBar titulo="Facturacion Electrónica"/>
                    {resPagos.error ? <p>{resPagos.error}</p> : <Table data={resPagos.datos}/>}
				</div>
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
        const filtroFechas = '?fechaInicio=2022-10-01&fechaFin=2022-10-05';

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