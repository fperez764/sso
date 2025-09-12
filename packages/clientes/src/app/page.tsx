"use client";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Loading from "@/app/Loading";
import InputB from "@/components/ui/InputB";
import { useRouter } from "next/navigation";
import { useAuthDispatch, useAuthState } from "@/context/auth";
import { getClientes } from "./api/route";
import Popup from "./popup";
export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const dispatch = useAuthDispatch();
  const { authenticated } = useAuthState();
  const router = useRouter();
  //variable para mostrar el popup
  const [openPopup, setOpenPopup] = useState(true);

  const handleClosePopup = () => {
    setOpenPopup(false);
  };
  
  const submitForm = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      setErrors({});
      const cliente = await getClientes(username, password);
      console.log(cliente);
      const resAuth = dispatch("LOGIN", cliente);
      toast.success(`Bienvenido ${cliente?.razonSocial || username}`);
      router.push("/sube/pagos");
    } catch (err: any) {
      console.error(err);
      setErrors(err.response?.data);
      toast.error(`No se pudo iniciar sesión. Porfavor contacte a soporte.`);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-1 items-center justify-center">
        <div className="items-center justify-between text-lg lg:flex">
          {loading ? (
            <Loading />
          ) : (
            <div className="flex">
              <div className="flex flex-col items-center justify-center w-full h-auto">
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
        <Popup open={openPopup} onClose={handleClosePopup} />
      </main>
      <footer className="py-4 px-2 bg-gray-100 border-t border-gray-300 text-center text-sm text-gray-700 w-full">
        <div>
          <strong>Dirección:</strong> Edificio &quot;Centro de Negocios Obrajes&quot;, zona Obrajes, calle 16 número 220, Av. Prolongación Costanerita, Piso 5to, Of. 510. La Paz, Bolivia
        </div>
        <div>
          <strong>Horario de atención:</strong> 09:30 a 13:30
        </div>
      </footer>
    </div>
  );
}
