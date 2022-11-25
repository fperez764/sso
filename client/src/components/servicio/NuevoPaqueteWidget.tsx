import { useState, SetStateAction } from "react";
import { toast } from "react-hot-toast"
import { Paquete } from "../../../types/typesSSO";
import InputA from "../InputA"

interface Props {
    paquete?: Paquete;
    handleCancelar: () => void;
}

export default function NuevoPaqueteWidget({paquete, handleCancelar}: Props) {
const [precio, setPrecio] = useState(paquete?.precio);
const [nombre, setNombre] = useState(paquete?.nombre);
const [descripcion, setDescripcion] = useState(paquete?.descripcion);
const [errors, setErrors] = useState({});
type kEvent = { target: { value: SetStateAction<string>}};

const handleAceptar = () => {
    toast.error('Por implementar');
    handleCancelar();
}

const cssButton = `flex p-2 my-1 items-center h-8 text-lg text-sm text-white bg-blue-400 rounded-full shadow-md hover:brightness-95`;

return (
    <div className="flex justify-between">
        <div className='flex flex-col items-start w-3/4'>
            <h2 className='font-bold text-sm'>Editar Paquete</h2>
            <div className='flex space-x-1'>
                <InputA placeholder='Nombre' type='string' value={nombre} handleChange={(e: kEvent) => setNombre(e.target.value)} error={errors.nombre}/>
                <InputA placeholder='Precio' type='number' value={precio} handleChange={(e: kEvent) => setPrecio(e.target.value)} error={errors.precio}/>
            </div>
            <InputA placeholder='Descripción' type='string' value={descripcion} handleChange={(e: kEvent) => setDescripcion(e.target.value)} error={errors.descripcion}/>
        </div>
        <div className="flex flex-col items-center justify-center">
                    <button onClick={handleAceptar} className={cssButton}>Aceptar</button>
                    <button onClick={handleCancelar} className={cssButton}>Cancelar</button>
        </div>
    </div>
)}