import { ClipboardIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { CrossIcon } from 'react-select/dist/declarations/src/components/indicators';
import { isUndefined } from 'util';

interface ImageUploadProps {
	onChange: (base64: string) => void;
	value?: string;
	disabled?: boolean;
    textoComentario: string;
    setTextoComentario: (texto: string)=>void;
}

const ComentarConImagenes: React.FC<ImageUploadProps> = ({ onChange, disabled, textoComentario, setTextoComentario }) => {
	const [base64, setBase64] = useState<string|undefined>(undefined);
    const [mostrarDropZone, setMostrarDropZone] = useState(false);
	const [errors, setErrors] = useState('');
	const handleChange = useCallback(
		(imgBase64: string) => {
			onChange(imgBase64);
		},
		[onChange],
	);

	const handleDrop = useCallback(
		(files: any, fileRejections: FileRejection[]) => {
			setErrors('');
			console.log('Type: ' + typeof files[0]);

			if (fileRejections && fileRejections.length > 0) {
				setErrors(fileRejections[0].errors[0].message);
				setBase64(undefined);
				return;
			}
			const file = files[0];
			console.log(file);
			const reader = new FileReader();
			reader.onload = (event: any) => {
				setBase64(event.target.result);
				handleChange(event.target.result);
			};
			reader.readAsDataURL(file);
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

	function handlePaste(pasteEvent: any) {
		if (pasteEvent.clipboardData == false) return;
		var items = pasteEvent.clipboardData.items;
		if (items == undefined) {toast.error('Ctrl+V no tiene una imagen valida'); return;}
        setMostrarDropZone(true);
        if(items.length > 1) toast.error('Solo se puede adjuntar una imagen por comentario');
        // Skip content if not image
        const item = items[0];
        if (item.type.indexOf('image') == -1) {toast.error('Solo se pueden adjuntar imagenes'); return;}
        // Retrieve image on clipboard as blob
        var blob = item.getAsFile();
        const URLObject = window.URL || window.webkitURL;
        const srcImage = URLObject.createObjectURL(blob);
        setBase64(srcImage);
        handleChange(srcImage);
	}

	return (<div className="flex flex-col">
        <div className="flex">
            <input
                value={textoComentario}
                onChange={(e) => setTextoComentario(e.target.value)}
                className="flex-1 w-full p-2 text-lg bg-gray-100 rounded-lg outline-none"
                type="text"
                placeholder="Escribe un comentario..."
                onPaste={handlePaste}
            />
            {!base64 ? <PhotoIcon onClick={() => {setBase64(undefined); setMostrarDropZone(true);}} className="w-12 mx-2 text-blue-400" /> :
            <XCircleIcon onClick={() => {setBase64(undefined); setMostrarDropZone(false);}} className="w-12 mx-2 text-blue-400" />}
        </div>
    	{mostrarDropZone && <div {...getRootProps({
			className: 'w-full text-white text-center border-2 cursor-pointer border-dotted rounded-md border-neutral-700',
		})}>
			<input {...getInputProps()} />
			{!!errors && <p className="p-5 text-sm text-red-500 transition-all duration-500 ">{errors}</p>}
			{base64 ? (
				<div className="flex items-justify-center">
					<Image src={base64} height="100" width="100" alt="Imagen por adjuntar" />
				</div>
			) : (
				<p className="text-gray-400">Adjunta una imagen +</p>
			)}
		</div>}
    </div>)
};

export default ComentarConImagenes;
