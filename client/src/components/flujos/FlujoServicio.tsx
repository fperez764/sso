import { Servicio } from '../../../types/typesSSO';

interface Props {
    servicio: Servicio;
    className?: string;
}

export default function FlujoServicio({ servicio, className }: Props) {
    return (
    <div className={`flex-col w-12 mr-3 cursor-pointer justify-items-center lg:ml-3 ${className}`}>
        <h3 className="font-bold text-[13px] text-center self-center sm:text-[14px] hover:underline whitespace-nowrap">
            {servicio?.nombre || 'Servicio'}
        </h3>
        <img
            className='w-12 rounded'
            src={`/images/servicio-categoria/${servicio?.categoria?.nombre}.png`}
            alt=''
        />
    </div>
);}
