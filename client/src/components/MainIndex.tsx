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

interface Props {
	postName: string;
	postEndpoint: string;
	filterKey: string;
	feederChildren: any;
	widgetChildren: any;
	newWidgetChildren: any;
}

export default function MainIndex({
	postName,
	postEndpoint,
	filterKey,
	feederChildren,
	widgetChildren,
	newWidgetChildren,
}: Props) {
	const [posts, setPosts] = useState<any[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
	const [selectedPost, setSelectedPost] = useState<any | null>(null);
	const [showNew, setShowNew] = useState(false);

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
			const res = await axios.get(postEndpoint);
			setPosts(res.data);
			setFilteredPosts(res.data);
			toast.success(`${res.data.length} Registros de ${postName} actualizados.`, {
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
					<NavBar
						searchEndpoint={postEndpoint}
						handleRefresh={handleRefresh}
						data={posts}
						setData={setFilteredPosts}
						title={postName}
						filterKey={filterKey}
					/>
					<div className="my-2 ml-3 hidden lg:inline">
						<Button
							Icon={DocumentPlusIcon}
							title={`Agregar ${postName}`}
							onClick={() => {
								setShowNew(true);
								setSelectedPost(null);
							}}
						/>
					</div>
					{filteredPosts.map((post: any) => (
						<div key={post.id} onClick={() => setSelectedPost(post)}>
							{feederChildren({ post })}
						</div>
					))}
				</Feeder>
				<Widgets>
					{selectedPost ? widgetChildren({ selectedPost }) : null}
					{showNew ? newWidgetChildren({ selectedPost, handleInputCancel }) : null}
				</Widgets>
			</main>
		</div>
	);
}
