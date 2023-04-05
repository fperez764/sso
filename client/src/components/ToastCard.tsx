import { XCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast"
import Button from "./Button";

export default function toastCard (children:JSX.Element , title: string, onAccept: ()=>void) {
    toast((t) => (
        <div className='flex flex-col'>
            <div className='flex justify-between'>
                <h1 className="font-bold text-[17px] hover:underline">{title}</h1>
                <XCircleIcon className='w-8 h-8 self-end cursor-pointer text-red-500'onClick={()=>{toast.dismiss(t.id)}}/>
            </div>
            {children}
            <Button title='Aceptar' onClick={()=> {onAccept(); toast.dismiss(t.id);}} />
        </div>
      ), {duration: 100000});
};
