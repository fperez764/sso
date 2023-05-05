/** @format */

import axios from 'axios';
import { useState, SetStateAction, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Servicio, Categoria } from '../../../types/typesSSO';
import ComboBox from '../ComboBox';
import Input from '../Input';
import InputB from '../InputB';

interface Props {
	servicio?: Servicio;
	handleRefresh: () => void;
}

export default function NuevoServicioWidget({ servicio, handleRefresh }: Props) {
	const postName = 'Servicio';
	const endpoint = '/servicios';

	const [categorias, setCategorias] = useState<Categoria[] | null>([]);
	const [categoria, setCategoria] = useState<Categoria | null>(null);
	const [nombre, setNombre] = useState(servicio?.nombre);
	const [descripcion, setDescripcion] = useState(servicio?.descripcion);
	const [errors, setErrors] = useState<any>(null);
	const [activo, setActivo] = useState(true);
	//TODO: Replace for usereducer dev.to/builderio/a-cure-for-react-usestate-hell-1ldi
	type kEvent = { target: { value: SetStateAction<string> } };

	const getCategorias = async () => {
		try {
			const res = await axios.get('/categorias');
			setCategorias(res.data);
		} catch (error: any) {
			toast.error('Algo salio mal al buscar las categorias disponibles: ' + error.message);
		}
	};

	useEffect(() => {
		getCategorias();
		if (categorias) setCategoria(categorias[0]);
	}, []);

	const handleClean = () => {
		setNombre('');
		setDescripcion('');
	};

	const selectCategoria = (nombreCat: string) => {
		if (!categorias) return;
		const categoriaSeleccionada = categorias.filter((c: Categoria) => c.nombre === nombreCat);
		setCategoria(categoriaSeleccionada[0]);
	};

	const getBody = () => {
		if (!categoria) {
			toast.error('Categoria no definida');
			return {};
		}
		return {
			nombreCategoria: categoria.nombre,
			descripcion,
			nombre,
			activo,
		};
	};

	return (
		<Input handleClean={handleClean} handleRefresh={handleRefresh} postName={postName} getBody={getBody} endpoint={endpoint} setErrors={setErrors} editar={!!servicio}>
			{!!categorias && <ComboBox value={categoria ? categoria.nombre : ''} options={categorias.map((c: Categoria) => c.nombre)} setData={selectCategoria} postName="Nombre Categoría" />}
			<InputB placeholder="Nombre" type="string" value={nombre} handleChange={setNombre} error={errors?.nombre} />
			<InputB placeholder="Descripción" type="string" value={descripcion} handleChange={setDescripcion} error={errors?.descripcion} />
			{servicio ? null : (
				<label>
					{activo ? 'Activo' : 'Inactivo'}
					<input className="mx-3 ml-2" type="checkbox" defaultChecked={activo} onChange={() => setActivo(!activo)} />
				</label>
			)}
		</Input>
	);
}
