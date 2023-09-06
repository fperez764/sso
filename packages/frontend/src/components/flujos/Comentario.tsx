import { PhotoIcon } from "@heroicons/react/24/outline"
import { ClienteServicioTicketAccionComentario } from "@types/typesSSO"
import Image from "next/image"
import Icons from "../ui/Icons"
import toast from "react-hot-toast"
import axios from "axios"
import { useAuthState } from "@src/context/auth"
import { useState } from "react"
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
    comentario: ClienteServicioTicketAccionComentario
}


const Comentario = ({comentario}: Props) => {
	const { user } = useAuthState();
    const [anulado, setAnulado] = useState(false);
    const [image, setImage] = useState<string | undefined>(comentario.imagen || undefined);
	const anularComentario = async () => {
		if (!window.confirm('Estas seguro de anular este ticket.')) return;
		try {
			await axios.delete(`/ticketsAcciones/comentario/${comentario.id}`);			
			setAnulado(true);
			toast.success('Comentario anulado.');
		} catch (error) {
            console.error(error);
			toast.error('No se pudo anular comentario, contacte al administrador.');			
		}
	}

	const obtenerImagen = async (idComentario: number) => {
        if(image === undefined || image.includes('base64')) return;
		try {
			const res = await axios.get(`/ticketsAcciones/comentario/${idComentario}`);
			setImage(res.data.imagen);
		} catch (error) {
			toast.error('No se pudo obtener la imagen: ' + error);
		}
	}


  return anulado 
    ? <p></p>
    :<div key={comentario.id} className='flex mb-2 space-x-2'>
        <Image className="items-center w-10 h-10 bg-blue-200 rounded-full" src={`/images/areas/${comentario.usuarioArea}.png`} width={64} height={64} alt={comentario.usuarioArea || "Area"} />
        <div className="w-full px-3 py-3 bg-gray-100 rounded-xl" onClick={() => obtenerImagen(comentario.id)}>
            <div className="flex">
                <h4 className="text-sm font-bold">{comentario.usuarioCreacion || 'desconocido'}</h4>
                <p className="my-1 ml-1 text-xs whitespace-nowrap">{dayjs(comentario.fechaModificacion).fromNow()}</p>
            </div>
            <p className="text-lg">{comentario.comentario}</p>
            {!!image && (image.length > 100 
            ? <div className="relative h-64 w-128"><Image src={image} alt={comentario.imagen || 'imagen'} layout="fill" objectFit='contain'/></div>
            : <div className='flex mx-2 space-x-2 text-gray-600 cursor-pointer'><p>{comentario.imagen}</p><PhotoIcon className="w-6 h-6" /></div>)}
        </div>
        {user?.username === comentario.usuarioCreacion && <Icons handleNullify={anularComentario} name='comentario'/>}
    </div>
}

export default Comentario
