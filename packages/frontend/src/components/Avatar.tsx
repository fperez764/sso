'use client'
 
import { useAuthDispatch, useAuthState } from '@src/context/auth';
import axios from 'axios';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';

export default function Avatar() {
  const { user } = useAuthState();
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();

return user ?
    <div className="flex justify-center mt-auto text-gray-700 xl:justify-start hoverEffect">
        <Image
            className="items-center w-10 h-10 mt-1 ml-2 rounded-full xl:mr-2"
            src={`/images/areas/${user?.area}.png`}
            alt='Area'
            width={64}
            height={64}
            onMouseEnter={() => setShowMore(true)}
            onMouseLeave={()=> setShowMore(false)}
            />
            {showMore && <p className="absolute bg-gray-200 mt-12 ml-1 rounded text-[10px]">{user.rol}</p>}
        <div className="mt-2 mr-4 text-xs xl:text-sm">
            <h4 className="font-bold">{user.username}</h4>
            <p className="text-xs text-center text-gray-500 xl:text-sm">{user?.departamento}-{user?.area}</p>
        </div>
        {/*{simple && <CogIcon className="hidden h-5 xl:ml-8 xl:inline" onClick={()=> router.push('/ajustes')}/>}*/}
    </div>
    : <button onClick={() => {
        router.push('/auth/login');
      }}>Inicia sesión</button>;    
}
