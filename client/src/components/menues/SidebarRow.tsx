import { MouseEventHandler, SVGProps } from 'react';

interface Props {
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    title: string;
    active?: boolean;
    hideTitle: boolean;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

function SidebarRow({ Icon, title, active, onClick, hideTitle }: Props) {
    return (
    active ? <div className={`${active ? 'text-gray-600':'text-gray-300'} ${hideTitle ? 'justify-start': 'justify-center'} bg-white flex items-center space-x-3 xl:px-1 mx-3 px-3 text-lg hoverEffect`}
        onClick={onClick}>
            <Icon className="w-6 h-6" />
            {hideTitle && <span>
                {title}
            </span>}
        </div> : null
    );
}

export default SidebarRow;
