import { Paquete } from "../../../types/typesSSO"

interface Props {
    paquete: Paquete,
}

function PaqueteWidget({paquete}: Props) {
return (
<div className="flex justify-between border-b border-gray-500">
    <div className="">
        <div className="flex space-x-1 text-lg">
            <h1>Paquete:</h1>
            <h2 className="font-bold">{paquete.nombre}</h2>
            <p className="text-sm font-bold">{paquete.precio} Bs.</p>
        </div>
        <p>{paquete.descripcion}</p>
    </div>
    <div className="w-24 ml-2 text-sm border-black">
        <h4 className="bg-green-300">Regular: {paquete.mbRegular}</h4>
        <h4 className="bg-blue-200">Bono: {paquete.mbBono}</h4>
        <h4 className="bg-orange-200">Recargo: {paquete.mbRecargo}</h4>
    </div>
</div>
)}

export default PaqueteWidget
