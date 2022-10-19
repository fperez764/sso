import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Categoria } from '../../../types/typesSSO';

interface Props {
    categoria: Categoria,
}

export default function CategoriaWidget({ categoria }: Props) {
  return (
    <div className='p-3 flex border-b border-gray-400'>
        <img
            className="w-12 h-12 mr-4 rounded"
            src={`/images/servicio-categoria/${categoria.nombre}.png`}
            alt={categoria.nombre || 'servicio-categoria'}
        />
        <div className="justify-center hover:underline">
            <h2 className="font-bold">{categoria.descripcion}</h2>
            <p className='text-sm'>Creado el {categoria.fechaCreacion.toString()}</p>
        </div>
    </div>
);}
