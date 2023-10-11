'use client';
import ClienteCard from '../../components/cliente/ClienteCard';
import { Cliente } from '../../../types/typesSSO';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import MainIndex from '../../components/MainIndex';
import NuevoClienteWidget from '../../components/cliente/NuevoClienteWidget';

interface PropsSS {
	post: Cliente;
	setSelectedSubPost: () => void;
	selectedPost: Cliente;
	errors: any;
}

const postName = 'Clientes';
const postEndpoint = '/clientes/contactos';
const filterKey = 'Nombre o razon social de cliente';
const filterKeyId = 'razonSocial';

export default function Clientes() {

	const feederChildren = ({ post }: PropsSS) => {
		return (
			<ClienteCard cliente={post} />
		);
	};

	const widgetChildren = ({ selectedPost }: PropsSS) => {
		return (
			<ClienteWidget cliente={selectedPost} />
		);
	};

	const newWidgetChildren = ({ selectedPost }: PropsSS) => {
		return (<NuevoClienteWidget cliente={selectedPost} />);
	};

	return (
		<MainIndex
		postName={postName}
		endpoint={postEndpoint}
		defaultFilterKey={filterKey}
		filterKeyId={filterKeyId}
		feederChildren={feederChildren}
		widgetChildren={widgetChildren}
		newWidgetChildren={newWidgetChildren}
	/>
	);
}
