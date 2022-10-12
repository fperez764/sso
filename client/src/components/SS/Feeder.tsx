import Input from './Input';
import SSCard from './SSCard';
import NavBar from '../NavBar';

interface Props {
    titulo: string;
    accionNuevo: string;
    placeHolderNuevo: string;
    handleRefresh: any;
    handleNew: any;
    children: any;
}
/**
 * Muestra objetos(post) en una tablas + las q creaste tu o que te corresponden?(caso de solicitudes) individualmente 
 * @returns
 */
export default function Feeder({ titulo, accionNuevo, placeHolderNuevo, handleRefresh, handleNew, children }: Props) {
    return (
        <div className="xl:ml-[260px] border-l border-r border-gray-200  xl:min-w-[1026px] lg:min-w-[826px] sm:ml-[73px] flex-grow max-w-xl">
            <NavBar titulo={titulo} handleRefresh={handleRefresh}/>
            <Input accion={accionNuevo} placeholder={placeHolderNuevo} handleNew={handleNew}/>
            {children}            
        </div>
    );
}