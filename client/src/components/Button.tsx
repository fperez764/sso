import { XCircleIcon } from '@heroicons/react/24/outline';
import { SVGProps } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
    Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    title?: string;
    onClick: () => void;
    disabled?: boolean;
    titleConfirm?: string;
    children?: React.ReactNode;
    className?: string;
}

function Button({ Icon, title, disabled, onClick, titleConfirm, children, className }: Props) {
    const css = `flex p-2 items-center h-10 text-lg text-white ${disabled ? 'bg-gray-400' : 'bg-blue-400'} rounded-full shadow-md hover:brightness-95 ${className}`;
    const showConfirm = async () => {
        toast((t) => (
            <div className='flex flex-col'>
                <div className="flex ">
                    <h2 className='font-bold'>{titleConfirm}</h2>
                    <XCircleIcon className='self-end w-8 h-8 ml-3'onClick={()=>toast.dismiss(t.id)}/>                    
                </div>
                {children}
                <div className="flex mt-3 space-x-5">
                    <button onClick={()=>{onClick(); toast.dismiss(t.id);}} className={css}>Aceptar</button>
                    <button onClick={()=>toast.dismiss(t.id)} className={css}>Cancelar</button>
                </div>
            </div>
          ), { duration: 60000, position: 'top-center', id: 'confirmButton' });
    };
    return (
        <div className="self-center mx-1">
        <button
            disabled={!!disabled}
            onClick={titleConfirm ? showConfirm : onClick}
            className={css}
        >
            {Icon && <Icon className="w-6 h-6 mx-1"/>}
            {title && <p className="mx-1 text-sm">{title}</p>}
        </button>
        </div>
    );
}

export default Button;
