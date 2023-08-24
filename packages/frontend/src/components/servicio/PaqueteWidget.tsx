import { useState } from 'react';
import { CogIcon } from '@heroicons/react/24/outline';
import NuevoPaqueteWidget from './NuevoPaqueteWidget';
import { useAuthState } from '../../context/auth';
import { ServicioPaquete, users_rol_enum } from '@types/typesSSO';

interface Props {
	paquete: ServicioPaquete;
}

function PaqueteWidget({ paquete }: Props) {
	const { user } = useAuthState();
	const admin = user?.rol === users_rol_enum.ADMIN;

	const [mostrarMas, setMostrarMas] = useState(false);
	const [editarPaquete, setEditarPaquete] = useState(false);
	const css = 'justify-between rounded border-y border-x my-2 px-2 border-gray-500';

	const editarPaqueteComponent = (
		<div className={css}>
			<NuevoPaqueteWidget paquete={paquete} />
		</div>
	);
	const paqueteComponent = (
		<div className={css + ' flex'} onClick={() => setMostrarMas(!mostrarMas)}>
			<div className="flex flex-col justify-center">
				<div className="flex space-x-1 text-lg">
					<h1>Paquete:</h1>
					<h2 className="font-bold">{paquete.nombre}</h2>
					<p className="pl-3 text-sm font-bold">{paquete.precio} Bs.</p>
				</div>
				<p>{paquete.descripcion}</p>
			</div>
			<div className="w-24 mr-2 text-sm">
				<h4 className="my-1 bg-green-300 rounded">Regular: {paquete.mbRegular}</h4>
				<h4 className="my-1 bg-blue-200 rounded">Bono: {paquete.mbBono}</h4>
				<h4 className="my-1 bg-orange-200 rounded">Recargo: {paquete.mbRecargo}</h4>
			</div>
			{mostrarMas && admin && (
				<div className="absolute right-5">
					<CogIcon className="w-5 h-5" onClick={() => setEditarPaquete(true)} />
				</div>
			)}
		</div>
	);
	return editarPaquete ? editarPaqueteComponent : paqueteComponent;
}

export default PaqueteWidget;
