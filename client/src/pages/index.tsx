import Head from 'next/head';
import { Toaster } from 'react-hot-toast';
import Feeder from '../components/SS/Feeder';
import Sidebar from '../components/menues/Sidebar';
import Widgets from '../components/Widgets';
import NewsWidget from '../components/NewsWidget';
import SearchBar from '../components/SS/SearchBar';
import RandomPeopleWidget from '../components/RandomPeopleWidget';

export default function Home({ newsResults, randomPeople }: any) {
    return (
        <div>
            <Head>
                <title>SSO ABE</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster />
            <main className="flex min-h-screen mx-auto">
                <Sidebar />
                <Feeder>
                    <SearchBar/>
                    <NewsWidget newsResults={newsResults.articles}/>
                </Feeder>
                <Widgets>
                    <RandomPeopleWidget randomPeople={randomPeople.results}/>
                </Widgets>
            </main>
        </div>
    );
}

//Server side rendering: Vercel
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
    return {
        props: {
            newsResults,
            randomPeople,
        },
    };
}
