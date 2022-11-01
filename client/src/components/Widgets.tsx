import Image from 'next/image';
import { useState } from 'react';
import News from './News';
import SearchBar from './SS/SearchBar';

interface Props {
    children: any;
}

function Widgets({ children }: Props) {
    return (
        <div className="hidden w-full space-y-5 overflow-x-hidden bg-gray-200 md:inline">
            {children}
        </div>
    );
}

export default Widgets;
