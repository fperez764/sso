import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
	setData: any;
	searchEndpoint: string;
	searchKey: string;
	postName: string;
	viewProperty?: string;
}

export default function SimpleSearchBar({ setData, postName, searchEndpoint, searchKey, viewProperty = 'nombre' }: Props) {
	const [filteredData, setFilteredData] = useState([]);
	const [inputText, setInputText] = useState('');
	const [newText, setNewText] = useState('');

	const handleFilter = (event: any) => {
		const searchWord = event.target.value;
		setInputText(searchWord);
		const newFilter = filteredData.filter((value: any) => {
			return JSON.stringify(value).toLowerCase().includes(searchWord.toLowerCase());
		});
		if (searchWord === '') setFilteredData([]);
		setFilteredData(newFilter);
	};
	const handleClear = () => {
		setFilteredData([]);
		setInputText('');
	};

	const handleSelect = (value: any) => {
		setData(value);
		setFilteredData([]);
		setInputText('');
	};

	const handleKeyEvent = (e: any) => {
		if (e.key === 'Enter') {
			setFilteredData([]);
			if(inputText != newText){
			handleSearch();}
		}
		if (e.key === 'Escape') handleClear();
	};

	const handleSearch = async () => {
		if (filteredData.length > 0) return;
		if (!searchEndpoint) return;
		
		const tSearch = toast.loading('Obtener ' + postName, { duration: 1000 });
		let resSearch = [];
		try {
			const res = await axios.get(`${searchEndpoint}=${inputText}`);
			resSearch = res.data;
			toast.success(`Se encontraron ${res.data.length} registros.`, { id: tSearch, duration: 1000 });
			if(res.data.length === 1) handleSelect(res.data[0]);
			else setFilteredData(res.data);
		} catch (e) {
			const eMessage = `Error al cargar ' ${postName} \nError:${e}`;
			console.error(eMessage);
			toast.error(eMessage, { id: tSearch });
			return { error: eMessage };
		}
		setNewText(inputText);
	};

	return (
		<div className="sticky top-0 py-1.5 z-50 w-full flex items-center" onKeyUp={handleKeyEvent}>
			<div className="space-y-2 w-[90%]">
				{/**Filters */}
				{filteredData.length > 0 || inputText !== '' ? <XMarkIcon className="absolute z-50 h-6 pl-1 my-3 text-gray-500 cursor-pointer" onClick={handleClear} /> : null}
				<input
					className={`w-full pl-2 h-8 rounded border=gray-500 text-gray-700 focus:shadow-lg focus:bg-white ${filteredData.length > 0 || inputText !== '' ? 'pl-8' : ''}`}
					type="text"
					placeholder={`Buscar por ${searchEndpoint.split('?')[1]} ${viewProperty === 'nombre' ? '' : 'y ' + viewProperty}`}
					onChange={handleFilter}
					onKeyUp={handleKeyEvent}
					value={inputText}
				/>
				{filteredData.length > 0 ? (
					<div className="absolute z-10 overflow-hidden overflow-y-auto bg-white border-gray-400 rounded w-[90%] max-h-52 border-y border-x">
						{filteredData.slice(0, 30).map((value: any) => (
							<p className="h-6 px-4 my-1 overflow-hidden text-sm cursor-pointer hoverEffect" onClick={() => handleSelect(value)} key={value.id}>
								{`${value.id}: ${value[searchKey]}${value.nombre ? ('- ' + value.nombre) : value.mac ? ('- ' + value.mac) : ''}`}
							</p>
						))}
					</div>
				) : null}
			</div>
			<MagnifyingGlassIcon className="z-50 self-center h-12 px-2 py-2 pl-1 text-gray-500 rounded-full cursor-pointer hover:text-blue-300" onClick={handleSearch} />
		</div>
	);
}
