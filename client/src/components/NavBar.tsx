import { ArrowPathIcon } from '@heroicons/react/24/outline';
import SearchBar from './SS/SearchBar';
import ExportButton from '../components/ExportButton';
import Button from './Button';
import { useState } from 'react';

interface Props {
    title: string;
    handleRefresh: () => any;
    exportData?: any;
}
function NavBar({ title, handleRefresh, exportData }:Props) {
    const [data, setData] = useState(exportData);

  return (
    <div className="sticky top-0 z-50 flex px-3 py-2 bg-white border-b border-gray-200">
        <h2 className="text-lg font-bold sm:text-xl mx-2">
            {title}
        </h2>
        <SearchBar />
        <div className="flex items-center justify-center px-2 ml-auto mr-9">
            <Button Icon={ArrowPathIcon} onClick={() => setData(handleRefresh)} active={true}/>
            {data && <ExportButton title={title.replace(' ','')} data={data}/>}
        </div>
    </div>  
  );
}

export default NavBar;
