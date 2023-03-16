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
    handleCancel?: ()=>void;
    handleRefresh?:any;
    getBody: () => {};
    endpoint: string;
    setErrors?: any;
    editar?: boolean
    className?: string;
}

export default function Input( {className, getBody, endpoint, handleClean, handleCancel, handleRefresh, postName, children, setErrors, editar} : Props) {
    const { user } = useAuthState();

    const handlePost = async () => {
		const tSend = toast.loading(`${editar ? 'Editar' : 'Crear'} ${postName}...`);
		try {
			!!setErrors && setErrors({});
			const res = editar 
                ? await axios.put(endpoint, getBody()) 
                : await axios.post(endpoint, getBody());
			toast.success(`${editar ? 'Edición' : 'Registro'} de ${postName} completo: ${JSON.stringify(res.data)}`, { id: tSend });
			!!handleCancel ? handleCancel() : handleClean();
			!!handleRefresh && handleRefresh();
		} catch (err: any) {
			toast.error('Algo salio mal: ' + (JSON.stringify(err.response?.data) || err.error || JSON.stringify(err)), { id: tSend });
			err.response?.data && !!setErrors && setErrors(err.response.data);
		}
	};

    return (
    <div className={className}>
        {user
        ? <div className="flex flex-col bg-white border-b border-gray-200"> 
            <h2 className="text-lg font-bold text-center">{`${editar ? 'Editar' : 'Crear'} ${postName}`}</h2>
            <div className='self-end mr-5'>
                <Avatar usuario={user} />
            </div>
            <div className='flex flex-col justify-items-center ml-3 w-[90%] max-w-2xl'>
                {children}
            </div>
            <div className="flex justify-center my-2 ml-2">
                <Button onClick={handlePost} title={`${editar ? 'Editar' : 'Crear'} ${postName}`}/>
                {handleClean == null ? null : <Button onClick={handleClean} title='Limpiar' />}
                <Button onClick={handleCancel || handleClean} title='Cancelar'/>
            </div>
        </div>
        : <div className="mt-2 ml-2"><Button onClick={()=>router.push('/auth/login')} title='Iniciar Sesión'/></div>}
    </div>);
}