import { SolicitudServicio } from 'next-auth';
import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Feeder from '../components/Feeder';
import Sidebar from '../components/Sidebar';
import Widgets from '../components/Widgets';

export default function Home({ newsResults, randomPeople, solicitudesS }: any) {
    return (
        <div>
            <Head>
                <title>SSO ABE</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster />
            <main className="flex min-h-screen mx-auto">
                <Sidebar />
                <Feeder solicitudesS = {solicitudesS}/>
                <Widgets
                    newsResults={newsResults.articles}
                    randomPeople={randomPeople.results}
                />
            </main>
        </div>
    );
}

//Server side rendering
export async function getServerSideProps() {
    let newsResults,
        randomPeople = { articles: 'Empty', results: 'Empty' };
        
    try {
        newsResults = await (
            await fetch(
                'https://saurav.tech/NewsAPI/top-headlines/category/health/us.json'
            )
        ).json();
        randomPeople = await (
            await fetch(
                'https://randomuser.me/api/?results=30&inc=name,login,picture'
            )
        ).json();
    } catch (e) {
        console.log('Error al cargar randompeople' + e);
    }

    const res = await fetch('http://localhost:3000/api/solicitudServicio');

    console.log(res);
    const solicitudesS = await res.json();
    return {
        props: {
            newsResults,
            randomPeople,
            solicitudesS,
        },
    };
}
