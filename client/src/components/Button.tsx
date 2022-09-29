import { SVGProps } from 'react';

interface Props {
    Icon?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    title: string;
    active?: boolean;
    collapsible?: boolean;
    onClick: () => void;
}

function Button({ Icon, title, active, collapsible, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="hidden h-12 text-lg font-bold text-white bg-blue-400 rounded-full shadow-md w-36 hover:brightness-95 xl:inline"
        >
            {title}
        </button>
    );
}

export default Button;
