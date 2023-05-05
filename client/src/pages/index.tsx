/** @format */

import Head from 'next/head';
import Feeder from '../components/Feeder';
import Sidebar from '../components/menues/Sidebar';
import Widgets from '../components/Widgets';
import NewsWidget from '../components/NewsWidget';
import NavBar from '../components/NavBar';
import { useEffect, useState } from 'react';
import { useAuthState } from '../context/auth';
import ResumenWidget from '../components/ResumenWidget';
import router from 'next/router';

export default function Home({ newsResults }: any) {
	const { user } = useAuthState();
	const [filteredData, setFilteredData] = useState(newsResults.articles);
	const handleRefresh = () => {
		console.log(`Se encontraron ${newsResults.articles?.length} resultados`);
		setFilteredData(newsResults.articles);
	};

	useEffect(()=>{
		if(!user) router.push('/auth/login');
	},[])

	return (
		<div>
			<Head>
				<title>SSO ABE</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex min-h-screen mx-auto">
				<Sidebar />
				<Feeder>
					<NavBar title="Noticias" data={newsResults.articles} setData={setFilteredData} filterKey="title" handleRefresh={handleRefresh} />
					<NewsWidget newsResults={filteredData} />
				</Feeder>
				{user && (
					<Widgets>
						<ResumenWidget />
					</Widgets>
				)}
			</main>
		</div>
	);
}

//Server side rendering: Vercel
export async function getServerSideProps() {
	let newsResults = { articles: 'Empty', results: 'Empty' };
	try {
		newsResults = await (await fetch('https://newsapi.org/v2/everything?q=Bolivia&q=Musk&q=Satelite&language=es&apiKey=ad3ee4bbcc2541249b900e8fd74e4516')).json();
	} catch (e) {
		console.error('Error al cargar newsapi' + e);
	}
	return {
		props: {
			newsResults,
		},
	};
}
