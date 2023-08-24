import { ClienteServicioTicket, cliente_servicio_ticket_severidad_enum } from "../../types/typesSSO";

export const DateToS = 'YYYY/MM/DDTHH:mm:ss';
export const DateMonth = 'MMM-DD HH:mm';
export const DateToM = "DD/MM/YYYY HH:mm"
export const OnlyDayMonth = "DD/MM/YY";

export const getColorSeveridad = (ticket: ClienteServicioTicket) => {
    return ticket.resuelto ? 'green-400' : 
    ticket.fechaBaja ? 'gray-400' : ticket.severidad ===
    cliente_servicio_ticket_severidad_enum.CRITICA ? 'red-500' : ticket.severidad ===
    cliente_servicio_ticket_severidad_enum.ALTA ? 'red-300' : ticket.severidad ===
    cliente_servicio_ticket_severidad_enum.MEDIA ? 'orange-300' :
    'yellow-300';
}
export const DateFormat = 'DD/MM/YY';