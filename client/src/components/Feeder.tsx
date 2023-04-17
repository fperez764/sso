interface Props {
    children: any;
}

/**
 * Muestra objetos(post) en una tablas + las q creaste tu o que te corresponden?(caso de solicitudes) individualmente 
 * @returns
 */
export default function Feeder({children}: Props) {
    return (
        <div className="xl:ml-[92px] min-w-[40%] sm:ml-[54px] resize-x flex-grow max-h-screen overflow-y-auto overflow-x-hidden pt-2">
            {children}            
        </div>
    );
}