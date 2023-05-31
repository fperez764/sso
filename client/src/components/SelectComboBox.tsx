/** @format */

import Select from 'react-select';

interface Props {
	optionsObject: any;
	optionsValue: string[];
	setData: any;
}

interface Option {
	value: any;
	label: string;
}

export default function SelectComboBox({ optionsObject, optionsValue, setData }: Props) {
	if (optionsObject.length !== optionsValue.length) return <p>SelectCBX:Opciones invalidas.</p>;

	const optionsSet = new Set();
	for (let i = 0; i < optionsObject.length; i++) {
		optionsSet.add({ value: optionsObject[i], label: optionsValue[i] });
	}
	const options = Array.from(optionsSet);

	const handleChange = (selectedOption: Option[]) => {
		setData(selectedOption.map((o) => o.value));
	};

	return (
		<div className="container">
			<div className="m-auto w-50">
				<Select isMulti options={options} onChange={handleChange} autoFocus={true} />
			</div>
		</div>
	);
}
