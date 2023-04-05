/** @format */
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { DocumentPlusIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Sidebar from './menues/Sidebar';
import Feeder from './Feeder';
import NavBar from './NavBar';
import Button from './Button';
import Widgets from './Widgets';
import { useRouter } from 'next/router';
import { useAuthState } from '../context/auth';
import toastCard from './ToastCard';

interface Props {
	postName: string;
	endpoint: string;
	defaultFilterKey: string;

	feederChildren: any;
	widgetChildren: any;
	newWidgetChildren?: any;
	customGet?: any;
	extraButtons?: any;
}

/**
 * Vista principal para @param postName: Las funciones locales handleRefresh son generales. Para extender funciones custom o sobreescribir el handleRefresh se usa @param customGet
 * @param endpoint, @param defaultFilterKey => consume api por defecto con ese endpoint para obtener la lista del feeder y concatena un filterkey para buscar con el SearchBar
 * @returns Layout principal en next12 para una distribucion de menu/feeder:lista/widgets:detalles en base a sus por ej: @param feederChildren
 * @constructs Feeder: Vista central de lista de objectos @Card ;
 * @constructs Widgets, @constructs NewWidgets Vista derecha de detalles de un objecto mas opciones de edición 
 * @default HandleRefresh() define como actualizar el Feeder.
 */

export default function MainIndex({ postName, endpoint, defaultFilterKey, feederChildren, widgetChildren, newWidgetChildren, customGet, extraButtons }: Props) {
    const { user } = useAuthState();
	const [posts, setPosts] = useState<any[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
	const [selectedPost, setSelectedPost] = useState<any | null>(null);
	const [blockClose, setBlockClose] = useState(false);
	const [showNew, setShowNew] = useState(false);
	const { query } = useRouter();
	const { filterKey, filterValue } = query;

	useEffect(() => {
		handleRefresh();
	}, []);

	//Por defecto solicita confirmacion para cerrar detalles de nuevo
	useEffect(() => {
		if(showNew) setBlockClose(true);
	},[showNew]);

	const handleRefresh = async () => {
		const refreshToast = toast.loading('Actualizando...');
		try {
			const getEndpoint = endpoint + (!!filterValue && (!!filterKey || !!defaultFilterKey) ? `?${filterKey}=${filterValue}` : '');
			toast.success('GET ' + getEndpoint);
			const res = customGet ? await customGet() : (await axios.get(getEndpoint)).data;
			setPosts(res);
			setFilteredPosts(res);
			toast.success(`${res.length} Registros de ${postName} actualizados.`, {
				id: refreshToast,
			});
		} catch (error: any) {
			toast.error(`No se pudieron obtener registros de ${postName}: ${error.message}`, {
				id: refreshToast,
			});
		}
	};

	const dialogoCerrarWidgets = () =>{
		console.log('Bloquear: ' + blockClose);
		if(blockClose){
			//Confirmar
			toastCard(<></>, 'Desea cerrar el panel de detalles? Perdera los cambios no guardados.', ()=>{
				setSelectedPost(null);
				setShowNew(false);	
			})
			return;
		}
		setSelectedPost(null);
		setShowNew(false);	
	}

	const handleSelect = (post: any) =>{
		setSelectedPost(selectedPost ? null : post); 
		setShowNew(false);
		setBlockClose(false);
	}

	return (
		<div>
			<Head>
				<title>{postName}</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				{/*<Toaster />*/}
				<Sidebar />
				<Feeder>
					{/*// TODO: agregar opciones de iconos para borrar; anular; ?*/}
					{/*// TODO: convertir el selectedPost a un contexto para no tener q pasar el objecto entre componentes ?*/}

					<NavBar searchEndpoint={endpoint} handleRefresh={handleRefresh} data={posts} setData={setFilteredPosts} title={postName} filterKey={filterKey || defaultFilterKey} />
					{user && <div className="flex my-2 ml-3 space-x-2">
						<Button
							Icon={DocumentPlusIcon}
							title={`Agregar ${postName}`}
							onClick={() => {
								setShowNew(true);
								setSelectedPost(null);
							}}
						/>
						{extraButtons}
					</div>}
					{filteredPosts?.map((post: any) => (
						<div key={post.id} onClick={() => {handleSelect(post)}}>
							{feederChildren({ post })}
						</div>
					))}
				</Feeder>
				{selectedPost || showNew 
				? <>
					<Widgets>
						{(selectedPost && !showNew) 
							? widgetChildren({ selectedPost, handleRefresh, setBlockClose }) : null}
						{(showNew && user && newWidgetChildren) 
							? newWidgetChildren({ selectedPost, handleRefresh }) : null}
					</Widgets>
					<XCircleIcon className={`absolute w-12 top-0 right-0 cursor-pointer ${blockClose ? 'text-red-400':'text-gray-400'}`}
					onClick={dialogoCerrarWidgets}/>
				</> 
				: <p className='w-32 p-2 font-bold mt-64 text-center text-gray-400'>Seleccione algún elemento para ver sus detalles</p>}
			</main>
		</div>
	);
}
