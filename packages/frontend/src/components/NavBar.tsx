import { ArrowPathIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import Button from './Button';
import 'react-datepicker/dist/react-datepicker.css';
import ExportButton from './ExportButton';

interface Props {
	title: string;
	searchEndpoint?: string;
	subPostEndpoint?: string;
	handleRefresh: () => void;
	data: any;
	setData: any;
	filterKey: string[] | string;
	filterKeyId?: string;
	children?: any;
}

export default function NavBar({ children, title, searchEndpoint, handleRefresh, filterKey, data, setData, filterKeyId }: Props) {
	return (
		<div className="sticky top-0 z-50 flex w-[95%] items-center">
			<h2 className="w-1/3 pl-2 text-lg font-bold text-center bg-gray-200 rounded-full sm:text-xl">{title}</h2>
			<div className="flex flex-col w-full">
				<SearchBar postName={title} searchEndpoint={searchEndpoint} filterKey={filterKey} data={data} setData={setData} filterKeyId={filterKeyId || 'id'} searchCustom={handleRefresh}>
					{children}
				</SearchBar>
			</div>
			<div className="flex items-center justify-center w-1/6 px-1 mx-1">
				<Button Icon={ArrowPathIcon} onClick={handleRefresh} disabled={!handleRefresh} />
				<ExportButton title={title.replace(' ', '').replace('/','')} endpoint={searchEndpoint}/>
			</div>
		</div>
	);
}
