import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface Props {
    options?: any;
    postName: string;
    value?: string,
    setData: any;
    searchEndpoint?: string;
    filterKey?: string;
}


export default  function ComboBox({value, options, setData, postName, searchEndpoint, filterKey}: Props) {
    const [opciones, setOpciones] = useState(options || []);

    const handleSearch = async () => {
        console.log("Buscar! " + searchEndpoint);
        if(opciones.length > 0) return;  
        if(!searchEndpoint){
            toast.error(`No se definieron parametros de busqueda al API SSO: endpoint:${searchEndpoint}/`);
            return;
        }
        //const tSearch = toast.loading('Cargando ', {duration: 10000});
        let resSearch = [];
        try {
            const res = await axios.get(searchEndpoint);
            resSearch = res.data;
            //toast.success(`Se encontraron ${res.data.length} registros.`, { id: tSearch });
        } catch (e) {
            const eMessage = `Error al cargar ${searchEndpoint}'\nError:${e}`;
            console.error(eMessage);
            toast.error(eMessage);
            return { error: eMessage };	
        }
        setOpciones(resSearch);
        console.log(resSearch[0]);
        if(!!filterKey) setData(resSearch[0][filterKey]);
    };

    useEffect(() => {
        options ? setData(options[0]) : handleSearch();
	}, []);

    const css = 'w-full px-3 py-3 placeholder-transparent border-opacity-50 transition duration-200 border-2 rounded outline-none focus:border-blue-400 bg-gray-50 focus:bg-white hover:bg-white border-gray-400';
    return (
        <div className="mt-2">
        <label className='relative cursor-pointer'>
            <select className={css} value={value} onChange={(e) => setData(e.target.value)}>
            {opciones.map((option: string)=>
                <option value={typeof(option) === 'string' ? option : option[filterKey ?? 'id']}>
                    {typeof(option) === 'string' ? option : option[filterKey ?? 'id']}
                </option>
            )}
            </select>
            <span className='absolute px-1 py-0 text-blue-300 transition duration-200 transform scale-75 -translate-x-2 -translate-y-2 bg-gray-100 rounded left-3 input-text '>{postName}</span>
        </label>
        </div>
    );
}
