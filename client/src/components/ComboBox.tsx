/** @format */

import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
	options?: any[];
	postName: string;
	value?: string;
	setData: any;
	searchEndpoint?: string;
	filterKey?: string;
	className?: string;
}

/**
 *
 * Solo devuelve strings en base a las @param options o en base a los resultados de busqueda por @param filterKey
 * Si la respuesta del @param searchEndpoint devuelve una lista debe estar estructurada como {list: [item1, item2, ...]}
 * @returns
 * @example <ComboBox setData={setState} postName='Placeholder' searchEndpoint='/endpointArrList'/> => List example
 * @example <ComboBox setData={setState} filterKey='[property in object list]' postName = 'Placeholder' searchEndpoint='/endpointArrObjects'/> => Array of objects
 */
export default function ComboBox({ value, options, setData, postName, searchEndpoint, filterKey, className }: Props) {
	const [opciones, setOpciones] = useState(options || []);

	const handleSearch = async () => {
		if (opciones.length > 0) return;
		if (!searchEndpoint) {
			toast.error(`No se definieron parametros de busqueda al API SSO: endpoint:${searchEndpoint}/`);
			return;
		}
		let resSearch = [];
		try {
			const res = await axios.get(searchEndpoint);
			resSearch = res.data;
			console.log('ComboBox: ' + searchEndpoint);
			setOpciones('list' in resSearch ? resSearch.list : resSearch);
			if (!!filterKey) setData(resSearch[0][filterKey]);
			else setData(resSearch.list[0]);
		} catch (e) {
			const eMessage = `Error al cargar ${searchEndpoint}'\nError:${e}`;
			console.error(eMessage);
			toast.error(eMessage);
			return { error: eMessage };
		}
	};

	useEffect(() => {
		options ? setData(options[0]) : handleSearch();
	}, []);

	const css =
		'w-full px-3 py-3 placeholder-transparent border-opacity-50 transition duration-200 border-2 rounded outline-none focus:border-blue-400 bg-gray-50 focus:bg-white hover:bg-white border-gray-400';
	return (
		<div className={`mt-2 ${className}`}>
			<label className="relative cursor-pointer">
				<select className={css} value={value} onChange={(e) => setData(e.target.value)}>
					{!!opciones &&
						opciones.map((option: string) => {
							const id = typeof option === 'string' ? option : option[filterKey ?? 'id'];
							return (
								<option key={id} value={id}>
									{typeof option === 'string' ? option : option[filterKey ?? 'id']}
								</option>
							);
						})}
				</select>
				<span className="absolute px-1 py-0 text-blue-300 transition duration-200 transform scale-75 -translate-x-2 -translate-y-2 bg-gray-100 rounded left-3 input-text ">{postName}</span>
			</label>
		</div>
	);
}
