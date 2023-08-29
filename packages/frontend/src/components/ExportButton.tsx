import { FolderArrowDownIcon } from '@heroicons/react/24/outline';
import Button from './Button';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { toast } from 'react-hot-toast';

interface Props {
	endpoint?: string;
	title: string | undefined;
}

export default function ExportButton({ endpoint, title }: Props) {
	const downloadExcel = async () => {
		const tExport = toast.loading('Descargando hoja de calculo');
		try {
			const res = await axios.get(`${endpoint}?page=0&count=1000`);
			console.log('Se encontraron ' + res.data.length + ' registros');
			
			const workSheet = XLSX.utils.json_to_sheet(res.data);
			//const allJsonData = res.data.map((post: any) => {return {id: post.id, jsonPost: JSON.stringify(post).slice(0, 32766)}});
			//const jsonSheet = XLSX.utils.json_to_sheet(allJsonData);
			const workBook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workBook, workSheet, title || 'Reporte');
			//XLSX.utils.book_append_sheet(workBook, jsonSheet, 'ReporteJSON');
			XLSX.writeFile(workBook, (title ?? '') + 'reporte.xlsx');
			toast.success('CSV descargado!', { id: tExport });
		} catch (error) {
			toast.error('Algo salio mal al descargar elementos', { id: tExport });
			console.error('downloadExcel: ' + error);
		}
	};

	return (
		<div>
			<Button Icon={FolderArrowDownIcon} onClick={downloadExcel} />
		</div>
	);
}
