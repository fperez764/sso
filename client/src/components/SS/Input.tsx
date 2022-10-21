import { KeyIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import MiniAvatar from '../MiniAvatar';
import { useState, useRef, MouseEventHandler } from 'react';
import { useAuthState } from '../../context/auth';
import Button from '../Button';
import router from 'next/router';

interface Props {
    title: string,
    placeholder: string,
    handleNew: MouseEventHandler<HTMLButtonElement>
}
function Input({ title, placeholder, handleNew }: Props) {
    const { user } = useAuthState();
    const [inputEnabled, setInputEnabled] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const filePickerRef = useRef(null);

    const handleClick = () => {
        setLoading(true);
        handleNew;
        setInput('');
        setSelectedFile(null);
        setLoading(false);

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

    const 

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
                        placeholder={placeholder}
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
                            onClick={handleClick}
                            className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                        >
                            {title}
                        </button>
                    </div>
                )}
            </div>
        </div>
    ): )}</>
    );
}

export default Input;
