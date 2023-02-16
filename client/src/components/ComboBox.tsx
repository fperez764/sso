import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface Props {
    options: any;
    placeholder: string;
    value: string,
    setValue: any
}

export default function ComboBox({value, options, setValue, placeholder}: Props) {
    const css = 'w-full px-3 py-3 placeholder-transparent border-opacity-50 transition duration-200 border-2 rounded outline-none focus:border-blue-400 bg-gray-50 focus:bg-white hover:bg-white border-gray-400';
    return (
        <div className="w-1/3 mt-2">
        <label className='relative cursor-pointer'>
            <select className={css} value={value} onChange={(e: any) => setValue(e.target.value)}>
            {options.map((option: string)=>
                <option value={option}>{option}</option>
            )}
            </select>
            <span className='absolute px-1 py-0 text-blue-300 transition duration-200 transform scale-75 -translate-x-2 -translate-y-2 bg-gray-100 rounded left-3 input-text '>{placeholder}</span>
        </label>
        </div>
    );
}
