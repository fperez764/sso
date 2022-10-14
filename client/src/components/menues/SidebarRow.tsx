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
        <div className={`${active ? 'text-gray-600':'text-gray-300'} xl:ml-2 flex items-center justify-center space-x-3 text-lg hoverEffect xl:justify-start`}
        onClick={onClick}>
            <Icon className="w-6 h-6" />
            {hideTitle && <span className='hidden xl:inline'>
                {title}
            </span>}
        </div>
    );
}

export default SidebarRow;
