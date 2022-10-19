import Head from 'next/head';
import Sidebar from '../components/menues/Sidebar';
import axios from 'axios';
import { Factura, RespuestaABEFAC } from '../../types/typesABEFAC';
import Feeder from '../components/SS/Feeder';
import FacturaCard from '../components/factura/FacturaCard';
import NavBar from '../components/NavBar';
import { toast, Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { Cliente } from '../../types/typesSSO';
import ClienteWidget from '../components/clientes/ClienteWidget';
import FacturaWidget from '../components/factura/FacturaWidget';
import Widgets from '../components/Widgets';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props{
    resABEFAC: RespuestaABEFAC;
}

export default function reporteFacturacion({ resABEFAC } : Props) {
    const [resFacturas, setResFacturas] = useState<Factura[]>(resABEFAC.datos);
    const [fechaInicial, setFechaInicial] = useState(new Date());
    const [fechaFinal,  setFechaFinal] = useState(new Date());
    const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura|null>(null);
    const [clienteFactura, setClienteFactura] = useState<Cliente|null>(null);

    const getFacturas = async() =>{
        const tGetFacturas = toast.loading(`Obteniendo facturas entre ${dayjs(fechaFinal)
            .format('YYYY-MMMM-DD')} y ${dayjs(fechaFinal).format('YYYY-MMMM-DD')}`);
    
        const res = await getServerSideProps(fechaInicial, fechaFinal);
        toast.success('', { id: tGetFacturas });
    };

	const facturaManual = () =>{
        toast.error('Por implementar');
    };
    
    const selectFactura = async(factura: Factura)=>{
        const res = await axios.get('cliente/' + factura.cliente.idCuenta);
        setClienteFactura(res.data);
        setFacturaSeleccionada(factura);
    };

    return (
		<div>
			<Head>
				<title>Facturación</title>
			</Head>
            <Toaster />
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
                <Feeder>
                    <NavBar title="Reporte Facturación" handleRefresh={getFacturas} exportData={resFacturas}/>
					{resFacturas?.map((post: Factura) => (
                        <div key={post.id} onClick={() => selectFactura(post)}>
                            <FacturaCard factura={post}/>
                        </div>
					)).reverse()}
				</Feeder>
                <Widgets>
                    <div className='sticky top-0 bg-white z-50'>
                    {facturaSeleccionada && <FacturaWidget factura={facturaSeleccionada}/>}
                    </div>
                    {clienteFactura && <ClienteWidget cliente={clienteFactura}/>}
				</Widgets> 
			</main>
		</div>
	);
}

export const getServerSideProps = async (fechaInicial: Date | null, fechaFinal: Date | null) => {
    try{    
        const fFinal = new Date();
        const fInicial = new Date().setDate(new Date().getDate() - 1);
        const filtroFechas = `?fechaInicio=${
            dayjs(fInicial).format('YYYY-MM-DD')
        }&fechaFin=${dayjs(fFinal).format('YYYY-MM-DD')}`;
        console.log('obtener facturas aca: ' + process.env.FACTURACION_URL_BASE + process.env.FACTURACION_GET_FACTURAS + filtroFechas);       
        const instance = axios.create({
            baseURL: process.env.FACTURACION_URL_BASE,
            timeout: 10000,
            headers: { 'Authorization': 'Bearer '+ process.env.FACTURACION_TOKEN },
        });
        const res = await instance.get(process.env.FACTURACION_GET_FACTURAS + filtroFechas);
        console.log(res.data.mensaje);
        return { props: { resABEFAC: res.data } };
    } catch (e) {
        console.log('Error al cargar facturas: ' + e);
        return { props: { error:'Error ' + e } };
    }
};