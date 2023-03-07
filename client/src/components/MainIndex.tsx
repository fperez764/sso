/** @format */
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';
import { DocumentPlusIcon } from '@heroicons/react/24/outline';
import Sidebar from './menues/Sidebar';
import Feeder from './Feeder';
import NavBar from './NavBar';
import Button from './Button';
import Widgets from './Widgets';
import { useRouter } from 'next/router';

interface Props {
	postName: string;
	endpoint: string;
	defaultFilterKey: string;

	feederChildren: any;
	widgetChildren: any;
	newWidgetChildren?: any;
	customGet?: any;
}

export default function MainIndex({ postName, endpoint, defaultFilterKey, feederChildren, widgetChildren, newWidgetChildren, customGet }: Props) {
	const [posts, setPosts] = useState<any[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
	const [selectedPost, setSelectedPost] = useState<any | null>(null);
	const [showNew, setShowNew] = useState(false);
	const { query } = useRouter();
	const { filterKey, filterValue } = query;

	const handleInputCancel = () => {
		setShowNew(false);
		setSelectedPost(null);
	};

	useEffect(() => {
		handleRefresh();
	}, []);

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

	return (
		<div>
			<Head>
				<title>{postName}</title>
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Toaster />
				<Sidebar />
				<Feeder>
					<NavBar searchEndpoint={endpoint} handleRefresh={handleRefresh} data={posts} setData={setFilteredPosts} title={postName} filterKey={filterKey || defaultFilterKey} />
					<div className="hidden my-2 ml-3 lg:inline">
						<Button
							Icon={DocumentPlusIcon}
							title={`Agregar ${postName}`}
							onClick={() => {
								setShowNew(true);
								setSelectedPost(null);
							}}
						/>
					</div>
					{filteredPosts?.map((post: any) => (
						<div key={post.id} onClick={() => setSelectedPost(post)}>
							{feederChildren({ post })}
						</div>
					))}
				</Feeder>
				<Widgets>
					{selectedPost ? widgetChildren({ selectedPost }) : null}
					{showNew && newWidgetChildren ? newWidgetChildren({ selectedPost, handleInputCancel, handleRefresh }) : null}
				</Widgets>
			</main>
		</div>
	);
}
