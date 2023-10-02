import { ClienteServicioTicket, cliente_servicio_ticket_severidad_enum } from '../../types/typesSSO';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

export const DateToS = 'YYYY/MM/DDTHH:mm:ss';
export const DateMonth = 'MMM-DD HH:mm';
export const DayMonth = 'MMM-DD';
export const DateToM = 'DD/MM/YYYY HH:mm';
export const OnlyDayMonth = 'DD/MM/YY';

export const getColorSeveridad = (ticket: ClienteServicioTicket) => {
    return ticket.resuelto ? 'green-400' : 
    ticket.fechaBaja ? 'gray-400' : ticket.severidad ===
    cliente_servicio_ticket_severidad_enum.CRITICA ? 'red-500' : ticket.severidad ===
    cliente_servicio_ticket_severidad_enum.ALTA ? 'red-300' : ticket.severidad ===
    cliente_servicio_ticket_severidad_enum.MEDIA ? 'orange-300' :
    'yellow-300';
}
export const DateFormat = 'DD/MM/YY';

export const downloadPDF = async (querySelector: string, title: string) => {
    const tDown = toast.loading('Descargando PDF...');
    const capture = document.querySelector('.pdf-content');
    if(!capture) return toast.error('capture no encontrado', {id: tDown});
    try {
        const canvas = await html2canvas(capture);
        const imgData = canvas.toDataURL('image/png', 1.0);
        const doc = new jsPDF('p', 'mm', 'a4');
        const componentWidth = doc.internal.pageSize.getWidth();
        const componentHeight = doc.internal.pageSize.getHeight();
        doc.addImage(imgData, 'PNG', 0, 0, componentWidth, componentHeight);
        doc.save(title+ '.pdf');
        toast.success('PDF descargado.', {id: tDown});        
    } catch (error) {
        toast.error('No se pudo descargar el PDF ' + error, {id: tDown});
        console.error(error);
    }

};

