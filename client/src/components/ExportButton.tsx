/** @format */

import { FolderArrowDownIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import * as XLSX from 'xlsx';

interface Props {
	data: any;
	title: string | undefined;
}
// TODO: Funcion para mostrar nested JSON
//  const formattedData = data.map(row =>{
//   return row.map(record => {
//     return typeof record === 'object' ? JSON.stringify(record)
//     : record;
//   } );
// });
export default function ExportButton({ data, title }: Props) {
	const downloadExcel = () => {
		const workSheet = XLSX.utils.json_to_sheet(data);
		const workBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, title || 'Reporte');
		XLSX.writeFile(workBook, (title ?? '') + 'reporte.xlsx');
	};

	return (
		<div>
			<Button Icon={FolderArrowDownIcon} onClick={downloadExcel} />
		</div>
	);
}
