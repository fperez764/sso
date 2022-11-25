import { Collections } from '@mui/icons-material';
import { useState } from 'react';

interface Props {
    placeholder: string,
    type: string,
    value?: string|number,
    handleChange?: any,
    error?: string | undefined,
    disabled?: boolean;
}
export default function InputA({ placeholder, type, value, handleChange, error, disabled }: Props) {
  const css = 'w-full px-3 py-3 placeholder-transparent border-opacity-50 transition duration-200 border-2  rounded outline-none focus:border-blue-400 bg-gray-50 focus:bg-white hover:bg-white' + (error ? 'border-red-600' : 'border-gray-400')
  return (
      <div className="flex flex-col">
        <div className="flex items-center justify-center mt-2">
        <label className='relative cursor-pointer'>
          <input 
            type={type} 
            placeholder={placeholder} 
            value={value} 
            onChange={handleChange}
            className={css}
            disabled={disabled !== undefined}
          />
          <span className='absolute px-1 py-3 text-gray-400 transition duration-200 rounded left-3 input-text'>{placeholder}</span>
        </label>
      </div>
      <small className="mb-2 text-red-600 font medium">{error}</small>
      </div>
    );
}