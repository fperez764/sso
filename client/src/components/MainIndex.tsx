import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ArrowLeftIcon, ArrowRightIcon, DocumentPlusIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { useAuthState } from '../context/auth';
import toastCard from './ToastCard';
import Sidebar from './menues/Sidebar';
import Feeder from './Feeder';
import NavBar from './NavBar';
import Button from './Button';
import Widgets from './Widgets';
import ResumenWidget from './ResumenWidget';

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
	const [isMobile, setIsMobile] = useState(false);
	const [page, setPage] = useState(0);
	const { query } = useRouter();
	const { filterKey, filterValue } = query;
	const { seccion } = useRouter().query;
	const subRoute = seccion ? `/${seccion}` : '';

	useEffect(()=>{
		setPage(0);
		handleRefresh();
	},[seccion]);

	const handleResize = () => {
		if (window.innerWidth < 720) {
			setIsMobile(true);
		} else {
			setIsMobile(false);
		}
	};

	// create an event listener
	useEffect(() => {
		window.addEventListener('resize', handleResize);
	});

	//Por defecto solicita confirmacion para cerrar detalles de nuevo
	useEffect(() => {
		if (showNew) setBlockClose(true);
	}, [showNew]);

	const handleRefresh = async (searchPage:number = 0) => {
		const refreshToast = toast.loading('Actualizando...');
		try {
			const getEndpoint = endpoint + subRoute + `?page=${typeof(searchPage) === 'number' ? searchPage : 0 }` + (!!filterValue && (!!filterKey || !!defaultFilterKey) ? `&${filterKey}=${filterValue}` : '');
			const res = customGet ? await customGet() : await axios.get(getEndpoint);
			if (!Array.isArray(res.data)) {
				throw Error('No se pudieron encontrar elementos.');
			}
			if(res.data?.length === 0 && searchPage > 0) { 
				toast.error('No existen más elementos registrados', {id: refreshToast});
				return;}
			setPosts(res.data);
			setFilteredPosts(res.data);
			toast.success(`${res.data.length} Registros de ${postName} actualizados.`, {
				id: refreshToast,
			});
			return res.data.length;
		} catch (error: any) {
			toast.error(`No se pudieron obtener registros de ${postName}: ${error.message}`, {
				id: refreshToast,
			});
		}
	};

	const handleNextPage = async () => {
		const newEntries = await handleRefresh(page+1);
		if(newEntries && newEntries > 0) setPage(page+1);
	}
	const handlePreviousPage = async () => {
		if(page>0){
			handleRefresh(page-1);
			setPage(page-1);
		}
	}

	const dialogoCerrarWidgets = () => {
		if (blockClose) {
			//Confirmar
			toastCard(<></>, 'Desea cerrar el panel de detalles? Perdera los cambios no guardados.', () => {
				setSelectedPost(null);
				setShowNew(false);
			});
			return;
		}
		setSelectedPost(null);
		setShowNew(false);
	};

	const handleSelect = (post: any) => {
		setSelectedPost(post);
		setShowNew(false);
		setBlockClose(false);
	};

	const detailPanel = (
		<>
			{selectedPost || showNew ? (
				<div className="hidden w-full md:inline">
					<Widgets>
						{selectedPost && !showNew ? widgetChildren({ selectedPost, handleRefresh, setShowNew }) : null}
						{showNew && user && newWidgetChildren ? newWidgetChildren({ selectedPost, handleRefresh, setShowNew }) : null}
					</Widgets>
					<XCircleIcon className={`absolute w-12 top-0 right-0 cursor-pointer ${blockClose ? 'text-red-400' : 'text-gray-400'}`} onClick={dialogoCerrarWidgets} />
				</div>
			) : (
				<>{user && <ResumenWidget />}</>
			)}
		</>
	);

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

					<NavBar searchEndpoint={endpoint} handleRefresh={handleRefresh} data={posts} setData={setFilteredPosts} title={postName+subRoute} filterKey={filterKey || defaultFilterKey} />
					{user && !isMobile && (
						<div className="flex my-2 ml-3 space-x-2">
							<Button
								Icon={DocumentPlusIcon}
								title={`Agregar ${postName}`}
								onClick={() => {
									setShowNew(true);
									setSelectedPost(null);
								}}
							/>
							{extraButtons}
						</div>
					)}
					{/*TODO: Si el post tiene seccion en sus propiedades, crear submaps con la opcion de expandirse/colapsar*/}
					{filteredPosts?.map((post: any) => (
						<div className={`${post?.id === selectedPost?.id && 'px-3 bg-slate-400 rounded-md'}`}
							key={post.id}
							onClick={() => {
								handleSelect(post);
							}}
						>
							{feederChildren({ post })}
							{/*Muestra detalles debajo en vista small*/}
							{isMobile && (selectedPost || showNew) && selectedPost?.id === post.id && (
								<div className="flex flex-col -mt-4 border-4 border-blue-300 md:hidden rounded-xl">
									<XCircleIcon className={`w-12 cursor-pointer place-self-end ${blockClose ? 'text-red-400' : 'text-gray-400'}`} onClick={dialogoCerrarWidgets} />
									{selectedPost && !showNew && widgetChildren({ selectedPost, handleRefresh })}
								</div>
							)}
						</div>
					))}
					{/*Paginador*/}
					<div className="absolute flex items-center justify-end p-2 space-x-2 rounded-md right-10 bottom-1 bg-slate-400">
						<ArrowLeftIcon className='w-6 h-6 cursor-pointer hover:bg-sky-500 roundend-xl' onClick={handlePreviousPage} />
						<span className='text-xl'>{page}</span>
						<ArrowRightIcon className='w-6 h-6 cursor-pointer hover:bg-sky-500 roundend-xl' onClick={handleNextPage} />
					</div>
				</Feeder>
				{!isMobile && detailPanel}
			</main>
		</div>
	);
}
