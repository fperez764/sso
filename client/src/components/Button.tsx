import { SVGProps } from 'react';

interface Props {
    Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    title?: string;
    onClick: () => void;
    disabled?: boolean;
}

function Button({ Icon, title, disabled, onClick }: Props) {
    return (
        <div className="self-center mx-1">
        <button
            disabled={!!disabled}
            onClick={onClick}
            className={`flex items-center h-8 text-lg text-white bg-${disabled ? 'gray' : 'blue'}-400 rounded-full shadow-md hover:brightness-95`}
        >
            {Icon && <Icon className="w-6 h-6 mx-1"/>}
            {title && <p className="mx-1 text-sm">{title}</p>}
        </button>
        </div>
    );
}

export default Button;
