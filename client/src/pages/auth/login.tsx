import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import InputB from '../../components/InputB';
import { useAuthDispatch, useAuthState } from '../../context/auth';
import Image from 'next/image';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});
    const dispatch = useAuthDispatch();
    const { authenticated } = useAuthState();

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        try {
        setErrors({});
          const res = await axios.post('/auth/login', {
            password,
            username,
          });
          dispatch('LOGIN', res.data );
          router.push('/tickets?seccion=asignados');
        } catch (err: any) {
          console.error(err);
            setErrors(err.response?.data);
            toast.error(`${err.message}: ${JSON.stringify(err.response?.data)}`);
        }
      };

      

    return (        
        <div className='flex bg-gray-100'>
            <Head>
                <title>Inicia Sesión</title>
            </Head>
            <div className='flex flex-col items-center justify-center w-full h-screen'>
                <h1 className='mb-2 text-lg font-bold'>Inicia Sesión</h1>
                <form onSubmit={submitForm}>
                    <InputB type='text' error={errors?.username} placeholder='Usuario' value={username} handleChange={setUsername} />
                    <InputB type='password' error={errors?.password} placeholder='Contraseña' value={password} handleChange={setPassword} />
                    <button type='submit' className='w-full py-2 mt-4 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded'>
                        Iniciar Sesión
                    </button>
                </form>
                <small>No estas registrado?
                    <Link href='/auth/register' className='ml-1 text-blue-500 uppercase'>
                        Registrate con tu correo ABE
                    </Link>
                </small>
            </div>
        </div>
    );
}