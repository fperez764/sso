import Head from 'next/head';
import { useEffect } from 'react';
import router from 'next/router';
import { useAuthState } from '@src/context/auth';
import Sidebar from '@src/components/menues/Sidebar';
import Feeder from '@src/components/Feeder';
import Widgets from '@src/components/Widgets';

export default function Home() {
	const { user } = useAuthState();

	useEffect(()=>{
		if(!user) router.push('/auth/login');
	},[]);

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