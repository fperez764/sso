import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import { FormEvent, SetStateAction, useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import InputA from '../../components/InputA';
import { useAuthDispatch, useAuthState } from '../../context/auth';
import logger from '../../utils/logger';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});
    const dispatch = useAuthDispatch();
    const { authenticated } = useAuthState();

    const submitForm = async (event: FormEvent) => {
        event.preventDefault();    
        try {
        setErrors({});
          const res = await axios.post('/auth/login', {
            password,
            username,
          });
          dispatch('LOGIN', res.data );
          router.back();
        } catch (err: any) {
          logger.error(err);
            setErrors(err.response.data?.errors);
            toast.error(JSON.stringify(err));
        }
      };

    return (        
        <div className="flex bg-gray-100">
            <Head>
                <title>Inicia Sesión</title>
            </Head>
            <Toaster />
                <img className="h-screen bg-center bg-cover w-80 " src="\images\space.jpg"/>
            <div className="flex flex-col justify-center pl-6">
                <h1 className="mb-2 text-lg">Inicia Sesión</h1>
                <form>
                    <InputA type="text" error={errors?.username} placeholder="Usuario" value={username} handleChange={(e: { target: { value: SetStateAction<string>; }; }) => setUsername(e.target.value)}/>
                    <InputA type="password" error={errors?.password} placeholder="Contraseña" value={password} handleChange={(e: { target: { value: SetStateAction<string>; }; }) => setPassword(e.target.value)}/>
                    <button onClick={submitForm} className="w-full py-2 mt-4 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded">
                        Iniciar Sesión
                    </button>
                </form>
                <small>No estas registrado?
                    <Link href="/auth/register" className="ml-1 text-blue-500 uppercase">
                        Registrate con tu correo ABE
                    </Link>
                </small>
            </div>
        </div>
    );
}