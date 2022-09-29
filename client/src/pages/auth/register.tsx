import Head from 'next/head';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import InputA from '../../components/InputA';

export default function Register() {
    return (
        <div className="flex">
            <Head>
                <title>Registrate</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Toaster />
                <img className="h-screen bg-center bg-cover w-80 " src="\images\space.jpg"/>
            <div className="flex flex-col justify-center pl-6">
                <h1 className="mb-2 text-lg">Registrate</h1>
                <form>
                <InputA type="email" placeholder="Correo ABE" />
                <InputA type="text" placeholder="Usuario" />
                <InputA type="password" placeholder="Contraseña"/>
                <button className="w-full py-2 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded">
                    Registrarse
                </button>
            </form>
<small>Ya estas registrado?
        <Link href="/auth/signin">
        <a className="ml-1 text-blue-500 uppercase">Inicia Sesión</a>
        </Link>
</small>

            </div>
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
