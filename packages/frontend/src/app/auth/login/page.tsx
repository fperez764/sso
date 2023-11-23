'use client';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuthDispatch } from '../../../context/auth';
import Image from 'next/image';
import Loading from '@src/components/ui/Loading';
import InputB from '@src/components/ui/InputB';

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<any>({});
    const dispatch = useAuthDispatch();

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
        setErrors({});
          const res = await axios.post('/auth/login', {
            password,
            username,
          });
          dispatch('LOGIN', res.data );
          setLoading(false);
          router.push('/tickets');
          toast.success(`Bienvenid@ ${username}`)
        } catch (err: any) {
          console.error(err);
            setErrors(err.response?.data);
            toast.error(`Algo salio mal: Porfavor reintente\n`+ err.response?.data?.message);
            setLoading(false);
        }
      };

      

    return loading ? <Loading />
        : <div className='flex bg-gray-100'>
            <Head>
                <title>Inicia Sesión</title>
            </Head>
            <div className='flex flex-col items-center justify-center w-full h-screen'>
                <h1 className='mb-2 text-lg font-bold'>Inicia Sesión</h1>
                <p className='text-sm'>LDAP: Mismas credenciales del correo zimbra</p>
                <form onSubmit={submitForm}>
                    <InputB type='text' errors={errors} placeholder='Usuario' value={username} handleChange={setUsername} />
                    <InputB type='password' errors={errors} placeholder='Contraseña' value={password} handleChange={setPassword} />
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
}