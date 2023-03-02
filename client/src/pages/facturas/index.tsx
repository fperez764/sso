import Head from 'next/head';
import Sidebar from '../../components/menues/Sidebar';
import axios from 'axios';
import { Factura, RespuestaABEFAC } from '../../../types/typesABEFAC';
import Feeder from '../../components/Feeder';
import FacturaCard from '../../components/factura/FacturaCard';
import NavBar from '../../components/NavBar';
import { toast, Toaster } from 'react-hot-toast';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useState } from 'react';
import { Cliente } from '../../../types/typesSSO';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import FacturaWidget from '../../components/factura/FacturaWidget';
import Widgets from '../../components/Widgets';
import { getFacturasAPI } from '../api/facturas';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props{
    posts: RespuestaABEFAC;
}

export default function reporteFacturacion({ posts } : Props) {
    const [resFacturas, setResFacturas] = useState<Factura[]>(posts.datos);
    const [fechaFin,  setFechaFin] = useState<Date>(new Date());
    let yesterday = new Date();
    yesterday.setDate(new Date().getDate() - 1);
    const [fechaInicio, setFechaInicio] = useState<Date>(yesterday);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState<Factura|null>(posts.datos[0]);
    const [clienteFactura, setClienteFactura] = useState<Cliente|null>(null);   
//TODO: Replace for usereducer dev.to/builderio/a-cure-for-react-usestate-hell-1ldi
    const getFacturas = async () => {
        try {
            const params = {
                fechaInicio: dayjs(fechaInicio).format('YYYY-MM-DD'), 
                fechaFin: dayjs(fechaFin).format('YYYY-MM-DD')
            }
            const res = await axios.get('/facturas', {params});
            toast.success(JSON.stringify(`Se obtuvieron ${res.data.datos.length} facturas`));
            setResFacturas(res.data.datos);

        } catch (error: any) {
            toast.error(error.response.data?.error || JSON.stringify(error.response));    
        }
    };
   
    const selectFactura = async(factura: Factura)=>{
        const res = await axios.get('cliente/' + factura.cliente.idCuenta);
        setClienteFactura(res.data);
        setFacturaSeleccionada(factura);
    };
    const datePeriodMenu = <div className="flex space-x-1 z-99">
        <label className='text-sm font-bold'>Desde:</label>
        <ReactDatePicker className='h-6 w-24 pr-0 pl-1.5' selected={fechaInicio} onChange={(date:Date) => setFechaInicio(date)} />
        <label className='text-sm font-bold'>Hasta:</label>
        <ReactDatePicker className='h-6 w-24 pr-0 pl-1.5' selected={fechaFin} onChange={(date:Date) => setFechaFin(date)} />
    </div>;

    return (
		<div>
			<Head>
				<title>Facturación</title>
			</Head>
            <Toaster />
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
                <Feeder>
                    <NavBar 
                    title="Facturación" 
                    handleRefresh={getFacturas} 
                    data={posts.datos} 
                    setData={setResFacturas} 
                    filterKey={['cliente', 'razonSocial']}
                    filterKeyId = 'numeroFactura'
                    >
                    {datePeriodMenu}
                    </NavBar>
					{resFacturas?.map((post: Factura) => (
                        <div key={post.id} onClick={() => selectFactura(post)}>
                            <FacturaCard factura={post}/>
                        </div>
					)).reverse()}
				</Feeder>
                <Widgets>
                    <div className='sticky top-0 z-50 bg-gray-100'>
                    {facturaSeleccionada && <FacturaWidget factura={facturaSeleccionada}/>}
                    </div>
                    {clienteFactura && <ClienteWidget cliente={clienteFactura}/>}
				</Widgets> 
			</main>
		</div>
	);
}

export async function getStaticProps() {
    const posts = await getFacturasAPI(`?fechaInicio=2022-01-01&fechaFin=2022-12-12`);    
    return {props: {posts}}
}
