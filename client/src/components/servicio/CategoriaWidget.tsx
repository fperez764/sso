/** @format */

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Categoria } from '../../../types/typesSSO';
import Image from 'next/image';

interface Props {
	categoria: Categoria;
}

export default function CategoriaWidget({ categoria }: Props) {
	return (
		<div className="flex p-3 border-b border-gray-400">
			<Image className="w-12 h-12 mr-4 rounded" src={`/images/servicio-categoria/${categoria.nombre}.png`} alt={categoria.nombre || 'servicio-categoria'} />
			<div className="justify-center hover:underline">
				<h2 className="font-bold">{categoria.descripcion}</h2>
				<p className="text-sm">Creado el {categoria.fechaCreacion.toString()}</p>
			</div>
		</div>
	);
}
