import {useSession, signOut} from "next-auth/react"
import Head from 'next/head'
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

export default function Home() {
  const {data:session} = useSession();
  const router = useRouter();
  console.log("session", session);
  return (
    <div>
        <Head>
            <title>SSO</title>
            <meta name="description" content="Sistema de Operaciones ABE"/>
            <link rel="icon" href="/favicon.ico"/>
        </Head>
        <main className = {styles.main}>
            {session ? (
            <button onClick={() => signOut()}>Log out</button>) 
            : <button onClick={()=> router.push("/api/auth/signin")}>Sign In</button>}
            Welcome to SSO
        </main>
    </div>
  )
}
