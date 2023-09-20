"use client";
import React from "react";
import Image from "next/image";
import { DevicePhoneMobileIcon, PhoneIcon } from "@heroicons/react/24/solid";
import { EnvelopeIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import Sidebar from "@/components/menues/Sidebar";
import { useAuthState } from "@/context/auth";
import Link from "next/link";

export default function Layout({ children }: { children: React.ReactNode }) {
  const {user} = useAuthState();
  return (
    <div className="flex flex-col p-2 md:max-h-screen overflow-auto">
      <Image
        src="/images/logoABESube.png"
        alt="Logo"
        width={200}
        height={200}
        priority={false}
      />
      <Sidebar />
      <main className="px-8 my-8">{
        user ? children 
        : <Link href='/' className="font-bold hover:text-sky-500 hover:underline">No pudimos recuperar su información. Por favor ingrese de nuevo o contacte soporte.</Link>
      }</main>
      <footer className="flex flex-col mt-12 px-4 w-[98%] space-y-2">
        <p>Si tienes consultas contáctanos:</p>
        <p className="ml-3 flex items-center space-x-2">
          <PhoneIcon className="h-4 w-4 mx-2" /> Linea gratuita <a target='_blank' href='tel:800102232' >800102232</a>
        </p>
        <p className="ml-3 flex items-center space-x-2">
          <DevicePhoneMobileIcon className="h-4 w-4 mx-2" /> Envianos un mensaje
          al <a target='_blank' href='https://wa.link/1638d4'>Whatsapp 68210096</a>
        </p>
        <p className="ml-3 flex items-center space-x-2">
          <EnvelopeIcon className="h-4 w-4 mx-2" /> Envianos un correo a
          <a href='mailto:abe@abe.bo' target='_blank'>sube@abe.bo</a>
        </p>
        <p className="ml-3 flex items-center space-x-2">
          <GlobeAltIcon className="h-4 w-4 mx-2" /> Ó siguenos en el 
          <a href='https://www.facebook.com/subeinternetsatelital' target='_blank'>Facebook: SUBE</a>
        </p>
        <p className="w-full text-center ">© 2023 ABE-Sube</p>
      </footer>
    </div>
  );
}
