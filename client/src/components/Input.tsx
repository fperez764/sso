import Avatar from './Avatar';
import { useAuthState } from '../context/auth';
import Button from './Button';
import router from 'next/router';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface Props {
    postName: string;
    children: any;
    handleClean: ()=>void;
    handleRefresh?:any;
    getBody: () => Record<string, unknown>;
    endpoint: string;
    setErrors?: any;
    editar?: boolean
    className?: string;
    setShowNew?: any;
}

export default function Input( {className, getBody, endpoint, handleClean, handleRefresh, postName, children, setErrors, editar, setShowNew} : Props) {
    const { user } = useAuthState();

    const handlePost = async () => {
		const tSend = toast.loading(`${editar ? 'Editar' : 'Crear'} ${postName}...`);
		try {
			!!setErrors && setErrors({});
			const res = editar 
                ? await axios.put(endpoint, getBody()) 
                : await axios.post(endpoint, getBody());
			toast.success(`${editar ? 'Edición' : 'Registro'} de ${postName} completo: ${JSON.stringify(res.data)}`, { id: tSend });
			handleClean();
			!!handleRefresh && handleRefresh();
		} catch (err: any) {
			toast.error('Algo salio mal: ' + (JSON.stringify(err.response?.data) || err.error || JSON.stringify(err)), { id: tSend });
			err.response?.data && !!setErrors && setErrors(err.response.data);
		}
	};

    return (
    <div className={className}>
        {user
        ? <div className='flex flex-col items-center bg-gray-100 border-b border-gray-200'> 
            <h2 className='mt-3 text-lg font-bold text-center'>{`${editar ? 'Editar' : 'Crear'} ${postName}`}</h2>
            <div className='ml-3 w-[90%]'>
                {children}
            </div>
            <div className='flex justify-center my-2'>
                <div className='flex w-52 hoverEffect'>
                <Avatar usuario={user} />
                <Button onClick={handlePost} title={`${editar ? 'Editar' : 'Crear'} ${postName}`} titleConfirm={`${editar ? 'Se modificara al' : 'Se creara al'} ${postName}`}/>
                </div>
                {handleClean == null ? null : <Button onClick={handleClean} title='Limpiar'/>}
                {setShowNew && <Button title='Cancelar' onClick={()=>setShowNew(false)}/>}
            </div>
        </div>
        : <div className='mt-2 ml-2'><Button onClick={()=>router.push('/auth/login')} title='Iniciar Sesión'/></div>}
    </div>);
}