'use client';
import Sidebar from "@src/components/menues/Sidebar";
import Head from "next/head";

const Home = () => (
  <section className='flex-col justify-center w-full flex-center'>
			<Head>
				<title>SSO ABE</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="flex w-full min-h-screen mx-auto">
				<Sidebar />
			</main>
  </section>
);

export default Home;
