import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

export enum AreasAceptacion {
    INSTALADOR = 'INS',
    COMERCIAL = 'COM',
    DOCUMENTOS_COMERCIAL = 'DCOM',
    DOCUMENTOS_INSTALADOR = 'DINS',
    MODEM_ALMACEN = 'ALM',
    MODEM_INSTALADOR = 'MINS',
    INSTALADO = 'INSDO',
    ACTIVADO = 'ACT',
    DOCUMENTOS_ENTREGADOS = 'DNTR',
}

type area = keyof typeof AreasAceptacion;

export default function SolicitudTimeline() {
  return (
    <div className="flex w-12 bg-green-600 p-0">
        <Timeline className='h-24 border-blue-900 rotate-90 p-0'>
        {(Object.keys(AreasAceptacion) as Array<area>).map(key => 
            <TimelineItem>
                <TimelineContent style={{ flex: 0.1 }} className='text-sm text-left'>
                    <p className="inline-block -rotate-90 text-center w-12">{AreasAceptacion[key]}</p>
                </TimelineContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
            </TimelineItem>
        )}
        </Timeline>
    </div>
  );
}