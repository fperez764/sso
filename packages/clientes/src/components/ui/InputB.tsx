interface Props {
	placeholder: string;
	type?: string;
	value?: string | number;
	handleChange?: any;
	errors?: string[] | undefined;
	disabled?: boolean;
	className?: string;
}
export default function InputB({ placeholder, type, value, handleChange, errors, disabled, className }: Props) {
	const error = (errors && Array.isArray(errors) && errors.length > 0)
		? errors.find(e => e.replace(/[aeiou]/gi, '').toLowerCase().includes(placeholder.replace(' ','').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[aeiou]/gi, '').replace('.','').toLowerCase()))
		: undefined;

	return (
		<div className={`flex-col ${className}`}>
			{!!error && <small className="text-red-600 font medium">{error}</small>}
			<div className="flex mb-2">
				<label className="relative w-full cursor-pointer">
					<input
						type={type?? 'string'}
						placeholder={placeholder}
						value={value}
						onChange={(e) => handleChange(e.target.value)}
						className={`px-3 py-3 w-full placeholder-transparent border-opacity-50 transition duration-200 border-2 rounded outline-none focus:border-blue-400 bg-gray-50 focus:bg-white hover:bg-white ${
							error ? 'border-red-600' : 'border-gray-400'
						})`}
						disabled={disabled !== undefined}
						autoComplete="off"
					/>
					<span className="absolute px-1 py-3 text-gray-400 transition duration-200 rounded left-3 input-text">{placeholder}</span>
				</label>
			</div>
		</div>
	);
}
