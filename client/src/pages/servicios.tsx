import { Servicio } from '../../types/typesSSO';
import MainIndex from '../components/MainIndex';
import CategoriaWidget from '../components/servicio/CategoriaWidget';
import NuevoServicioWidget from '../components/servicio/NuevoServicioWidget';
import ServicioCard from '../components/servicio/ServicioCard';
import ServicioWidget from '../components/servicio/ServicioWidget';

interface PropsSS {
	post: Servicio;
	setSelectedSubPost: () => void;
	selectedPost: Servicio;
	handleRefresh: () => void;
	errors: any;
}

const postName = 'Servicios';
const postEndpoint = '/servicios';
const filterKey = 'nombre';

export default function ServiciosPage() {

	const newWidgetChildren = ({ selectedPost, handleRefresh}: PropsSS) => {
		return (
			<NuevoServicioWidget servicio={selectedPost} handleRefresh={handleRefresh} />);
	};
	const feederChildren = ({ post }: PropsSS) => {
		return (<ServicioCard servicio={post} />
		);
	};

	const widgetChildren = ({ selectedPost }: PropsSS) => {
		return (
			<div>
				{selectedPost.categoria ? <CategoriaWidget categoria={selectedPost.categoria} /> : <p>Categoria no encontrada</p>}
				<ServicioWidget servicio={selectedPost} />
			</div>
		);
	};

return (
	<MainIndex
		postName={postName}
		endpoint={postEndpoint}
		defaultFilterKey={filterKey}
		feederChildren={feederChildren}
		widgetChildren={widgetChildren}
		newWidgetChildren={newWidgetChildren}
	/>
);
}
