"use client";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Loading from "@/app/Loading";
import InputB from "@/components/ui/InputB";
import { useRouter } from "next/navigation";
import { getCliente, ssoInstance } from "./api/route";
import { useAuthDispatch, useAuthState } from "@/context/auth";
export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();
  const router = useRouter();
  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      setErrors({});
      const res = await getCliente();
      dispatch("LOGIN", res.data.datos);
      toast.success(`Bienvenido ${res.data.datos?.razonSocial || username}`);
      router.push("/sube/reporte");
    } catch (err: any) {
      console.error(err);
      setErrors(err.response?.data);
      toast.error(`Algo salio mal al iniciar sesión`);
    }
    setLoading(false);
  };

  return (
    <main className="flex items-center justify-center">
      <div className="items-center justify-between text-lg lg:flex">
        {loading ? (
          <Loading />
        ) : (
          <div className="flex">
            <div className="flex flex-col items-center justify-center w-full h-screen">
              <Image
                src="/images/logoABE.png"
                alt="Logo"
                width={200}
                height={200}
              />
              <h1 className="mb-4 text-lg font-bold">Inicia Sesión</h1>
              <form onSubmit={submitForm}>
                <InputB
                  type="text"
                  errors={errors}
                  placeholder="CI/NIT"
                  value={username}
                  handleChange={setUsername}
                />
                <InputB
                  type="password"
                  errors={errors}
                  placeholder="Contraseña"
                  value={password}
                  handleChange={setPassword}
                />
                <button
                  type="submit"
                  className="w-full py-2 mt-4 mb-4 text-xs font-bold text-white uppercase bg-blue-500 border-blue-500 rounded"
                >
                  Ingresar
                </button>
              </form>
              {!!process.env.NEXT_PUBLIC_VERSION && <p>Clientes v{process.env.NEXT_PUBLIC_VERSION}</p>}
              <p className="text-sm">
                Si no puedes ingresar, envíe un email a soporte@abe.bo indicando su nombre o llamando la linea gratuita 800102232
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
