import { SVGProps } from 'react';

interface Props {
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    title: string;
    active?: boolean;
}

function SidebarRow({ Icon, title, active }: Props) {
    return (
        <div className={`${active ? 'text-gray-600':'text-gray-300'} flex items-center justify-center space-x-3 text-lg hoverEffect xl:justify-start`}>
            <Icon className="w-6 h-6" />
            <span className="hidden xl:inline">
                {title}
            </span>
        </div>
    );
}

export default SidebarRow;
