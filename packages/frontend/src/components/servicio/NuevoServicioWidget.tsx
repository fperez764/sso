import axios from 'axios';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Servicio, CategoriaServicio } from '../../../types/typesSSO';
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

	const [categorias, setCategorias] = useState<CategoriaServicio[] | null>([]);
	const [nombreCategoria, setNombreCategoria] = useState<CategoriaServicio | null>(null);
	const [nombre, setNombre] = useState(servicio?.nombre);
	const [descripcion, setDescripcion] = useState(servicio?.descripcion);
	const [errors, setErrors] = useState<any>(null);
	const [activo, setActivo] = useState(true);
	//TODO: Replace for usereducer dev.to/builderio/a-cure-for-react-usestate-hell-1ldi

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
		if (categorias) setNombreCategoria(categorias[0]);
	}, []);

	const handleClean = () => {
		setNombre('');
		setDescripcion('');
	};

	const selectCategoria = (nombreCat: string) => {
		if (!categorias) return;
		const categoriaSeleccionada = categorias.filter((c: CategoriaServicio) => c.nombre === nombreCat);
		setNombreCategoria(categoriaSeleccionada[0]);
	};

	const getBody = () => {
		if (!nombreCategoria) {
			toast.error('Categoria no definida');
			return {};
		}
		return {
			nombreCategoria: nombreCategoria,
			descripcion,
			nombre,
			activo,
		};
	};

	return (
		<Input handleClean={handleClean} handleRefresh={handleRefresh} postName={postName} getBody={getBody} endpoint={endpoint} setErrors={setErrors} editar={!!servicio}>
			<ComboBox setData={setNombreCategoria} filterKey="nombre" postName="Categoria" searchEndpoint={`/categorias/`} />
			<InputB placeholder="Nombre" type="string" value={nombre} handleChange={setNombre} errors={errors} />
			<InputB placeholder="Descripción" type="string" value={descripcion} handleChange={setDescripcion} errors={errors} />
			{servicio ? null : (
				<label>
					{activo ? 'Activo' : 'Inactivo'}
					<input className="mx-3 ml-2" type="checkbox" defaultChecked={activo} onChange={() => setActivo(!activo)} />
				</label>
			)}
		</Input>
	);
}
