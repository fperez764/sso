import {
    ArrowDownOnSquareStackIcon,
    ChartBarIcon,
    ChatBubbleLeftIcon,
    HeartIcon,
    ShareIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconS } from '@heroicons/react/24/solid';
import { SolicitudServicio } from 'next-auth';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import solicitudServicio from '../pages/api/solicitudServicio';

interface Props {
    sS: SolicitudServicio;
}

/**
 * TODO: Componente para una solicitud de servicio, mostrando {id, fecha creacion, usuario creacion, sistema, prepagado y descripcion}
 * ? TODO: Se pintara en un recuadro verde (si todos sus estados son aceptados), rojo si algun estado es rechazado -> Revisar logica de rechazo
 * ? TODO: Tendra como un timeline mostrando los estados aceptado:rechazado:observacion con un popup del comentario, usuario, fecha de cada estado
 * ? comercial-instalador-documentosIns-docsComercial-modemAlmacen-modemInstalador-instalado-activado-docEntregado
 * ? mostrara un miniEstado del servicio (activado? tickets?)
 * ? mostrara un enlace al cliente
 * @param param0
 * @returns
 */
function SSCard({ sS }: Props) {
    const { data: session } = useSession();
    const [aceptaste, setAceptaste] = useState(false);
    const [aceptados, setAceptados] = useState<string[]>([]);
    const [comentariosList, setComentariosList] = useState([])//<ComentarioSS[]>([]);
    const [nuevoComentarioVisible, setNuevoComentarioVisible] = useState(false);
    const [textoComentario, setTextoComentario] = useState('');
    const [puedeAceptar, setPuedeAceptar] = useState(false);

    // useEffect(() => {
    //     const unsubscribe = key; //Obtener objeto de solicitud de servicio con sus aceptaciones
    // }, [aceptados]);

    // useEffect(() => {
    //     setAceptaste( //Revisa si entre los aceptados esta tu username
    //         aceptados.findIndex(
    //             (aceptacion) => aceptacion.id === session?.user.id
    //         ) !== -1
    //     );
    // }, [aceptados]);

    //session?.user.role.includes('Admin') && setPuedeAceptar(true);
    //session?.user.role.includes('SSadmin?') && setTienePermisos(true);

    async function changeAcceptSS() {
        if (!session){ 
            signIn(); 
            return;
        }
        if (aceptaste) {
            setAceptaste(false);
            setAceptados([...aceptados, session.user.name]);
        } else {
            setAceptaste(true);
            setAceptados([...aceptados, session.user.name]);
        }
    }

    async function deleteSS() {
        if (
            window.confirm('Estas seguro de anular esta solicitud de servicio.')
        ) {
            //dar de baja SS si la logica de negocio lo permite;
        }
    }

    type ComentarioSS = {
        id?: number
        comentario: string,
        solicitudServicioId: number, 
        usuarioCreacion: string,
    }
    const comentarSS = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const comentarioToast = toast.loading('Agregando comentario...');
        const comentario: ComentarioSS = { 
            comentario: textoComentario,
            solicitudServicioId: sS.id, 
            usuarioCreacion: session?.user?.name || 'usuario incorrecto',
        };

        const result = await fetch('api/solicitudServicio/comentario', {
            body: JSON.stringify(comentario),
            method: 'sS',
        });

        toast.success('Comentario agregado!', { id: comentarioToast, });
        setTextoComentario('');
        setNuevoComentarioVisible(false);
        actualizarComentariosSS();
    };

    const actualizarComentariosSS = async () => {
        const result = await fetch('api/solicitudServicio/comentario', {
            method: 'GET',
        });
        const comentarios = await result.json();
        setComentariosList(comentarios);
    }; 



    return (
        <div className="flex p-3 cursor-pointer border-b border-gray-200">
            {/*User Image*/}
            <img
                className="h-11 w-11 rounded-full mr-4"
                src={sS.userImg}
                alt="user-img"
            />
            {/*Derecha*/}
            <div className="">
                {/*Header*/}
                <div className="flex items-center justify-between">
                    {/**sS user info */}
                    <div className="flex items-center space-x-1 whitespace-nowrap">
                        <h4 className="font-bold text-[15px] sm:text-[16px] hover:underline">
                            {sS.name}
                        </h4>
                        <span className="text-sm sm:text-[15px]">
                            @{sS.username}
                        </span>
                        <span className="text-sm sm:text[15px] hover:underline">
                            {sS.timestamp}
                        </span>
                    </div>
                    {/**Twodtos icon */}
                    <ArrowDownOnSquareStackIcon className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2" />
                </div>
                {/*sS text*/}
                <p className="text-gray-800 text-[15px] sm:text-[16px] mb-2">
                    {sS.text}
                </p>
                {/*sS Image*/}
                <img className="rounded-2xl mr-2" src={sS.img} alt="" />
                {/*Icons*/}
                <div className="flex justify-between text-gray-500 p-2">
                    {/** Comentar SS */}
                    {session && (
                        <ChatBubbleLeftIcon 
                        onClick={()=> setNuevoComentarioVisible(true)} 
                        className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
                    )}
                    {/** Eliminar SS */}
                    {session?.user.name == sS?.usuarioCreacion && (
                        <TrashIcon
                            onClick={deleteSS}
                            className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
                        />
                    )}
                    {/** Aceptar SS */}
                    {puedeAceptar && (
                    <div className="flex items-center">
                        {aceptaste ? (
                            <HeartIconS
                                onClick={changeAcceptSS}
                                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
                            />
                        ) : (
                            <HeartIcon
                                onClick={changeAcceptSS}
                                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
                            />
                        )}
                        {aceptados.length > 0 && (
                            <span className={`${aceptaste && 'text-red-600'}`}>
                                {aceptados.length}
                            </span>
                        )}
                    </div>
                    )}
                    {/**Derivar a otra area ->*/}
                    <ShareIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
                    <ChartBarIcon className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />
                </div>

                {/* Caja para comentar */}
                {nuevoComentarioVisible && (
                    <form onSubmit={comentarSS} className="mt-3 flex space-x-3">
                        <input 
                        value={textoComentario}
                        onChange={e => setTextoComentario(e.target.value)}
                        className="flex-1 reounded-lg bg-gray-100 p-2 outline-none" 
                        type="text" placeholder="Escribe un comentario..."/>
                        <button 
                            disabled={!textoComentario}
                            type='submit'
                            className="text-abe disabled:text-gray-200"
                        >Comentar</button>
                    </form>
                )}
                {/* Lista de comentarios */}
                {comentariosList?.length > 0 && (
                    <div>
                        {comentariosList.map((comentario) => (
                            <div key={comentario.id} className="relative flex space-x-2"> 
                                <hr className="absolute left-5 top-10 h-8 border-x border-abe/30"/>
                                {/*<img className="mt-2 h-7 w-7 rounded-full object-cover" alt="" src={comentario.usuarioCreacion}/>*/}
                                <div className="flex items-center space-x-1">
                                    <p className="mr-1 font-bold">{comentario.usuarioCreacion}</p>
                                    <p className="hidden text-sm text-gray-500 lg:inline">{comentario.usuarioCreacion}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SSCard;
