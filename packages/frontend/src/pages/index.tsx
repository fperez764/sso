import Head from 'next/head';
import Feeder from '../components/Feeder';
import Sidebar from '../components/menues/Sidebar';
import Widgets from '../components/Widgets';
import { useEffect } from 'react';
import { useAuthState } from '../context/auth';
import router from 'next/router';

export default function Home() {
	const { user } = useAuthState();

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
				</Feeder>
				<Widgets>
				</Widgets>
			</main>
		</div>
	);
}