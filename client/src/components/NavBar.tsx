import { ArrowPathIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';
import ExportButton from '../components/ExportButton';
import Button from './Button';

interface Props {
    title: string;
    searchEndpoint?: string;
    handleRefresh: () => void;
    data: any;
    setData: any;
    filterKey: string[] | string;
    filterKeyId?: string;
}

export default function NavBar({ title, searchEndpoint, handleRefresh, filterKey, data, setData, filterKeyId}:Props) {
    return (
    <div className="sticky top-0 z-50 flex px-3 py-2 bg-gray-100 border-b border-gray-200">
        <h2 className="mx-2 text-lg font-bold sm:text-xl">
            {title}
        </h2>
        <SearchBar 
            postName = {title} 
            searchEndpoint={searchEndpoint} 
            filterKey={filterKey} 
            data={data} 
            setData={setData} 
            filterKeyId={filterKeyId || 'id'}
        />
        <div className="flex items-center justify-center px-2 ml-auto mr-9">
            <Button Icon={ArrowPathIcon} onClick={handleRefresh} disabled={!handleRefresh}/>
            <ExportButton title={title.replace(' ','')} data={data}/>
        </div>
    </div>  
  );
}

