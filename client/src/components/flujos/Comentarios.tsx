import { Respuesta, Comentario } from "../../../types/typesSSO";
import toast from 'react-hot-toast';
import { useAuthState } from "../../context/auth";
import dayjs from "dayjs";
import axios from "axios";
import { ArrowPathIcon, ChevronDownIcon, ChevronUpIcon, PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from 'react';
import es from 'dayjs/locale/es';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale(es);
dayjs.extend(relativeTime);

interface Props {
    selectedRespuesta: Respuesta;
}

export default function SeccionComentarios({ selectedRespuesta}: Props) {
    if(!selectedRespuesta) return <p>No se puede comentar</p>;
    const endpoint = ('servicio' in selectedRespuesta ? '/solicitudes/' : '/tickets/') + selectedRespuesta.id;
    const { user } = useAuthState();
    const [textoComentario, setTextoComentario] = useState('');
    const [comentarios, setComentarios] = useState<Comentario[]>(selectedRespuesta.comentarios);
    const [mostrar, setMostrar] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const filePickerRef = useRef(null);

    useEffect(()=>{
        actualizarComentarios();       
      }, [selectedRespuesta]);


      const actualizarComentarios = async () => {
        try {
            const res = await axios.get(`/tickets/respuestas/${selectedRespuesta.id}`);
            const comentarios = res.data.comentarios;
            setComentarios(comentarios.sort((r: Comentario, s: Comentario)=> r.id - s.id));
        } catch (error: any) {toast.error(error.message + ': No se pudieron actualizar los comentarios ');}
    }; 
    
    const comentarRespuesta = async () => {
        if(!user) {toast.error('Inicia sesión'); return;}
        const tComentar = toast.loading('Agregando comentario...');
        try {
            const comentarioBody = { 
                comentario: textoComentario,
            };
            const res = await axios.post(`/tickets/respuestas/${selectedRespuesta.id}/comentar`, comentarioBody);
            toast.success('Comentario agregado!', { id: tComentar, });
            setTextoComentario('');
            actualizarComentarios();
        } catch (error: any) {toast.error(error.code + ' Algo salio mal ' + JSON.stringify(error), {id: tComentar});}
    
    }

    const agregarMediaRespuesta = async () => {
        toast.error('Agregar imagenes: Por implementar');
    }

    const handleClick = () => {
        setSelectedFile(null);
    };
    
    const addImage = (e: any ) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
                setSelectedFile(readerEvent.target.result);
        };
    };

    const imageButton =
        (<div>
            {selectedFile && (
                <div className="relative">
                    <XMarkIcon
                        onClick={() => setSelectedFile(null)}
                        className="absolute h-5 text-black rounded-full cursor-pointer bg-slate-100"
                    />
                    <img
                        src={selectedFile}
                    />
                </div>
            )}
            <div className="flex items-center justify-between pt-2.5">
                <div onClick={() => filePickerRef?.current.click()}>
                    <PhotoIcon className="h-10 w-10 hoverEffect p=2 text-sky-500 hover:bg-sky-100" />
                    <input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={addImage}
                    />
                </div>
            </div>
        </div>
        );


return <div className="mt-2 ml-3">
    <div className="border-y border-gray-300 mb-2 flex">
        <h4>{comentarios.length + (comentarios.length !== 1 ? ' comentarios' : 'comentario')}</h4>
        {mostrar 
        ? <ChevronUpIcon className="w-6 ml-5" onClick={()=>setMostrar(false)}/> 
        : <ChevronDownIcon className="w-6 ml-5" onClick={()=>setMostrar(true)}/> }
        <ArrowPathIcon className="w-6 ml-5" onClick={actualizarComentarios}/>
    </div>
    {/* Lista de comentarios */}
    {mostrar && <div className="flex-col">
        {!comentarios && setComentarios(selectedRespuesta.comentarios)}
        {!!comentarios && comentarios.map((comentario) => (
            <div key={comentario.id} className="relative mb-2 flex space-x-1"> 
                <img className="h-10 w-10 rounded-full items-center bg-blue-200" src={`/images/areas/${comentario.usuarioCreacion?.area}.png`}
                    alt='Area' />
                <div>
                    <div className="rounded-lg bg-gray-200 px-3">
                        <h4 className="font-bold text-sm">{comentario.usuarioCreacion?.username || 'desconocido'}</h4>
                        <p className="text-lg">{comentario.comentario}</p>
                    </div>
                    <p className="text-xs whitespace-nowrap ml-1">{dayjs(comentario.fechaModificacion).fromNow()}</p>
                </div>
            </div>
        ))}
    </div>}
    {/* Caja para comentar */}
    {user && <div className="flex space-x-3">
        <img className="h-10 w-10 rounded-full items-center bg-blue-200" src={`/images/areas/${user.area}.png`}
            alt='Area' />
        <input 
        value={textoComentario}
        onChange={e => setTextoComentario(e.target.value)}
        className="flex-1 p-2 bg-gray-100 outline-none rounded-lg text-lg"
        type="text" placeholder="Escribe un comentario..."/>
        {imageButton}
        <button 
            disabled={!textoComentario}
            onClick={comentarRespuesta}
            className="text-white disabled:text-gray-400 bg-blue-400 px-2 rounded-md"
        >Comentar</button>
    </div>}
</div>}
