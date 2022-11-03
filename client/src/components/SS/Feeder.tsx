interface Props {
    children: any;
}

/**
 * Muestra objetos(post) en una tablas + las q creaste tu o que te corresponden?(caso de solicitudes) individualmente 
 * @returns
 */
export default function Feeder({children}: Props) {
    return (
        <div className="xl:ml-[92px] sm:ml-[54px] border-x bg-gray-100 border-gray-400 xl:min-w-[826px] lg:min-w-[626px] flex-grow max-w-xl max-h-screen overflow-auto">
            {children}            
        </div>
    );
}