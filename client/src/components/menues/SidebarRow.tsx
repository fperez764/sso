import { SVGProps, useState } from 'react';
import router from 'next/router';

interface Props {
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    title: string;
    disabled?: boolean;
    hideTitle: boolean;
    redirectTo: string;
    badge?: number; 
}

function SidebarRow({ Icon, title, disabled, redirectTo, hideTitle, badge }: Props) {
    const [showBadge, setShowBadge] = useState(true);
    return (
    <div className={`${!disabled ? 'text-gray-600':'text-gray-300'} ${hideTitle ? 'justify-start': 'justify-center'} bg-white flex items-center space-x-3 xl:px-1 mx-3 px-3 text-lg hoverEffect`}
        onClick={()=>{
            router.push(redirectTo);
            setShowBadge(false);
        }}>
            <Icon className="w-6 h-6" />
            {!!badge && badge > 0 && showBadge && <div className='absolute flex items-center justify-center w-5 h-5 mt-10 bg-red-400 rounded-full'><p className='text-sm text-white'>{badge}</p></div>}
            {hideTitle && <span className=''>
                {title}
            </span>}
        </div>
    );
}

export default SidebarRow;
