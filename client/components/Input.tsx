import { KeyIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useSession } from 'next-auth/react';
import MiniAvatar from './MiniAvatar';
import { useState, useRef } from 'react';
import { dividerClasses } from '@mui/material';

function Input() {
    const { data: session } = useSession();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const filePickerRef = useRef(null);

    const sendSS = async () => {
        setLoading(true);
        const ssJson = {
            descripcion: { input },
        };
        //const imageRef = ref('storage', `posts/${session?.user.name}/image`);
        // if (selectedFile) {
        //     await uploadString(imageRef, selectedFile, 'data_url');
        //     const downloadURL = await getDownloadURL(imageRed);
        //     await updateDoc(doc(db, 'posts', docRef.id), {
        //         image: downloadURL,
        //     });
        // }
        setTimeout(() => {
            setInput('');
            setSelectedFile(null);
            setLoading(false);
        }, 5000);
    };

    const postSS = async ()=>{
        if(!session) return;
        const sSBody = {
            usuario_creacion: session.user.name,
        }
        const result = await fetch('api/solicitudServicio', {
            body: JSON.stringify(sSBody),
            method: 'POST',
        })
        const json = await result.json();
        
    }

    const addImageToSS = (e: { target: { files: Blob[] } }) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        };
    };

    return (
        <>
            {session && (
                <div className="flex border-b border-gray-200 p-3 space-x-3">
                    <div>
                        <MiniAvatar
                            usuario={session.user?.name}
                            permisos={session.user?.role}
                        />
                    </div>
                    <div className="w-full divide-y divide-gray-200">
                        <div className="">
                            <textarea
                                className="w-full border-none focus:ring-0 text-lg placeholder-gray-400 tracking-wide min-h-[50px] text-gray-700"
                                rows={2}
                                placeholder="Comentario"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                        </div>
                        {selectedFile && (
                            <div className="relative">
                                <XMarkIcon
                                    onClick={() => setSelectedFile(null)}
                                    className="h-5 text-black absolute cursor-pointer rounded-full bg-slate-100"
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
                                    <div
                                        className=""
                                        onClick={() =>
                                            filePickerRef?.current.click()
                                        }
                                    >
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
                                <button
                                    disabled={!input.trim()}
                                    onClick={sendSS}
                                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                                >
                                    Comentar
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

export default Input;
