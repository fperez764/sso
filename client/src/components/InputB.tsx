/** @format */

interface Props {
	placeholder: string;
	type?: string;
	value?: string | number;
	handleChange?: any;
	error?: string | undefined;
	disabled?: boolean;
	className?: string;
}
export default function InputB({ placeholder, type, value, handleChange, error, disabled, className }: Props) {
	return (
		<div className={`flex-col ${className}`}>
			<div className="flex mt-2">
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
			{!!error && <small className="mb-2 text-red-600 font medium">{error}</small>}
		</div>
	);
}
