import { PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { toast } from 'react-hot-toast';

interface ImageUploadProps {
	setImage: (blob: Blob | null) => void;
	image: Blob | null;
	disabled?: boolean;
    textoComentario: string;
    setTextoComentario: (texto: string)=>void;
}

const ComentarConImagenes: React.FC<ImageUploadProps> = ({ setImage, image, disabled, textoComentario, setTextoComentario }) => {
    const [mostrarDropZone, setMostrarDropZone] = useState(false);
	const [errors, setErrors] = useState('');
	const [base64, setBase64] = useState('');

	const showImageBase64 =	(image: Blob) => {
		if(!image) return;
		const reader = new FileReader();
		reader.onload = (event: any) => {
			setBase64(event.target.result);
		};
		reader.readAsDataURL(image);
	}
	const handleChange = useCallback(
		(blob: Blob) => {
			if(blob?.type.includes('data:image'))
			setImage(blob);
			else {
				setImage(null);
				toast.error('Formato no valido:' + blob.type);
			}
		},
		[setImage],
	);

	const handleDrop = useCallback(
		(files: any, fileRejections: FileRejection[]) => {
			setErrors('');
			if (fileRejections && fileRejections.length > 0) {
				setErrors(fileRejections[0].errors[0].message);
				setImage(null);
				return;
			}
			const file = files[0];
			setImage(file);
			showImageBase64(file);
		},
		[handleChange],
	);

	const { getRootProps, getInputProps } = useDropzone({
		maxFiles: 1,
		maxSize: 2048000,
		onDrop: handleDrop,
		disabled,
		accept: {
			'image/jpeg': [],
			'image/png': [],
		},
	});

	const handlePaste = useCallback((pasteEvent: any) => {
			setErrors('');
			if (pasteEvent.clipboardData == false) return;
			var items = pasteEvent.clipboardData.items;
			if (items == undefined) return;
			setMostrarDropZone(true);
			if(items.length > 1) toast.error('Solo se puede adjuntar una imagen por comentario');
			// Skip content if not image
			const item = items[0];
			if (item.type.indexOf('image') == -1) {toast.error('Solo se pueden adjuntar imagenes'); return;}
			const file = item.getAsFile()
			setImage(file);
			showImageBase64(file);
		},
		[handleChange],
	);

	return (<div className="flex flex-col w-full">
        <div className="flex items-top">
            <textarea
                value={textoComentario}
                onChange={(e) => setTextoComentario(e.target.value)}
                className="flex-1 w-full p-2 text-lg bg-gray-100 rounded-lg outline-none"
                rows={2}
                placeholder="Escribe un comentario..."
                onPaste={handlePaste}
            />
            {!image ? <PhotoIcon onClick={() => {setImage(null); setMostrarDropZone(true);}} className="w-8 -mt-12 text-blue-400" /> :
            <XCircleIcon onClick={() => {setImage(null); setMostrarDropZone(false);}} className="w-8 -mt-12 text-blue-400" />}
        </div>
    	{mostrarDropZone && <div {...getRootProps({
			className: 'w-full text-white text-center border-2 cursor-pointer border-dotted rounded-md border-neutral-700 bg-gray-300',
		})}>
			<input {...getInputProps()} />
			{!!errors && <p className="p-5 text-sm text-red-500 transition-all duration-500 ">{errors}</p>}
			{image ? (
				<div className="relative flex w-full h-32 items-justify-center">
					<Image src={base64} fill objectFit='contain' alt="Imagen por adjuntar" />
				</div>
			) : (
				<p className="text-gray-400">Adjunta una imagen +</p>
			)}
		</div>}
    </div>)
};

export default ComentarConImagenes;
