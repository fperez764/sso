import { AnySoaRecord } from 'dns';
import { MouseEventHandler, SVGProps } from 'react';

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
            className="bg-blue-400 text-white rounded-full w-36 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline"
        >
            {title}
        </button>
    );
}

export default Button;
