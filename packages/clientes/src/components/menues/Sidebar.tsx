"use client";
import Image from "next/image";
import {
  CalculatorIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuthDispatch, useAuthState } from "@/context/auth";

export default function Sidebar() {
  //const userJSON = localStorage?.getItem("userJSON") || undefined;
  //const user = userJSON ? JSON.parse(userJSON) : '{}';
  const { user } = useAuthState();
  const router = useRouter();
  const dispatch = useAuthDispatch();
  const [opcionesSesion, setOpcionesSesion] = useState(false);
  const pathName = usePathname();
  const routes = pathName.split("/");

  const cerrarSesion = async () => {
    try {
      dispatch("LOGOUT");
      router.push("/");
      toast.success("Cerraste sesión.");
    } catch (err: any) {
      console.error(err);
      toast.error("Algo fallo al cerrar sesión " + err);
    }
  };

  const updateUser = useCallback(
    () => async () => {
      if (!user) return;
      try {
        const res = await axios.get("/auth/me");
        dispatch("UPDATE", res.data);
        return res.data;
      } catch (error) {
        console.error("updatedMe: " + error);
      }
    },
    []
  );

  return <div>
    <div className="w-full bg-sky-700 rounded-sm flex justify-between px-2 text-white items-center sticky top-0">
      <h1 className="font-bold uppercase px-4">{routes[routes.length - 1]}</h1>
      <div className="flex">
        {/*Informacion de usuario */}
        <div className="">
          {user && <div className="rounded-full" onClick={() => setOpcionesSesion(!opcionesSesion)}>
              <Avatar />
          </div>}
          {(opcionesSesion || !user) && (
            <Button
              onClick={
                user
                  ? cerrarSesion
                  : () => {
                      router.push("/");
                    }
              }
              title={user ? 'Cerrar sesión': 'Iniciar sesión'}
            />
          )}
        </div>
      </div>
  </div>
   {/*Menu */}
    <div className="h-18 flex flex-col overflow-auto border-2 border-gray-300">        
    <Link href='/sube/reporte' className='text-slate-800 justify-start bg-white flex items-center hoverEffect p-4 space-x-2'>
      <CalculatorIcon className="w-6 h-6" />
      <span>Megas Utilizados</span>
    </Link>
    <Link href='/sube/pagos' className='text-slate-800 justify-start bg-white flex items-center hoverEffect p-4 space-x-2'>
      <ShoppingCartIcon className="w-6 h-6" />
      <span>Pago de mensualidad y compra de paquetes de megas</span>
    </Link>
    <Link href='/sube/facturas' className='text-slate-800 justify-start bg-white flex items-center hoverEffect p-4 space-x-2'>
      <CurrencyDollarIcon className="w-6 h-6" />
      <span>Facturas electrónicas</span>
    </Link>
    </div>
  </div>
}
