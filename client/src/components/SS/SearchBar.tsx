import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Props {
    data: any;
    setData: any;
    filterKey: string;
}

function SearchBar({data, setData, filterKey}: Props) {
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
        setData([value])
        setFilteredData([]);
    }

    const handleEnter = (e : any) =>{
        if(e.key === 'Enter'){
            setData(filteredData);
            setFilteredData([]);
        }
        if(e.key === 'Esc') handleClear();
    }
    return (
        <div className="w-[90%] sticky top-0 py-1.5 z-50">
            <div className="relative flex items-center p-3 rounded">
                {filteredData.length === 0 && inputText === ''
                    ? <MagnifyingGlassIcon className="z-50 h-5 pl-3 text-gray-500 cursor-pointer"/>
                    : <XMarkIcon className="z-50 h-5 pl-3 text-gray-500 cursor-pointer" onClick={handleClear}/>
                }
                <input
                    className="absolute w-[90%] rounded pl-11 border=gray-500 text-gray-700 focus:shadow-lg focus:bg-white"
                    type="text"
                    placeholder={`Buscar`}
                    onChange={handleFilter}
                    onKeyUp={handleEnter}
                    value={inputText}
                />
            </div>
            {filteredData.length > 0 
            ? <div className="absolute z-10 mt-1 ml-3 overflow-hidden overflow-y-auto bg-white border-gray-400 rounded w-[90%] max-h-52 border-y border-x">
                {filteredData.slice(0, 10).map((value: any) => (
                    <p className='h-6 px-4 my-1 overflow-hidden text-sm cursor-pointer hoverEffect' onClick={()=>handleSelect(value)} key={value.id | value.title}>
                        {Object.keys(value).includes('id') ? `${value.id}: ` : ''}{value[filterKey]}
                    </p>
                ))}
            </div> : null}
        </div>
    );
}

export default SearchBar;
