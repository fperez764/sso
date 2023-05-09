import ClienteCard from '../../components/cliente/ClienteCard';
import { Cliente } from '../../../types/typesSSO';
import ClienteWidget from '../../components/cliente/ClienteWidget';
import MainIndex from '../../components/MainIndex';
import NuevoClienteWidget from '../../components/cliente/NuevoClienteWidget';
import Button from '../../components/Button';
import router from 'next/router';
import { ClipboardIcon } from '@heroicons/react/24/outline';

interface PropsSS {
	post: Cliente;
	setSelectedSubPost: () => void;
	selectedPost: Cliente;
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
			<ClienteWidget post={selectedPost} />
		);
	};

	const newWidgetChildren = ({ selectedPost }: PropsSS) => {
		return (<NuevoClienteWidget cliente={selectedPost} />);
	};

	const extraButtons = (
		<Button Icon={ClipboardIcon} title="RSS" onClick={() => router.push('/clientes/RSS')} />
	);


	return (
		<MainIndex
		postName={postName}
		endpoint={postEndpoint}
		defaultFilterKey={filterKey}
		feederChildren={feederChildren}
		widgetChildren={widgetChildren}
		newWidgetChildren={newWidgetChildren}
		extraButtons={extraButtons}
	/>
	);
}
