interface Props {
    children: any;
}

/**
 * Muestra objetos(post) en una tablas + las q creaste tu o que te corresponden?(caso de solicitudes) individualmente 
 * @returns
 */
export default function Feeder({children}: Props) {
    return (
        <div className="resize-x xl:ml-[92px] sm:ml-[54px] xl:min-w-[826px] lg:min-w-[626px] flex-grow max-h-screen overflow-y-auto overflow-x-hidden">
            {children}            
        </div>
    );
}