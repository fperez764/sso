import React from "react";
import Link from "next/link";
export default function NotFound() {
  return (
    <div className="items-center justify-between text-lg flex flex-col mt-8 font-bold">
      <h1 className="text-2xl">404</h1>
      <p>Pagina no encontrada</p>
      <Link className="cursor-pointer underline" href="/">
        Volver
      </Link>
    </div>
  );
}
