import { ArrowPathIcon } from '@heroicons/react/24/outline';
import SearchBar from './SS/SearchBar';
import ExportButton from '../components/ExportButton';
import Button from './Button';

interface Props {
    titulo: string;
    handleRefresh: () => void;
    exportData?: any;
}
function NavBar({ titulo, handleRefresh, exportData }:Props) {
  return (
    <div className="sticky top-0 z-50 flex px-3 py-2 bg-white border-b border-gray-200">
    <h2 className="text-lg font-bold cursor-pointer sm:text-xl">
        {titulo}
    </h2>
    <SearchBar />
    <div className="flex items-center justify-center px-2 ml-auto h-9">
        <Button Icon={ArrowPathIcon} onClick={handleRefresh} active={true}/>
        <ExportButton title={titulo.replace(' ','')} data={exportData}/>
    </div>
</div>  );
}

export default NavBar;
