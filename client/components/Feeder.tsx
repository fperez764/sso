import { RssIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import fetchSolicitudesServicio from '../pages/api/solicitudServicio/index';
import Input from './Input';
import SSCard from './SolicitudServicio';
import Table from './Table';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBar from './SearchBar';
import { SolicitudServicio } from 'next-auth';

interface Props {
    solicitudesS: SolicitudServicio[];
}
/**
 * Muestra las solicitudes de servicio(post) segun el ultimo q acepto(creadas por ti)? o las q creaste tu en vez de la imagen
 * @returns
 */
function Feeder({ solicitudesS }: Props ) {
    const [solicitudesList, setSolicitudesList] = useState<SolicitudServicio[]>(solicitudesS);
    const handleRefresh = async () => {
        const refreshToast = toast.loading('Actualizando...');
        const solicitudes = await (await fetch('api/solicitudServicio', {
            method: 'GET',
        })).json();
        setSolicitudesList(solicitudes);
        toast.success('Solicitudes actualizadas', { id: refreshToast });
    };

    return (
        <div className="xl:ml-[280px] border-l border-r border-gray-200  xl:min-w-[826px] sm:ml-[73px] flex-grow max-w-xl">
            <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
                    Inicio
                </h2>
                <div className="hoverEffect flex items-center justify-center px-0 ml-auto w-9 h-9">
                    <RssIcon onClick={handleRefresh} className="h-5" />
                </div>
            </div>
            <SearchBar />
            <Table />

            <Input />
            <AnimatePresence>
            {solicitudesList.map((post) => (
                <motion.div key={post.id} 
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} 
                transition={{ duration: 1 }}>
                    <SSCard key={post.id} sS={post} />
                </motion.div>
            ))}
            </AnimatePresence>
        </div>
    );
}

export default Feeder;
