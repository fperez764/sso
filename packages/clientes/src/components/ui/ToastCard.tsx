import { XCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import Button from './Button';

export default function ToastCard (children:JSX.Element , onAccept: ()=>void, className='', title?: string, confirm?: string) {
    toast((t) => (
        <div className={`flex flex-col items-start bg-white rounded-md resize-x ${className}`}>
            <div className='flex justify-between w-full'>
                {title && <h1 className='font-bold text-[17px] hover:underline'>{title}</h1>}
                <XCircleIcon className='self-end w-8 h-8 text-red-500 cursor-pointer'onClick={()=>toast.dismiss(t.id)}/>
            </div>
            {children}
            <Button title={confirm ||'Aceptar'} onClick={()=> {onAccept(); toast.dismiss(t.id);}} />
        </div>
      ), { duration: 10000000, position: 'top-center', className: '' });
};
