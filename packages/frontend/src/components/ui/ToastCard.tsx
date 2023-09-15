import { XCircleIcon } from '@heroicons/react/24/outline';
import { toast, ToastPosition } from 'react-hot-toast';
import Button from './Button';

export default function ToastCard (children:JSX.Element , onAccept?: ()=>void, title?: string, position?: ToastPosition) {
    toast((t) => (
        <div className='flex flex-col items-start bg-white rounded-md resize-x'>
            <div className='flex justify-between'>
                {title && <h1 className='font-bold text-[17px] hover:underline'>{title}</h1>}
                <XCircleIcon className='self-end w-8 h-8 text-red-500 cursor-pointer'onClick={()=>toast.dismiss(t.id)}/>
            </div>
            {children}
            {!!onAccept && <Button title='Aceptar' onClick={()=> {onAccept(); toast.dismiss(t.id);}} />}
        </div>
      ), { duration: 10000000, position: position || 'top-center', className: '' });
};
