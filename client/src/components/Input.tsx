import { KeyIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Avatar from './Avatar';
import { useState, useRef } from 'react';
import { useAuthState } from '../context/auth';
import Button from './Button';
import router from 'next/router';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface Props {
    postName: string;
    children: any;
    imageSupport? : boolean;
    handleClean: ()=>void;
    handleCancel: ()=>void;
    handleRefresh?:any;
    getBody: () => {};
    endpoint: string;
    setErrors: any;
    editar: boolean
}

export default function Input( {getBody, endpoint, handleClean, handleCancel, handleRefresh, postName, children, imageSupport, setErrors, editar} : Props) {

    const { user } = useAuthState();
    const [selectedFile, setSelectedFile] = useState(null);
    const filePickerRef = useRef(null);

    const handlePost = async () => {
		const tSend = toast.loading(`${editar ? 'Editar' : 'Crear'} ${postName}...`);
		try {
			setErrors({});
			const res = editar 
                ? await axios.put(endpoint, getBody()) 
                : await axios.post(endpoint, getBody());
			toast.success(`${editar ? 'Edición' : 'Registro'} de ${postName} completo: ${JSON.stringify(res.data)}`, { id: tSend });
			handleCancel();
			!!handleRefresh && handleRefresh();
		} catch (err: any) {
			toast.error('Algo salio mal: ' + (JSON.stringify(err.response?.data) || err.error || JSON.stringify(err)), { id: tSend });
			err.response?.data && setErrors(err.response.data.errors);
		}
	};

    const handleClick = () => {
        handlePost();
        setSelectedFile(null);
    };
    
    const addImage = (e: any ) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
                setSelectedFile(readerEvent.target.result);
        };
    };

    const imageButton =
        (<div>
            {selectedFile && (
                <div className="relative">
                    <XMarkIcon
                        onClick={() => setSelectedFile(null)}
                        className="absolute h-5 text-black rounded-full cursor-pointer bg-slate-100"
                    />
                    <img
                        src={selectedFile}
                    />
                </div>
            )}
            <div className="flex items-center justify-between pt-2.5">
                <div className="flex">
                    <div onClick={() => filePickerRef?.current.click()}>
                        <PhotoIcon className="h-10 w-10 hoverEffect p=2 text-sky-500 hover:bg-sky-100" />
                        <input
                            type="file"
                            hidden
                            ref={filePickerRef}
                            onChange={addImage}
                        />
                    </div>
                    <KeyIcon className="h-10 w-10 hoverEffect p=2 text-sky-500 hover:bg-sky-100" />
                </div>
            </div>
        </div>
        );

    return (
    <div className='w-full'>
        {user
        ? <div className="flex flex-col bg-white border-b border-gray-200"> 
            <h2 className="text-lg font-bold text-center">{`${editar ? 'Editar' : 'Crear'} ${postName}`}</h2>
            <div className='self-end mr-5'>
                <Avatar usuario={user} />
            </div>
            <div className='flex flex-col items-center ml-3'>
                {children}
            </div>
            {imageSupport && imageButton}
            <div className="flex justify-center my-2 ml-2">
                <Button onClick={handleClick} title={`${editar ? 'Editar' : 'Crear'} ${postName}`}/>
                {handleClean == null ? null : <Button onClick={handleClean} title='Limpiar' />}
                <Button onClick={handleCancel} title='Cancelar'/>
            </div>
        </div>
        : <div className="mt-2 ml-2"><Button onClick={()=>router.push('/auth/login')} title='Iniciar Sesión'/></div>}
    </div>);
}