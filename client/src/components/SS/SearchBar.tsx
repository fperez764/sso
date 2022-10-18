import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

function SearchBar() {
    return (
        <div className="w-[90%] xl:w-[75%] sticky top-0 py-1.5 z-50">
            <div className="flex items-center p-3 rounded-full relative">
                <MagnifyingGlassIcon className="h-5 z-50 pl-3 text-gray-500 cursor-pointer" />
                <input
                    className="absolute rounded-full pl-11 border=gray-500 text-gray-700 focus:shadow-lg 
focus:bg-white"
                    type="text"
                    placeholder="Buscar"
                />
            </div>
        </div>
    );
}

export default SearchBar;
