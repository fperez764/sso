interface Props {
    placeholder: string,
    type: string,
    value: string,
    handleChange: any;
}
export default function InputA({ placeholder, type, value, handleChange }: Props) {
    return (
        <div className="flex items-center justify-center mt-2 mb-2">
        <label className='relative cursor-pointer'>
          <input type={type} placeholder={placeholder} value={value} onChange={handleChange}
          className='w-full px-3 py-3 placeholder-transparent transition duration-200 border-2 border-gray-400 border-opacity-50 rounded outline-none focus:border-blue-400 bg-gray-50 focus:bg-white hover:bg-white'/>
          <span className='absolute px-1 py-3 text-gray-400 transition duration-200 rounded left-3 input-text'>{placeholder}</span>
        </label>
      </div>

    );
}