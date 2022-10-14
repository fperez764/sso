import Input from './Input';
import SSCard from './SSCard';
import NavBar from '../NavBar';

interface Props {
    children: any;
}
/**
 * Muestra objetos(post) en una tablas + las q creaste tu o que te corresponden?(caso de solicitudes) individualmente 
 * @returns
 */
export default function Feeder({ children }: Props) {
    return (
        <div className="xl:ml-[92px] border-l border-r border-gray-200  xl:min-w-[1026px] lg:min-w-[1026px] sm:ml-[73px] flex-grow max-w-xl">
            {children}            
        </div>
    );
}