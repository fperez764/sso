"use client";

import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthState } from "@/context/auth";

export default function Avatar() {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();
  const {authenticated, user} = useAuthState();

  return user ? (
    <div className="flex justify-center mt-auto text-gray-200 xl:justify-start hoverEffect">
      {user?.area && <Image
        className="items-center w-10 h-10 mt-1 ml-2 rounded-full xl:mr-2"
        src={`/areas/${user?.area}.png`}
        alt="Area"
        width={64}
        height={64}
        onMouseEnter={() => setShowMore(true)}
        onMouseLeave={() => setShowMore(false)}
      />}
      {showMore && (
        <p className="absolute bg-gray-200 mt-12 ml-1 rounded text-[10px]">
          {user.rol}
        </p>
      )}
      <div className="mt-2 mr-4 text-xs xl:text-sm">
        <h4 className="font-bold">{user.persona ? `${user.persona.nombres} ${user.persona.primerApellido || ''}` : user.razonSocial }</h4>
        <p className="text-xs text-center text-gray-100 xl:text-sm">
          {user?.numeroDocumento}
        </p>
      </div>
      {/*{simple && <CogIcon className="hidden h-5 xl:ml-8 xl:inline" onClick={()=> router.push('/ajustes')}/>}*/}
    </div>
  ) : (
    <button
      onClick={() => {
        router.push("/");
      }}
    >
      Inicia sesión
    </button>
  );
}
