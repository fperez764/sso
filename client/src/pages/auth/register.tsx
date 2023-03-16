import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import router from 'next/router';
import { FormEvent, useState } from 'react';
import { toast } from 'react-hot-toast';
import InputB from '../../components/InputB';

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
          router.push('/auth/login');
        } catch (err: any) {
            toast.error(JSON.stringify(err.response.data));
            setErrors(err.response.data);
        }
      };

    return (        
        <div className="flex bg-gray-100">
            <Head>
                <title>Registrate</title>
            </Head>
            <img className="h-screen bg-center bg-cover w-80 " src="\images\space.jpg"/>
            <div className="flex flex-col justify-center pl-6">
                <h1 className="mb-2 text-lg">Registrate</h1>
                <form>
                    <InputB type="email" error={errors?.email} placeholder="Correo ABE" value={email} handleChange={setEmail} />
                    <InputB type="password" error={errors?.password} placeholder="Contraseña" value={password} handleChange={setPassword}/>
                    <button onClick={submitForm} className="w-full py-2 mt-4 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded">
                        Registrarse
                    </button>
                </form>
                <small>Ya estas registrado?
                    <Link href="/auth/login" className="ml-1 text-blue-500 uppercase">
                        Inicia Sesión
                    </Link>
                </small>
            </div>
        </div>
    );
}
