import { SVGProps } from 'react';

interface Props {
    Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    title?: string;
    active?: boolean;
    collapsible?: boolean;
    onClick: () => void;
}

function Button({ Icon, title, active, collapsible, onClick }: Props) {
    return (
        <div className="self-center mx-1">
        <button
            onClick={onClick}
            className="flex items-center h-12 text-lg font-bold text-white bg-blue-400 rounded-full shadow-md hover:brightness-95"
        >
            {Icon && <Icon className="w-6 h-6 mx-2"/>}
            {title && <p className="mx-2">{title}</p>}
        </button>
        </div>
    );
}

export default Button;
