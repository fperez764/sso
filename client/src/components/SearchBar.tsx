import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
    data: any;
    setData: any;
    filterKey: string[] | string;
    filterKeyId?: string;
    searchEndpoint?: string;
    postName: string
}

function SearchBar({data, setData, filterKey, filterKeyId, postName, searchEndpoint}: Props) {
    const [filteredData, setFilteredData] = useState([]);
    const [inputText, setInputText]= useState('');
    const handleFilter = (event: any) => {
        const searchWord = event.target.value;
        setInputText(searchWord);
        const newFilter = data.filter((value:any) => {
            return JSON.stringify(value).toLowerCase().includes(searchWord.toLowerCase());
        });
        if(searchWord==="") setFilteredData([]);
        setFilteredData(newFilter);
    };
    const handleClear = () => {
        setFilteredData([]);
        setInputText("");
        setData(data);
    }

    const handleSelect = (value: any) => {
        setData([value]);
        setFilteredData([]);
        setInputText(`${filterKeyId ? value[filterKeyId] : value.id}: ${typeof(filterKey) === 'string' 
        ? value[filterKey] 
        : filterKey.length > 1 
        ? value[filterKey[0]][filterKey[1]] 
        : value[filterKey[0]]}`);
    }

    const handleKeyEvent = (e : any) =>{
        if(e.key === 'Enter'){
            setData(filteredData);
            setFilteredData([]);
            handleSearch();
        }
        if(e.key === 'Escape') handleClear();
    }

    const handleSearch = async () => {
        if(filteredData.length > 0) return;  
        if(!searchEndpoint) return;
        if(!postName || !filterKey) {
            toast.error(`No se definieron parametros de busqueda al API SSO: endpoint?/searchKey/text:${searchEndpoint}?/${filterKey}/${inputText}`);
            return;
        }
        const tSearch = toast.loading('Obtener ' + postName, {duration: 10000});
        let resSearch = [];
        try {
            const res = await axios.get(`${searchEndpoint}?/${filterKey}/${inputText}`);
            resSearch = res.data;
            toast.success(`Se encontraron ${res.data.length} registros.`, { id: tSearch });
        } catch (e) {
            const eMessage = `Error al cargar ' ${postName} \nError:${e}`;
            console.log(eMessage);
            toast.error(eMessage, { id: tSearch });
            return { error: eMessage };	
        }
        setData(resSearch);
    };

    return (
        <div className="sticky top-0 py-1.5 z-50 w-3/4" onKeyUp={handleKeyEvent}>
            <div className="relative flex items-center p-3 rounded">
                <MagnifyingGlassIcon className="z-50 h-5 pl-3 text-gray-500 cursor-pointer" onClick={handleSearch}/>
                {filteredData.length > 0 || inputText !== '' 
                    ? <XMarkIcon className="z-50 h-6 pl-1 text-gray-500 cursor-pointer" onClick={handleClear}/>
                    : null
                }
                <input
                    className="absolute w-[90%] rounded pl-16 border=gray-500 text-gray-700 focus:shadow-lg focus:bg-white"
                    type="text"
                    placeholder={`Buscar ${postName.toLowerCase()} por ${filterKey}`}
                    onChange={handleFilter}
                    onKeyUp={handleKeyEvent}
                    value={inputText}
                />
            </div>
            {filteredData.length > 0 
            ? <div className="absolute z-10 mt-1 ml-3 overflow-hidden overflow-y-auto bg-white border-gray-400 rounded w-[90%] max-h-52 border-y border-x">
                {filteredData.slice(0, 10).map((value: any) => (
                    <p className='h-6 px-4 my-1 overflow-hidden text-sm cursor-pointer hoverEffect' onClick={()=>handleSelect(value)} key={value.id | value.title}>
                        {`${filterKeyId && value[filterKeyId] ? (value[filterKeyId] + ': ') : ''}`} 
                        {//Opciones de filtrado para searchbar
                        typeof(filterKey) === 'string' 
                        ? value[filterKey] 
                        : filterKey.length > 1 
                        ? value[filterKey[0]][filterKey[1]] 
                        : value[filterKey[0]]
                        }
                    </p>
                ))}
            </div> : null}
        </div>
    );
}

export default SearchBar;
