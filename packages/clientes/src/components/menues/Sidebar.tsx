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
  const { user, authenticated } = useAuthState();
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
    <div className="sticky top-0 flex items-center justify-between w-full px-2 text-white rounded-sm bg-sky-700">
      <h1 className="px-4 font-bold uppercase">{routes[routes.length - 1]}</h1>
      <div className="flex">
        {/*Informacion de usuario */}
        <div className="flex">
          {user && <div className="rounded-full" onClick={() => setOpcionesSesion(!opcionesSesion)}>
              <Avatar />
          </div>}
          {(opcionesSesion || !user) && (
            <>
            <Button
              onClick={
                user
                  ? cerrarSesion
                  : () => {
                      router.push("/");
                    }
              }
              title={user ? 'Cambiar contraseña': ''}
            />
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
            </>
          )}
        </div>
      </div>
  </div>
   {/*Menu */}
    <div className="flex flex-col overflow-auto border-2 border-gray-300 h-18">        
    {user?.clientePlanes.find(p => p.plan.servicio.nombre === 'SUBE') && 
    <Link href='/sube/reporte' className='flex items-center justify-start p-4 space-x-2 bg-white text-slate-800 hoverEffect'>
      <CalculatorIcon className="w-6 h-6" />
      <span>Megas Utilizados</span>
    </Link>}
    {user?.clientePlanes.find(p => p.plan.servicio.nombre === 'SUBE') && 
    <Link href='/sube/pagos' className='flex items-center justify-start p-4 space-x-2 bg-white text-slate-800 hoverEffect'>
      <ShoppingCartIcon className="w-6 h-6" />
      <span>Pago de mensualidad y compra de paquetes de megas</span>
    </Link>}
    <Link href='/sube/facturas' className='flex items-center justify-start p-4 space-x-2 bg-white text-slate-800 hoverEffect'>
      <CurrencyDollarIcon className="w-6 h-6" />
      <span>Facturas electrónicas</span>
    </Link>
    </div>
  </div>
}
