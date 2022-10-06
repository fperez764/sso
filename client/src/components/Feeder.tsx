import Input from './Input';
import SSCard from './SSCard';
import Table from './Table';
import NavBar from './NavBar';

interface Props {
    titulo: string,
    accionNuevo: string,
    placeHolderNuevo: string,
    posts: Object[],
    handleRefresh: any,
    handleNew: any
}
/**
 * Muestra objetos(post) en una tablas + las q creaste tu o que te corresponden?(caso de solicitudes) individualmente 
 * @returns
 */
export default function Feeder({ titulo, accionNuevo, placeHolderNuevo, posts, handleRefresh, handleNew }: Props) {
    return (
        <div className="xl:ml-[260px] border-l border-r border-gray-200  xl:min-w-[1026px] lg:min-w-[826px] sm:ml-[73px] flex-grow max-w-xl">
            <NavBar titulo={titulo} handleRefresh={handleRefresh}/>
            <Input accion={accionNuevo} placeholder={placeHolderNuevo} handleNew={handleNew}/>
            {posts?.map((post: any) => (
                <SSCard key={post.id} post={post} />
            ))}
            <div className="xl:ml-[5px] border-l border-r border-gray-200  xl:min-w-[926px] sm:ml-[73px] flex-grow max-w-xl">
            <Table />            
            </div>                
        </div>
    );
}