import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import InputB from '../../components/InputB';
import Image from 'next/image';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<any>({});
    
    const submitForm = async (event: FormEvent) => {
        event.preventDefault();    
        try {
        setErrors({});
          const res = await axios.post('auth/register', {
            email,
            password,
          });
          toast.success(`Te registraste correctamente.\nUsuario: ${email.split('@')[0]}\nContacta soporte para asignarte area y permisos.`);
          router.push('/auth/login');
        } catch (err: any) {
            toast.error(JSON.stringify(err.response.data));
            setErrors(err.response.data);
        }
      };

    return (        
        <div className='flex bg-gray-100'>
            <Head>
                <title>Registrate</title>
            </Head>
            <div className='flex flex-col items-center justify-center w-full h-screen'>
                <h1 className='mb-2 text-lg font-bold'>Registrate</h1>
                <form onSubmit={submitForm}>
                    <InputB type='email' error={errors?.email} placeholder='Correo ABE' value={email} handleChange={setEmail} />
                    <InputB type='password' error={errors?.password} placeholder='Contraseña' value={password} handleChange={setPassword}/>
                    <button type='submit' className='w-full py-2 mt-4 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded'>
                        Registrarse
                    </button>
                </form>
                <small>Ya estas registrado?
                    <Link href='/auth/login' className='ml-1 text-blue-500 uppercase'>
                        Inicia Sesión
                    </Link>
                </small>
            </div>
        </div>
    );
}
