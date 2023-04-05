import { SVGProps } from 'react';
import router from 'next/router';

interface Props {
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    title: string;
    disabled?: boolean;
    hideTitle: boolean;
    redirectTo: string;
}

function SidebarRow({ Icon, title, disabled, redirectTo, hideTitle }: Props) {
    return (
    <div className={`${!disabled ? 'text-gray-600':'text-gray-300'} ${hideTitle ? 'justify-start': 'justify-center'} bg-white flex items-center space-x-3 xl:px-1 mx-3 px-3 text-lg hoverEffect`}
        onClick={()=>router.push(redirectTo)}>
            <Icon className="w-6 h-6" />
            {hideTitle && <span>
                {title}
            </span>}
        </div>
    );
}

export default SidebarRow;
