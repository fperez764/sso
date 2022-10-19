import Image from 'next/image';
import { useState } from 'react';
import News from './News';
import SearchBar from './SS/SearchBar';

interface Props {
    children: any;
}

function Widgets({ children }: Props) {
    return (
        <div className="xl:w-[600px] lg:w-[370px] hidden lg:inline mt-2 space-y-5 overflow-x-hidden">
            {children}
        </div>
    );
}

export default Widgets;
