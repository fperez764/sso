import { FolderArrowDownIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Props {
	jsonContent: string[];
	title: string | undefined;
}

export default function ExportContent({ jsonContent, title }: Props) {
	const downloadExcel = async () => {
		const tExport = toast.loading('Descargando hoja de calculo');
		try {
			console.log('Se encontraron ' + jsonContent.length + ' registros');
			
			const workSheet = XLSX.utils.json_to_sheet(jsonContent);
			const workBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, title || 'Reporte');
			XLSX.writeFile(workBook, (title ?? '') + 'reporte.xlsx');
			toast.success('CSV descargado!', { id: tExport });
		} catch (error) {
			toast.error('Algo salio mal al descargar elementos', { id: tExport });
			console.error('downloadExcel: ' + error);
		}
	};

	return (
		<div>
			<Button title='Exportar' Icon={FolderArrowDownIcon} onClick={downloadExcel} />
		</div>
	);
}
