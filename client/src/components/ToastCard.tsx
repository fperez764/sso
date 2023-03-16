import { XCircleIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast"

export const toastCard = (children:JSX.Element , title: string) => {
    toast((t) => (
        <div className='flex flex-col'>
            <div className='flex justify-between'>
                <h1 className="font-bold text-[17px] hover:underline">{title}</h1>
                <XCircleIcon className='w-6 h-6 self-end cursor-pointer'onClick={()=>{toast.dismiss(t.id)}}/>
            </div>
            {children}
        </div>
      ));
};
