import { RssIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import fetchSolicitudesServicio from '../pages/api/solicitudServicio/index';
import Input from './Input';
import SolicitudServicio from './SolicitudServicio';
import Table from './Table';
import toast from 'react-hot-toast';

/**
 * Muestra las solicitudes de servicio(post) segun el ultimo q acepto(creadas por ti)? o las q creaste tu en vez de la imagen
 * @returns
 */
function Feeder() {
    const [solicitudes, setSolicitudes] = useState([]);
    const posts = [
        {
            id: '1',
            name: 'Snoopy',
            username: 'joe.cool',
            userImg:
                'https://upload.wikimedia.org/wikipedia/en/5/53/Snoopy_Peanuts.png',
            img: 'https://eldeber.com.bo/_next/image?url=https%3A%2F%2Fstatic.eldeber.com.bo%2FFiles%2FSizes%2F2020%2F10%2F4%2Fsnoopy-_204191699_760x520.jpg&w=640&q=75',
            text: 'Snoopy cumple 70 años',
            timestamp: '2022-09-09',
        },
        {
            id: '2',
            name: 'Carlitos',
            username: 'charlie.brown',
            userImg:
                'https://charactersdb.com/wp-content/uploads/charlie-brown-peanuts-character.jpg',
            img: 'https://cdn.mos.cms.futurecdn.net/Tcozd4LBkhqZuf79iBP9J8-650-80.jpg.webp',
            text: 'Space',
            timestamp: '2022-09-07',
        },
    ];
    const handleRefresh = async () => {
        const refreshToast = toast.loading('Actualizando...');
        const solicitudes = await fetchSolicitudesServicio(Method.GET);
        setSolicitudes(solicitudes);
        toast.success('Solicitudes actualizadas', { id: refreshToast });
    };

    return (
        <div className="xl:ml-[280px] border-l border-r border-gray-200  xl:min-w-[826px] sm:ml-[73px] flex-grow max-w-xl">
            <div className="sticky top-0 z-50 flex px-3 py-2 bg-white border-b border-gray-200">
                <h2 className="text-lg font-bold cursor-pointer sm:text-xl">
                    Inicio
                </h2>
                <div className="flex items-center justify-center px-0 ml-auto hoverEffect w-9 h-9">
                    <RssIcon onClick={handleRefresh} className="h-5" />
                </div>
            </div>
            <Input />
            {posts.map((post) => (
                <SolicitudServicio key={post.id} post={post} />
            ))}
            <Table />
        </div>
    );
}

export default Feeder;
