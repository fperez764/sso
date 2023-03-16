import Head from 'next/head';
import Feeder from '../components/Feeder';
import Sidebar from '../components/menues/Sidebar';
import Widgets from '../components/Widgets';
import NewsWidget from '../components/NewsWidget';
import RandomPeopleWidget from '../components/RandomPeopleWidget';
import NavBar from '../components/NavBar';
import { useState } from 'react';
import { useAuthState } from '../context/auth';


export default function Home({ newsResults, randomPeople }: any) {
    const { authenticated, user } = useAuthState();
    const [filteredData, setFilteredData] = useState(newsResults.articles);
    const handleRefresh = () => {
        console.log(`Se encontraron ${newsResults.articles?.length} resultados`);
        setFilteredData(newsResults.articles);
    }
    return (
        <div>
            <Head>
                <title>SSO ABE</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex min-h-screen mx-auto">
                <Sidebar />
                <Feeder>
                    <NavBar 
                        title='Noticias' 
                        data={newsResults.articles} 
                        setData={setFilteredData} 
                        filterKey='title' 
                        handleRefresh={handleRefresh}
                    />
                    <NewsWidget newsResults={filteredData}/>
                </Feeder>
                <Widgets>
                    {user && <RandomPeopleWidget randomPeople={randomPeople.results}/>}
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
            'https://newsapi.org/v2/everything?q=Satellite&language=es&apiKey=ad3ee4bbcc2541249b900e8fd74e4516'
            )
            //'https://saurav.tech/NewsAPI/top-headlines/category/health/us.json'
            //https://newsapi.org/v2/everything?q=Apple&from=2022-10-19&sortBy=popularity&apiKey=ad3ee4bbcc2541249b900e8fd74e4516
        ).json();
        randomPeople = await (
            await fetch(
                'https://randomuser.me/api/?results=30&inc=name,login,picture'
            )
        ).json();
    } catch (e) {
        console.error('Error al cargar randompeople' + e);
    }
    return {
        props: {
            newsResults,
            randomPeople,
        },
    };
}
