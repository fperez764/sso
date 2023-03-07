import ClienteCard from '../../components/cliente/ClienteCard';
import { Cliente } from '../../../types/typesSSO';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import MainIndex from '../../components/MainIndex';
import NuevoClienteWidget from '../../components/cliente/NuevoClienteWidget';

interface PropsSS {
	post: Cliente;
	setSelectedSubPost: () => void;
	selectedPost: Cliente;
	handleInputCancel: () => void;
	errors: any;
}

const postName = 'Clientes';
const postEndpoint = '/clientes';
const filterKey = 'nombreCompleto';

export default function Clientes() {

	const feederChildren = ({ post }: PropsSS) => {
		return (
			<ClienteCard cliente={post} />
		);
	};

	const widgetChildren = ({ selectedPost }: PropsSS) => {
		return (
			<ClienteWidget cliente={selectedPost}/>
		);
	};

	const newWidgetChildren = ({ handleInputCancel, selectedPost }: PropsSS) => {
		return (<NuevoClienteWidget handleCancel={handleInputCancel} cliente={selectedPost}/>)
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
