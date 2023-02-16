import Image from 'next/image';
import { useState } from 'react';
import News from './News';
import SearchBar from './SearchBar';

interface Props {
    children: any;
}

function Widgets({ children }: Props) {
    return (
        <div className="flex-grow hidden w-full px-2 py-3 space-y-5 overflow-x-hidden bg-gray-200 md:inline">
            {children}
        </div>
    );
}

export default Widgets;
