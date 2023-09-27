import InputB from '../ui/InputB';
import ComboBox from '../ui/ComboBox';
import { useEffect, useState } from 'react';
import { ArchiveBoxArrowDownIcon,  TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { useAuthState } from '../../context/auth';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { ClienteServicioTicketAccion, ClienteSolicitudAccion, FlujoTicketAcciones, accion_estado_enum, users_area_enum, users_dep_enum } from '@types/typesSSO';
import Button from '../ui/Button';

export type NuevaAccion = 	{
	area: users_area_enum,
	accion: string,
	vigenciaDias: number
}

interface Props {
	accion?: FlujoTicketAcciones | ClienteServicioTicketAccion | ClienteSolicitudAccion | null;
	handleSave: (partialNewAction: NuevaAccion)=>void;
	handleDelete?: (accion: any)=>void;
	handleCancel?: ()=>void;
	edit: boolean;
}

function NuevaAccionFlujo({ accion: flujoAccion, handleSave, handleDelete, handleCancel, edit: editMode }: Props) {
	const { user } = useAuthState();
	const [area, setArea] = useState(flujoAccion?.area || users_area_enum.ATENCION_CLIENTE);
	const [accion, setAccion] = useState(flujoAccion?.accion || '');
	const [vigenciaDias, setVigencia] = useState<number>(flujoAccion?.vigenciaDias || 1);
	const [edit, setEdit] = useState(true);
	useEffect(() => {
		setArea(flujoAccion?.area || users_area_enum.ATENCION_CLIENTE);
		setAccion(flujoAccion?.accion || '');
		setVigencia(flujoAccion?.vigenciaDias || 1);
		setEdit(editMode);
	}, [flujoAccion, editMode]);

	const guardarAccion = () => {
		if (!accion || accion.length === 0) {
			toast.error('No puedes confirmar una respuesta sin acción');
			return;
		}
		if (!area || area.length === 0) {
			toast.error('Seleccione un area de atención para la respuesta');
			return;
		}
		const nResp = { ...flujoAccion } as ClienteServicioTicketAccion;
		nResp.accion = accion;
		nResp.area = area;
		nResp.vigenciaDias = vigenciaDias;
		setEdit(false);
		handleSave(nResp);
	};

	return (
		<div className={`nuevaAccionFlujo flex flex-col items-center self-center w-[80%] px-6 py-3 ${flujoAccion?.fechaBaja ? 'bg-red-400':'bg-gray-100'} rounded-xl`}>
			<h1 className="flex font-bold text-center bg-orange-500">{flujoAccion?.id ? flujoAccion.fechaBaja ? 'ACCIÓN ANULADA' : 'EDITAR ACCIÓN' : 'INSERTAR ACCIÓN'}</h1>
			<div className="flex mx-3">
				<Image className="w-16 h-16 bg-blue-300 rounded-full" src={`/images/areas/${area || 'ADD'}.png`} width={64} height={64} alt={area || 'usuario-area'} />
			</div>
			{ edit ? (
				<div className="flex-col w-full mt-3 text-center">
					<ComboBox setData={setArea} value={area} postName="Areas" searchEndpoint="/users/areas" />
					<InputB placeholder="Acción" type="string" value={accion} handleChange={setAccion} />
					{user?.departamento === users_dep_enum.COMERCIAL && <InputB placeholder="Días de vigencia" type="number" value={vigenciaDias} handleChange={setVigencia} />}
				</div>
			) : (
				<div className="flex-col w-full mt-3 text-center rounded-lg">
					<p className="mb-2 text-lg font-bold">{area}</p>
					<p className="pl-3 mx-3 bg-gray-300 rounded-md text-start text-md">{accion}</p>
					<p>{`Vigencia: ${vigenciaDias} día${vigenciaDias > 1 ? 's' : ''}`}</p>
				</div>
			)}
			{edit && (
				<div className="flex space-x-3">
					<Button Icon={ArchiveBoxArrowDownIcon} title='Guardar' titleConfirm={flujoAccion?.id ? 'Se actualizaran los valores de la acción' : 'Se insertara la nueva acción al flujo'} className="bg-green-400" onClick={guardarAccion} />
					{!!handleDelete && flujoAccion && flujoAccion.orden > 0 && (
						<Button Icon={TrashIcon} className="bg-red-400" titleConfirm='Estas seguro que deseas eliminar esta acción?' onClick={() => handleDelete(flujoAccion)} />
					)}
					{!!handleCancel && (
						<Button Icon={XCircleIcon} title='Cancelar' titleConfirm='Se perderan los datos insertados' className="bg-red-400" onClick={handleCancel} />
					)}
				</div>
			)}
		</div>
	);
}

export default NuevaAccionFlujo;
