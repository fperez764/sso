import { XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';

interface ImageUploadProps{
    onChange: (base64: string) => void;
    label: string;
    value?: string;
    disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({onChange, label, value, disabled}) => {
    const [base64, setBase64] = useState();
    const [errors, setErrors] = useState('');
    const handleChange = useCallback((base64: string)=> {
        onChange(base64);
    }, [onChange]);

    const handleDrop = useCallback((files: any, fileRejections: FileRejection[])=>{
        setErrors('');
        if(fileRejections && fileRejections.length > 0){ 
            setErrors(fileRejections[0].errors[0].message); 
            setBase64(undefined);
            return;}
        const file = files[0];
        const reader = new FileReader();
        reader.onload = (event: any)=>{
            setBase64(event.target.result);
            handleChange(event.target.result);
        }
        reader.readAsDataURL(file);
    },[handleChange]);

    const {getRootProps, getInputProps} = useDropzone({
        maxFiles: 1,
        maxSize: 2048000,
        onDrop: handleDrop,
        disabled,
        accept: {
            'image/jpeg':[],
            'image/png':[]
        }
    });

    return(<div
        {...getRootProps({
            className:'w-full p-4 text-white text-center border-2 cursor-pointer border-dotted rounded-md border-neutral-700'
        })}>
            <input {...getInputProps()}/>
            {!!errors && <p className='p-5 text-sm text-red-500 transition-all duration-500 '>
            {errors}</p>}
            {                
                base64? <div className='flex items-justify-center'>
                    <Image src={base64} height='100' width='100' alt='Imagen por adjuntar'/>
                </div> 
                : <p className='text-gray-400'>{label}</p>
            }
    </div>)}

export default ImageUpload;