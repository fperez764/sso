import { KeyIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import MiniAvatar from '../MiniAvatar';
import { useState, useRef, MouseEventHandler } from 'react';
import { useAuthState } from '../../context/auth';
import Button from '../Button';
import router from 'next/router';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function Input() {
    const { user } = useAuthState();
    const [inputEnabled, setInputEnabled] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const filePickerRef = useRef(null);

    const handleClick = () => {
        setLoading(true);
        postSS(input);
        setInput('');
        setSelectedFile(null);
        setLoading(false);

    };

	const sendSS = async () => {
		//const imageRef = ref('storage', `posts/${session?.user.name}/image`);
		// if (selectedFile) {
		//     await uploadString(imageRef, selectedFile, 'data_url');
		//     const downloadURL = await getDownloadURL(imageRed);
		//     await updateDoc(doc(db, 'posts', docRef.id), {
		//         image: downloadURL,
		//     });
		// }
		setTimeout(() => {
			console.log('test sendSS');
		}, 5000);
	};

	const postSS = async (body: string) => {
		const tSS = toast.loading('Creando solicitud...');
        try{
		let bodyJSON = JSON.parse(body);
		if (!user) return;
		bodyJSON = { ...bodyJSON, usuarioCreacion: user.username };
		const res = await axios.post('/solicitudServicio', {
			body: JSON.stringify(bodyJSON),
		});
		toast.success('Solicitud creada: ' + JSON.stringify(res.data), { id: tSS });
        }catch(err){
            toast.error('Algo salio mal: ' + err, { id: tSS });
        }
	};

    const addImageToSS = (e: any ) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
                setSelectedFile(readerEvent.target.result);
        };
    };

    return (
        <>{user ? (
        <div className="flex p-3 space-x-3 bg-white border-b border-gray-200"> 
            <div>
                <MiniAvatar
                    usuario={user}
                />
            </div>
            <div className="w-full divide-y divide-gray-200">
                <div className="">
                    <textarea
                        className="w-full ml-2 border-none focus:ring-0 text-lg placeholder-gray-400 tracking-wide min-h-[50px] text-gray-700"
                        rows={2}
                        placeholder='Descripción de nueva solicitud de servicio'
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>
                {selectedFile && (
                    <div className="relative">
                        <XMarkIcon
                            onClick={() => setSelectedFile(null)}
                            className="absolute h-5 text-black rounded-full cursor-pointer bg-slate-100"
                        />
                        <img
                            src={selectedFile}
                            className={`${loading && 'animate-pulse'}`}
                        />
                    </div>
                )}
                {!loading && (
                    <div className="flex items-center justify-between pt-2.5">
                        <div className="flex">
                            <div onClick={() => filePickerRef?.current.click()}>
                                <PhotoIcon className="h-10 w-10 hoverEffect p=2 text-sky-500 hover:bg-sky-100" />
                                <input
                                    type="file"
                                    hidden
                                    ref={filePickerRef}
                                    onChange={addImageToSS}
                                />
                            </div>
                            <KeyIcon className="h-10 w-10 hoverEffect p=2 text-sky-500 hover:bg-sky-100" />
                        </div>
                        <Button
                            disabled={input.length === 0}
                            onClick={handleClick}
                            title='Nueva SS'
                        />
                    </div>
                )}
            </div>
        </div>
    ):<Button onClick={()=>router.push('/auth/login')} title='Iniciar Sesión'/>}
    </>
    );
}

export default Input;
