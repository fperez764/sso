import { SVGProps } from 'react';

interface Props {
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    title: string;
    active?: boolean;
}

function SidebarRow({ Icon, title, active }: Props) {
    return (
        <div className="hoverEffect flex items-center text-gray-700 justify-center xl:justify-start text-lg space-x-3">
            <Icon className="h-6 w-6" />
            <span className={`${active && 'font-bold'} hidden xl:inline`}>
                {title}
            </span>
        </div>
    );
}

export default SidebarRow;
