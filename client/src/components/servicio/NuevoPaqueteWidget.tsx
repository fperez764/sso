import { useState, SetStateAction } from "react";
import { toast } from "react-hot-toast"
import { Paquete } from "../../../types/typesSSO";
import InputB from "../InputB"

interface Props {
    paquete?: Paquete;
}

export default function NuevoPaqueteWidget({paquete}: Props) {
const [precio, setPrecio] = useState(paquete?.precio);
const [nombre, setNombre] = useState(paquete?.nombre);
const [descripcion, setDescripcion] = useState(paquete?.descripcion);
const [errors, setErrors] = useState<any>();
type kEvent = { target: { value: SetStateAction<string>}};

const handleAceptar = () => {
    toast.error('Por implementar');
}

const cssButton = `flex p-2 my-1 items-center h-8 text-lg text-sm text-white bg-blue-400 rounded-full shadow-md hover:brightness-95`;

return (
    <div className="flex justify-between">
        <div className='flex flex-col items-start w-3/4'>
            <h2 className='text-sm font-bold'>{paquete ? 'Editar paquete' : 'Nuevo paquete'}</h2>
            <div className='flex space-x-1'>
                <InputB placeholder='Nombre' type='string' value={nombre} handleChange={setNombre} error={errors.nombre}/>
                <InputB placeholder='Precio' type='number' value={precio} handleChange={setPrecio} error={errors.precio}/>
            </div>
            <InputB placeholder='Descripción' type='string' value={descripcion} handleChange={setDescripcion} error={errors.descripcion}/>
        </div>
        <div className="flex flex-col items-center justify-center">
                    <button onClick={handleAceptar} className={cssButton}>Aceptar</button>
        </div>
    </div>
)}