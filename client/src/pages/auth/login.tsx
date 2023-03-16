import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import InputB from '../../components/InputB';
import { useAuthDispatch, useAuthState } from '../../context/auth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});
    const dispatch = useAuthDispatch();
    const { authenticated } = useAuthState();

    const submitForm = async () => {
        try {
        setErrors({});
          const res = await axios.post('/auth/login', {
            password,
            username,
          });
          dispatch('LOGIN', res.data );
          router.back();
        } catch (err: any) {
          console.error(err);
            setErrors(err.response?.data);
            toast.error(`${err.message}: ${JSON.stringify(err.response?.data)}`);
        }
      };

    return (        
        <div className="flex bg-gray-100">
            <Head>
                <title>Inicia Sesión</title>
            </Head>
            <img className="h-screen bg-center bg-cover w-80 " src="\images\space.jpg"/>
            <div className="flex flex-col justify-center pl-6">
                <h1 className="mb-2 text-lg">Inicia Sesión</h1>
                <div>
                    <InputB type="text" error={errors?.username} placeholder="Usuario" value={username} handleChange={setUsername} />
                    <InputB type="password" error={errors?.password} placeholder="Contraseña" value={password} handleChange={setPassword} />
                    <button onClick={submitForm} className="w-full py-2 mt-4 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded">
                        Iniciar Sesión
                    </button>
                </div>
                <small>No estas registrado?
                    <Link href="/auth/register" className="ml-1 text-blue-500 uppercase">
                        Registrate con tu correo ABE
                    </Link>
                </small>
            </div>
        </div>
    );
}